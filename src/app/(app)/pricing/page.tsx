
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
    {
        name: 'Free',
        price: '$0',
        description: 'Get started on your journey with core features.',
        features: ['AI Chatbot (Limited)', 'Daily Mood Tracker', 'Task Manager'],
        isPrimary: false,
    },
    {
        name: 'Zenith Plus',
        price: '$9.99',
        description: 'Unlock the full potential of Elysium.',
        features: ['All Free features', 'Unlimited AI Chatbot', 'AI Journal', 'Thought Quest Game', 'Full Exercise Library', 'Advanced Analytics'],
        isPrimary: true,
    },
    {
        name: 'Guided',
        price: '$49.99',
        description: 'Personalized support with a human touch.',
        features: ['All Zenith Plus features', 'Monthly session with a coach', 'Personalized wellness plan'],
        isPrimary: false,
    },
]

export default function PricingPage() {
  return (
     <div className="flex flex-col items-center gap-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Find Your Plan</h1>
            <p className="text-muted-foreground">
              Choose the plan that's right for your mental wellness journey.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {tiers.map(tier => (
                <Card key={tier.name} className={`flex flex-col ${tier.isPrimary ? 'border-primary ring-2 ring-primary' : ''}`}>
                    <CardHeader>
                        <CardTitle className="font-headline">{tier.name}</CardTitle>
                        <p className="text-3xl font-bold">{tier.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                        <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2">
                           {tier.features.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-green-500"/>
                                    <span>{feature}</span>
                                </li>
                           ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant={tier.isPrimary ? 'default' : 'outline'}>
                            {tier.isPrimary ? 'Get Started Now' : 'Choose Plan'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
     </div>
  );
}

    