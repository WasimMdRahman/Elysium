import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Wind, Zap, Smile } from "lucide-react";

const exercises = {
    anxiety: [
        { title: '5-4-3-2-1 Grounding', description: 'Use your five senses to find calm.', duration: '5 min' },
        { title: 'Box Breathing', description: 'A simple technique to regulate your breath.', duration: '3 min' },
        { title: 'Progressive Muscle Relaxation', description: 'Release tension throughout your body.', duration: '15 min' },
    ],
    stress: [
        { title: 'Mindful Observation', description: 'Focus on a single object to calm your mind.', duration: '5 min' },
        { title: 'Body Scan Meditation', description: 'Bring awareness to different parts of your body.', duration: '10 min' },
    ],
    "low-mood": [
        { title: 'Gratitude Journaling', description: 'Reflect on three things you are grateful for.', duration: '5 min' },
        { title: 'Behavioral Activation', description: 'Engage in a small, enjoyable activity.', duration: 'Varies' },
    ],
    focus: [
        { title: 'Mindful Breathing', description: 'Anchor your attention to your breath.', duration: '5 min' },
    ]
}

type Category = keyof typeof exercises;

const categoryInfo = {
    anxiety: { icon: Wind, label: "Anxiety" },
    stress: { icon: Zap, label: "Stress" },
    "low-mood": { icon: Smile, label: "Low Mood" },
    focus: { icon: Brain, label: "Focus" },
}

export default function ExercisesPage() {
  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Mental Health Exercises</h1>
            <p className="text-muted-foreground">
              A library of guided exercises to help you navigate life's challenges.
            </p>
        </div>

        <Tabs defaultValue="anxiety" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {(Object.keys(exercises) as Category[]).map(cat => {
                    const Info = categoryInfo[cat];
                    return (
                        <TabsTrigger key={cat} value={cat}><Info.icon className="mr-2 h-4 w-4" />{Info.label}</TabsTrigger>
                    );
                })}
            </TabsList>
            {(Object.keys(exercises) as Category[]).map(cat => (
                <TabsContent key={cat} value={cat}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                        {exercises[cat].map(ex => (
                            <Card key={ex.title} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardHeader>
                                    <CardTitle>{ex.title}</CardTitle>
                                    <CardDescription>{ex.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground">{ex.duration}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    </div>
  );
}
