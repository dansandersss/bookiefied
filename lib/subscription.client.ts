import { useUser, useAuth } from "@clerk/nextjs";
import { PLANS, PlanType } from "@/lib/subscription-constants";

export const useSubscription = () => {
    const { user, isLoaded: isUserLoaded } = useUser();
    const { has, isLoaded: isAuthLoaded } = useAuth();

    const isLoaded = isUserLoaded && isAuthLoaded;

    if (!isLoaded || !user) {
        return {
            plan: PLANS.FREE,
            isLoaded,
            isSignedIn: !!user,
        };
    }

    let plan: PlanType = PLANS.FREE;
    if (has?.({ plan: "pro" })) {
        plan = PLANS.PRO;
    } else if (has?.({ plan: "standard" })) {
        plan = PLANS.STANDARD;
    } else {
        const metadataPlan = (
            user?.publicMetadata?.plan ||
            user?.publicMetadata?.billingPlan
        )?.toString().toLowerCase();

        if (metadataPlan === 'pro') plan = PLANS.PRO;
        else if (metadataPlan === 'standard') plan = PLANS.STANDARD;
    }

    return {
        plan,
        isLoaded,
        isSignedIn: true,
    };
};
