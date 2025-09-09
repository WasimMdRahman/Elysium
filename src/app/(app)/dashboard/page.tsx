
'use client';

import { useState } from 'react';
import { DashboardCard } from "@/components/dashboard-card";
import {
  Bot,
  HeartPulse,
  BookText,
  ListTodo,
  BrainCircuit,
  Waves,
  Flame,
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
    title: "AI Journal",
    description: "Reflect with an intelligent journal",
    icon: BookText,
  },
  {
    href: "/tasks",
    title: "Task Manager",
    description: "Organize your daily to-do list",
    icon: ListTodo,
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
  {
    href: "/streak-tracker",
    title: "Streak Tracker",
    description: "Build habits and track consistency",
    icon: Flame,
  },
];

export default function DashboardPage() {
  const [loadingCard, setLoadingCard] = useState<string | null>(null);
  const router = useRouter();

  const handleCardClick = (href: string) => {
    setLoadingCard(href);
    router.push(href);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Good Morning!</h1>
        <p className="text-muted-foreground">
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
