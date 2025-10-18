
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

const dailyQuotes = [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { quote: "Your limitation is only your imagination.", author: "Unknown" },
    { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { quote: "Great things never come from comfort zones.", author: "Unknown" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
    { quote: "The mind is everything. What you think you become.", author: "Buddha" },
];


export default function DashboardPage() {
  const [loadingCard, setLoadingCard] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState({ quote: '', author: '' });
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
    
    const getDailyQuote = () => {
      const now = new Date();
      // Use the day of the year to cycle through quotes
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
      const quoteIndex = dayOfYear % dailyQuotes.length;
      setQuote(dailyQuotes[quoteIndex]);
    };

    setGreeting(getGreeting());
    getDailyQuote();
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
      
      <div className="mt-6 text-center">
        <div className="bg-card border rounded-lg p-6">
            <p className="text-lg italic text-foreground">"{quote.quote}"</p>
            <p className="mt-4 text-sm font-semibold text-primary">- {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
