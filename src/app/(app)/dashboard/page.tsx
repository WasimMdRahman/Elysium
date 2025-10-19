
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
import { motion } from 'framer-motion';


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
    title: "Voice Biomarker",
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


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
    }
  },
};


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
    <motion.div 
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
       <motion.div className="bg-accent text-accent-foreground p-6 rounded-lg" variants={itemVariants}>
        <h1 className="text-3xl font-bold font-headline">{greeting}</h1>
        <p className="text-accent-foreground/80">
          Here are your tools for a mindful day.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants} // You can reuse container variants if you want to stagger the cards too
      >
        {features.map((feature) => (
          <motion.div key={feature.href} variants={itemVariants}>
            <DashboardCard
              href={feature.href}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isLoading={loadingCard === feature.href}
              onClick={() => handleCardClick(feature.href)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
