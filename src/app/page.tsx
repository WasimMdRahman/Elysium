
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Bot, BrainCircuit, CheckCircle, Flame, HeartPulse, ListTodo, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';

const walkthroughSteps = [
  {
    icon: Sparkles,
    title: 'Welcome to Elysium',
    description: 'Your personal companion for mental clarity and well-being. Let\'s take a quick tour of the features designed to support you on your journey.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Support',
    description: 'Engage with our 24/7 AI Chatbot for mental health support, gain insights with our AI Journal, and challenge negative thoughts with the Thought Quest game.',
  },
  {
    icon: HeartPulse,
    title: 'Track Your Progress',
    description: 'Monitor your emotional landscape with the Mood Tracker, stay on top of your goals with the Task Manager, and build positive habits with the Daily Streak Tracker.',
  },
  {
    icon: BrainCircuit,
    title: 'Guided Exercises',
    description: 'Explore a library of mental health exercises tailored to various challenges like anxiety and stress, helping you find calm and build resilience.',
  },
  {
    icon: CheckCircle,
    title: 'Ready to Begin?',
    description: 'You\'ve seen what Elysium has to offer. Take the next step towards a healthier, more balanced mind by creating your account.',
  },
];

export default function WalkthroughPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
      if (hasSeenWalkthrough) {
        router.replace('/dashboard');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to access localStorage', error);
      setIsLoading(false);
    }
  }, [router]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, walkthroughSteps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const handleGetStarted = () => {
    try {
        localStorage.setItem('hasSeenWalkthrough', 'true');
    } catch (error) {
        console.error('Failed to set localStorage item', error);
    }
    router.push('/dashboard');
  }

  if (isLoading) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            {/* You can add a loading spinner here if you want */}
        </div>
    );
  }

  const { icon: Icon, title, description } = walkthroughSteps[currentStep];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2 text-lg font-bold text-foreground">
        
        <h1 className="font-headline">Elysium</h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <Icon className="h-8 w-8" />
            </motion.div>
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          <CardDescription className="px-4">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center space-x-2">
            {walkthroughSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentStep === index ? 'w-6 bg-primary' : 'bg-muted-foreground/20'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < walkthroughSteps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleGetStarted} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
