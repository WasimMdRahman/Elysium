
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Bot, HeartPulse, BookText, BrainCircuit } from 'lucide-react';
import { redirect } from 'next/navigation';

const walkthroughSteps = [
    {
        icon: Bot,
        title: 'Welcome to Elysium',
        description: 'Your private, AI-powered companion for mental wellness. Let\'s take a quick tour of your new toolkit.',
    },
    {
        icon: HeartPulse,
        title: 'Track Your Mood & Reflect',
        description: 'Log your daily mood to understand your emotional patterns and use the AI journal to explore your thoughts privately.',
    },
    {
        icon: BrainCircuit,
        title: 'Challenge Your Thoughts',
        description: 'Engage with CBT-based tools like the Thought Quest game to build healthier thinking habits.',
    },
    {
        icon: Bot,
        title: 'Ready to Begin?',
        description: 'Your dashboard is all set up. Start your journey towards a more mindful and balanced life.',
    }
];

export default function RootPage() {
    const [step, setStep] = useState(0);
    const [hasCompletedWalkthrough, setHasCompletedWalkthrough] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const completed = localStorage.getItem('walkthroughCompleted');
            if (completed === 'true') {
                setHasCompletedWalkthrough(true);
                router.push('/dashboard');
            } else {
                setHasCompletedWalkthrough(false);
            }
        } catch (error) {
            console.error("Could not read from localStorage", error);
            setHasCompletedWalkthrough(false);
        }
    }, [router]);

    const nextStep = () => {
        if (step < walkthroughSteps.length - 1) {
            setStep(prev => prev + 1);
        } else {
            try {
                localStorage.setItem('walkthroughCompleted', 'true');
            } catch (error) {
                console.error("Could not write to localStorage", error);
            }
            router.push('/dashboard');
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    const currentStepData = walkthroughSteps[step];
    const progress = ((step + 1) / walkthroughSteps.length) * 100;

    if (hasCompletedWalkthrough === null || hasCompletedWalkthrough === true) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                {/* Optional: Add a loading spinner here */}
            </div>
        );
    }
    
    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardContent className="p-8 text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                                <currentStepData.icon className="h-8 w-8" />
                            </div>
                            <h2 className="text-2xl font-bold font-headline mb-2">{currentStepData.title}</h2>
                            <p className="text-muted-foreground min-h-[72px]">{currentStepData.description}</p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-8 flex flex-col gap-4">
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" onClick={prevStep} disabled={step === 0}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button onClick={nextStep}>
                                {step === walkthroughSteps.length - 1 ? 'Go to Dashboard' : 'Next'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
