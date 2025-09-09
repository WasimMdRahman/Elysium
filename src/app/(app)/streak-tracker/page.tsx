
'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Flame, Star, Award, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// In a real app, this data would come from a backend and be managed by user state.
const initialActivities = [
    { name: 'Mood Logged', icon: Flame, currentStreak: 0, longestStreak: 0 },
    { name: 'Journal Entry', icon: Flame, currentStreak: 0, longestStreak: 0 },
    { name: 'Task Completed', icon: Flame, currentStreak: 0, longestStreak: 0 },
    { name: 'Exercise Done', icon: Flame, currentStreak: 0, longestStreak: 0 },
];

const initialAchievements = [
    { name: '7-Day Streak', icon: Award, unlocked: false, description: "Maintain a 7-day streak in any activity." },
    { name: '30-Day Streak', icon: Award, unlocked: false, description: "Maintain a 30-day streak." },
    { name: 'First Journal Entry', icon: Award, unlocked: false, description: "Write your first journal entry." },
    { name: 'Mindful Master', icon: Award, unlocked: false, description: "Complete 10 exercises." },
];

export default function StreakTrackerPage() {
    const [activities, setActivities] = useState(initialActivities);
    const [achievements, setAchievements] = useState(initialAchievements);
    const [xp, setXp] = useState(0);
    const [ap, setAp] = useState(0);

    const level = Math.floor(xp / 1000) + 1;
    const xpForNextLevel = 1000;
    const currentLevelXp = xp % 1000;
    const progressToNextLevel = (currentLevelXp / xpForNextLevel) * 100;


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-3">
             <h1 className="text-3xl font-bold font-headline">Your Progress</h1>
            <p className="text-muted-foreground">
                Stay consistent and watch your well-being grow.
            </p>
        </div>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Points & Level</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    <span className="text-3xl font-bold">{xp} XP</span>
                </div>
                 <div className="flex items-center justify-center gap-2">
                    <Star className="h-6 w-6 text-amber-500" />
                    <span className="text-3xl font-bold">{ap} AP</span>
                </div>
                <div className="w-full pt-4">
                    <p className="text-sm font-medium">Level {level}</p>
                    <Progress value={progressToNextLevel} className="w-full"/>
                    <p className="text-xs text-muted-foreground mt-1">{xpForNextLevel - currentLevelXp} XP to Level {level + 1}</p>
                </div>
            </CardContent>
        </Card>
      
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">Activity Streaks</CardTitle>
                <CardDescription>Consistency is key to building healthy habits.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map(activity => (
                    <div key={activity.name} className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <activity.icon className={`h-6 w-6 ${activity.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                            <span className="font-medium">{activity.name}</span>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{activity.currentStreak} Days</p>
                            <p className="text-xs text-muted-foreground">Best: {activity.longestStreak}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Achievements & Medals</CardTitle>
                <CardDescription>Milestones on your mental wellness journey.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                {achievements.map(ach => (
                    <div key={ach.name} title={ach.description} className={`flex flex-col items-center gap-2 p-4 rounded-lg w-32 text-center ${ach.unlocked ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-muted'}`}>
                        <ach.icon className={`h-8 w-8 ${ach.unlocked ? 'text-amber-500' : 'text-muted-foreground'}`}/>
                        <p className={`text-sm font-medium ${ach.unlocked ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>{ach.name}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

    </div>
  );
}
