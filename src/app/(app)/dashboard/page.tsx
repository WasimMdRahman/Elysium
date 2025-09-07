import { DashboardCard } from "@/components/dashboard-card";
import {
  Bot,
  HeartPulse,
  BookText,
  ListTodo,
  BrainCircuit,
  Waves,
} from "lucide-react";

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
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Good Morning, Alex!</h1>
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
          />
        ))}
      </div>
    </div>
  );
}
