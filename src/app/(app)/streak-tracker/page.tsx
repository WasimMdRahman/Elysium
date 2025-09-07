import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Flame, Star, Award, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const activities = [
    { name: 'Mood Logged', icon: Flame, currentStreak: 14, longestStreak: 25 },
    { name: 'Journal Entry', icon: Flame, currentStreak: 8, longestStreak: 12 },
    { name: 'Task Completed', icon: Flame, currentStreak: 21, longestStreak: 21 },
    { name: 'Exercise Done', icon: Flame, currentStreak: 3, longestStreak: 10 },
];

const achievements = [
    { name: '7-Day Streak', icon: Award, unlocked: true },
    { name: '30-Day Streak', icon: Award, unlocked: false },
    { name: 'First Journal Entry', icon: Award, unlocked: true },
    { name: 'Mindful Master', icon: Award, unlocked: false },
]

export default function StreakTrackerPage() {
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
                    <span className="text-3xl font-bold">1,250 XP</span>
                </div>
                 <div className="flex items-center justify-center gap-2">
                    <Star className="h-6 w-6 text-amber-500" />
                    <span className="text-3xl font-bold">300 AP</span>
                </div>
                <div className="w-full pt-4">
                    <p className="text-sm font-medium">Level 5</p>
                    <Progress value={60} className="w-full"/>
                    <p className="text-xs text-muted-foreground mt-1">450 XP to Level 6</p>
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
                            <activity.icon className="h-6 w-6 text-orange-500" />
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
                    <div key={ach.name} className={`flex flex-col items-center gap-2 p-4 rounded-lg w-32 text-center ${ach.unlocked ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-muted'}`}>
                        <ach.icon className={`h-8 w-8 ${ach.unlocked ? 'text-amber-500' : 'text-muted-foreground'}`}/>
                        <p className={`text-sm font-medium ${ach.unlocked ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>{ach.name}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

    </div>
  );
}
