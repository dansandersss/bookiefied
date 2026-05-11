import { PricingTable } from "@clerk/nextjs";

export default function SubscriptionsPage() {
    return (
        <div className="container wrapper py-16">
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className="text-4xl font-bold font-serif mb-4 text-foreground">Choose Your Plan</h1>
                <p className="text-muted-foreground max-w-2xl text-lg">
                    Upgrade to unlock more books, longer sessions, and advanced features.
                </p>
            </div>

            <div className="flex justify-center">
                <PricingTable
                    appearance={{
                        elements: {
                            root: "w-full max-w-5xl",
                            card: "border border-border shadow-soft bg-card rounded-2xl overflow-hidden",
                            button: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                            badge: "bg-secondary text-secondary-foreground font-medium",
                        },
                        variables: {
                            colorPrimary: "#212a3b",
                            borderRadius: "0.625rem",
                            fontFamily: "var(--font-mona-sans)",
                        }
                    }}
                />
            </div>

            <div className="mt-20 max-w-3xl mx-auto">
                <div className="bg-secondary/30 p-8 rounded-2xl border border-border">
                    <h2 className="text-2xl font-serif font-bold mb-6 text-center">Plan Limits at a Glance</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <h3 className="font-bold border-b border-border pb-2">Free</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>1 book limit</li>
                                <li>5 sessions / month</li>
                                <li>5 min per session</li>
                                <li>No history</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold border-b border-border pb-2">Standard</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>10 books limit</li>
                                <li>100 sessions / month</li>
                                <li>15 min per session</li>
                                <li>Full history</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold border-b border-border pb-2">Pro</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>100 books limit</li>
                                <li>Unlimited sessions</li>
                                <li>60 min per session</li>
                                <li>Full history</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}