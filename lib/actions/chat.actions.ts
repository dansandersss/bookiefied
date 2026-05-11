'use server'

import {connectToDatabase} from "@/database/mongoose";
import ChatMessage from "@/database/models/chat-message.model";
import {serializeData} from "@/lib/utils";
import {auth} from "@clerk/nextjs/server";

export const getChatHistory = async (bookId: string) => {
    try {
        await connectToDatabase();
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const messages = await ChatMessage.find({
            clerkId: userId,
            bookId: bookId
        }).sort({ createdAt: 1 }).lean();

        return {
            success: true,
            data: serializeData(messages)
        };
    } catch (e) {
        console.error('Error fetching chat history', e);
        return { success: false, error: 'Failed to fetch chat history' };
    }
}

export const clearChatHistory = async (bookId: string) => {
    try {
        await connectToDatabase();
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        await ChatMessage.deleteMany({
            clerkId: userId,
            bookId: bookId
        });

        return {
            success: true
        };
    } catch (e) {
        console.error('Error clearing chat history', e);
        return { success: false, error: 'Failed to clear chat history' };
    }
}

export const saveChatMessage = async (bookId: string, role: string, content: string) => {
    try {
        await connectToDatabase();
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const message = await ChatMessage.create({
            clerkId: userId,
            bookId,
            role,
            content
        });

        return {
            success: true,
            data: serializeData(message)
        };
    } catch (e) {
        console.error('Error saving chat message', e);
        return { success: false, error: 'Failed to save chat message' };
    }
}
