
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Bot, HeartPulse, BookText, BrainCircuit, Waves, CheckCircle } from 'lucide-react';
import Image from 'next/image';


const features = [
    {
        icon: Bot,
        title: 'AI Chatbot',
        description: 'Get 24/7 mental health support with a conversational AI that listens and helps you reflect.'
    },
    {
        icon: HeartPulse,
        title: 'Mood Tracker',
        description: 'Log and visualize your daily mood to understand emotional patterns over time.'
    },
    {
        icon: BookText,
        title: 'AI Journal',
        description: 'A smart journal that helps you process your thoughts and provides insightful summaries.'
    },
    {
        icon: BrainCircuit,
        title: 'Thought Quest Game',
        description: 'A fun CBT-based game to identify and challenge unhelpful thought patterns.'
    },
    {
        icon: Waves,
        title: 'Guided Exercises',
        description: 'Access a library of guided exercises for anxiety, stress, focus, and more.'
    },
    {
        icon: CheckCircle,
        title: 'Task Manager',
        description: 'Organize your day and track wellness goals with a simple to-do list.'
    }
]

export default function LandingPage() {

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex items-center">
                        <span className="text-lg font-bold font-headline">Elysium</span>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <Button asChild>
                            <Link href="/dashboard">
                                Launch App <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="py-12 sm:py-24 md:py-32 lg:py-40">
                    <div className="container text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl md:text-6xl lg:text-7xl">
                                Your Personal Guide to <span className="text-primary">Mental Wellness</span>
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
                                Elysium is a private, AI-powered companion designed to help you navigate your thoughts, manage your mood, and build a healthier mind.
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <Button asChild size="lg">
                                    <Link href="/dashboard">
                                        Get Started for Free
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <Link href="#features">
                                        Learn More
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
                
                {/* Features Section */}
                <section id="features" className="py-12 sm:py-24 bg-muted/50">
                    <div className="container">
                         <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-headline sm:text-4xl">Everything You Need for a Balanced Mind</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                A complete toolkit of CBT-inspired features, right on your device.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full">
                                        <CardContent className="p-6">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                                                <feature.icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-bold font-headline mb-2">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                
                 {/* How to Install Section */}
                <section className="py-12 sm:py-24">
                    <div className="container">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold font-headline sm:text-4xl">Take Elysium With You</h2>
                                <p className="mt-4 text-muted-foreground">
                                    Install Elysium on your phone or computer in seconds for an app-like experience. It works offline, so your wellness tools are always available.
                                </p>
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</div>
                                        <p className="flex-1 text-muted-foreground">Open Elysium in a supported browser like Chrome or Safari.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</div>
                                        <p className="flex-1 text-muted-foreground">Look for the "Install App" or "Add to Home Screen" option in your browser's menu.</p>
                                    </div>
                                     <div className="flex items-start gap-4">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</div>
                                        <p className="flex-1 text-muted-foreground">Follow the prompt, and the Elysium icon will appear on your home screen!</p>
                                    </div>
                                </div>
                            </div>
                             <div className="flex-1 flex items-center justify-center">
                                 <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="relative w-64 h-64"
                                >
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                                    <Smartphone className="relative w-full h-full text-primary" />
                                </motion.div>
                             </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-6 border-t bg-muted/50">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Elysium. All rights reserved.</p>
                     <div className="flex items-center gap-4">
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
