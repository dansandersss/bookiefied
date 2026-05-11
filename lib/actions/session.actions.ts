'use server'

import {EndSessionResult, StartSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import {getCurrentBillingPeriodStart, PLAN_LIMITS} from "@/lib/subscription-constants";
import {getUserPlan} from "@/lib/subscription.server";

export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult>  => {
    try {
        await connectToDatabase();

        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];
        const billingPeriodStart = getCurrentBillingPeriodStart();

        // Check session limit for the current billing period
        if (limits.maxSessionsPerMonth !== Infinity) {
            const sessionCount = await VoiceSession.countDocuments({
                clerkId,
                billingPeriodStart
            });

            if (sessionCount >= limits.maxSessionsPerMonth) {
                return {
                    success: false,
                    error: `You have reached your monthly session limit for the ${plan} plan. Please upgrade for more sessions.`,
                    isBillingError: true,
                };
            }
        }
        
        const session = await VoiceSession.create({
            clerkId, 
            bookId, 
            startedAt: new Date(), 
            billingPeriodStart,
            durationSeconds: 0, 
        });
        
        return {
            success: true,
            sessionId: session._id.toString(),
            
            
        }
    } catch (e) {
        console.error('Error starting session', e);
        return { success: false, error: 'Failed to start session' };
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        await connectToDatabase();

        const session = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds: durationSeconds,
        });

        if (!session) {
            return { success: false, error: 'Session not found' };
        }

        return { success: true };
    } catch (e) {
        console.error('Error ending session', e);
        return { success: false, error: 'Failed to end session' };
    }
}

