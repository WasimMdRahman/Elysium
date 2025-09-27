
'use client';

import { useState, useEffect } from 'react';
import { DashboardCard } from "@/components/dashboard-card";
import {
  Bot,
  HeartPulse,
  BookText,
  BrainCircuit,
  Waves,
  AudioWaveform,
} from "lucide-react";
import { useRouter } from 'next/navigation';

const features = [
  {
    href: "/chatbot",
    title: "AI Chatbot",
    description: "24/7 mental health support",
    icon: Bot,
  },
  {
    href: "/mood-tracker",
    title: "Mood Tracker",
    description: "Log and visualize your daily mood",
    icon: HeartPulse,
  },
  {
    href: "/journal",
    title: "Journal",
    description: "Reflect with an intelligent journal",
    icon: BookText,
  },
  {
    href: "/voice-journal",
    title: "Voice Biomarker Analysis",
    description: "Analyze your voice for emotional insights",
    icon: AudioWaveform,
  },
  {
    href: "/thought-quest",
    title: "Thought Quest",
    description: "A CBT game to challenge thoughts",
    icon: BrainCircuit,
  },
  {
    href: "/exercises",
    title: "Mental Health Exercises",
    description: "Guided practices for wellness",
    icon: Waves,
  },
];

export default function DashboardPage() {
  const [loadingCard, setLoadingCard] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return "Good Morning!";
        } else if (currentHour < 18) {
            return "Good Afternoon!";
        } else {
            return "Good Evening!";
        }
    }
    setGreeting(getGreeting());
  }, []);

  const handleCardClick = (href: string) => {
    setLoadingCard(href);
    router.push(href);
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="bg-accent text-accent-foreground p-6 rounded-lg">
        <h1 className="text-3xl font-bold font-headline">{greeting}</h1>
        <p className="text-accent-foreground/80">
          Here are your tools for a mindful day.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <DashboardCard
            key={feature.href}
            href={feature.href}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            isLoading={loadingCard === feature.href}
            onClick={() => handleCardClick(feature.href)}
          />
        ))}
      </div>
    </div>
  );
}
