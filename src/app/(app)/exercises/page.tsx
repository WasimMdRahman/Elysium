
'use client';

import { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Wind, Zap, Smile, Heart, Users, Shield, BookOpen, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import placeholderImages from '@/lib/placeholder-images.json';


const exercises = {
    anxiety: [
        { title: '5-4-3-2-1 Grounding', description: 'Use your five senses to find calm.', duration: '5 min' },
        { title: 'Box Breathing', description: 'A simple technique to regulate your breath.', duration: '3 min' },
        { title: 'Progressive Muscle Relaxation', description: 'Release tension throughout your body.', duration: '15 min' },
        { title: 'Mindful Walking', description: 'Pay attention to the sensation of walking.', duration: '10 min' },
        { title: 'Worry Time', description: 'Set aside a specific time to acknowledge worries.', duration: '15 min' },
    ],
    stress: [
        { title: 'Mindful Observation', description: 'Focus on a single object to calm your mind.', duration: '5 min' },
        { title: 'Body Scan Meditation', description: 'Bring awareness to different parts of your body.', duration: '10 min' },
        { title: 'Guided Imagery', description: 'Visualize a peaceful scene to relax.', duration: '10 min' },
        { title: 'Deep Abdominal Breathing', description: 'Engage your diaphragm for deep relaxation.', duration: '7 min' },
    ],
    "low-mood": [
        { title: 'Gratitude Journaling', description: 'Reflect on three things you are grateful for.', duration: '5 min' },
        { title: 'Behavioral Activation', description: 'Engage in a small, enjoyable activity.', duration: 'Varies' },
        { title: 'Upbeat Music', description: 'Listen to music that lifts your spirits.', duration: '10 min' },
        { title: 'Three Good Things', description: 'At the end of the day, list three things that went well.', duration: '5 min' },
        { title: 'Mindful Self-Compassion', description: 'Treat yourself with the same kindness you\'d give a friend.', duration: '10 min' },
    ],
    focus: [
        { title: 'Mindful Breathing', description: 'Anchor your attention to your breath.', duration: '5 min' },
        { title: 'Pomodoro Technique', description: 'Work in focused 25-minute intervals.', duration: '25 min' },
        { title: 'Single-Tasking', description: 'Focus on one task at a time without distractions.', duration: 'Varies' },
        { title: 'Distraction To-Do List', description: 'Jot down distractions to address later.', duration: '2 min' },
        { title: 'Mindful Listening', description: 'Focus on all the sounds around you.', duration: '5 min' },
    ],
    selfEsteem: [
        { title: 'Positive Affirmations', description: 'Repeat positive statements about yourself.', duration: '2 min' },
        { title: 'Strengths Exploration', description: 'List your personal strengths and accomplishments.', duration: '10 min' },
        { title: 'Self-Compassion Break', description: 'Offer yourself kindness in moments of pain.', duration: '5 min' },
        { title: 'Challenge Critical Self-Talk', description: 'Question and reframe negative thoughts about yourself.', duration: '10 min' },
    ],
    relationships: [
        { title: 'Active Listening', description: 'Practice fully hearing your partner or friend.', duration: '10 min' },
        { title: 'Expressing Appreciation', description: 'Share what you appreciate about someone.', duration: '5 min' },
        { title: '"I" Statements', description: 'Communicate your feelings without blame.', duration: 'Varies' },
        { title: 'Mindful Conflict Resolution', description: 'Approach disagreements with calm awareness.', duration: '15 min' },
        { title: 'Loving-Kindness Meditation', description: 'Send well wishes to yourself and others.', duration: '10 min' },
        { title: 'Shared Goal Setting', description: 'Collaboratively set and work towards a shared goal.', duration: '20 min' },
    ],
    trauma: [
        { title: 'Container Exercise', description: 'Visualize a container to hold distressing thoughts.', duration: '10 min' },
        { title: 'Safe Place Visualization', description: 'Imagine a place where you feel completely safe.', duration: '10 min' },
        { title: 'Grounding with an Object', description: 'Focus on the sensory details of an object.', duration: '5 min' },
        { title: 'Resourcing', description: 'Identify and recall internal strengths and external supports.', duration: '10 min' },
        { title: 'Pendulation', description: 'Gently move your attention between distress and a feeling of safety.', duration: '5 min' },
    ],
    learning: [
        { title: 'Feynman Technique', description: 'Explain a concept simply to test your understanding.', duration: '15 min' },
        { title: 'Spaced Repetition', description: 'Review information at increasing intervals.', duration: 'Varies' },
        { title: 'Mind Mapping', description: 'Visually organize information to improve recall.', duration: '20 min' },
        { title: 'The Cornell Method', description: 'A system for taking, organizing, and reviewing notes.', duration: 'Varies' },
        { title: 'Retrieval Practice', description: 'Actively recall information from memory.', duration: '10 min' },
        { title: 'Interleaving', description: 'Mix different topics or skills in one study session.', duration: 'Varies' },
    ]
}

type Category = keyof typeof exercises;

const categoryInfo = {
    anxiety: { icon: Wind, label: "Anxiety", description: "Find calm and peace.", image: placeholderImages.exercises.anxiety },
    stress: { icon: Zap, label: "Stress", description: "Melt away tension.", image: placeholderImages.exercises.stress },
    "low-mood": { icon: Smile, label: "Low Mood", description: "Lift your spirits.", image: placeholderImages.exercises["low-mood"] },
    focus: { icon: Brain, label: "Focus", description: "Sharpen your concentration.", image: placeholderImages.exercises.focus },
    selfEsteem: { icon: Heart, label: "Self-Esteem", description: "Build your confidence.", image: placeholderImages.exercises.selfEsteem },
    relationships: { icon: Users, label: "Relationships", description: "Improve your connections.", image: placeholderImages.exercises.relationships },
    trauma: { icon: Shield, label: "Trauma", description: "Gentle healing practices.", image: placeholderImages.exercises.trauma },
    learning: { icon: BookOpen, label: "Learning", description: "Enhance your cognitive skills.", image: placeholderImages.exercises.learning }
}

export default function ExercisesPage() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    if (selectedCategory) {
        const Info = categoryInfo[selectedCategory];
        const categoryExercises = exercises[selectedCategory];
        return (
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
            >
                <div>
                    <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Info.icon className="h-6 w-6" />
                        </div>
                        <div>
                             <h1 className="text-3xl font-bold font-headline">{Info.label} Exercises</h1>
                             <p className="text-muted-foreground">
                                Guided practices to help you {Info.description.toLowerCase()}
                             </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                    {categoryExercises.map(ex => (
                        <Card key={ex.title} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle>{ex.title}</CardTitle>
                                <CardDescription>{ex.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-bold text-primary">{ex.duration}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
        )
    }

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Mental Health Exercises</h1>
            <p className="text-muted-foreground">
              A library of guided exercises to help you navigate life's challenges. Select a category to begin.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(Object.keys(exercises) as Category[]).map(cat => {
                const Info = categoryInfo[cat];
                return (
                    <motion.div
                        key={cat}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Card 
                            onClick={() => setSelectedCategory(cat)}
                            className="relative h-48 flex flex-col justify-end text-left cursor-pointer overflow-hidden group transition-shadow hover:shadow-xl rounded-lg"
                        >
                            <Image 
                                src={Info.image.src} 
                                alt={Info.label} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                data-ai-hint={Info.image.hint}
                                width={400}
                                height={300}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <CardHeader className="relative z-10 text-white">
                                <CardTitle className="font-headline">{Info.label}</CardTitle>
                                <CardDescription className="text-white/80">{Info.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    </div>
  );
}
