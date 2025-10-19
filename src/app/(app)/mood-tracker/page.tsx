
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isWithinInterval, isSameDay, startOfDay } from 'date-fns';
import { aiChatbotMentalHealthSupport } from '@/ai/flows/ai-chatbot-mental-health-support';
import { Bot, Loader, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type MoodEntry = {
    date: Date;
    mood: number;
};

const chartConfig = {
  mood: {
    label: 'Mood',
    color: 'hsl(var(--primary))',
  },
};

const moodLabels: { [key: number]: { label: string, emoji: string } } = {
  1: { label: 'Awful', emoji: '😩' },
  2: { label: 'Very Bad', emoji: '😫' },
  3: { label: 'Bad', emoji: '😞' },
  4: { label: 'Not Good', emoji: '😕' },
  5: { label: 'Okay', emoji: '😐' },
  6: { label: 'Fine', emoji: '🙂' },
  7: { label: 'Good', emoji: '😊' },
  8: { label: 'Very Good', emoji: '😁' },
  9: { label: 'Great', emoji: '😃' },
  10: { label: 'Excellent', emoji: '😍' },
};

const getMoodInfo = (moodValue: number) => {
    return moodLabels[moodValue] || moodLabels[5];
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const moodInfo = getMoodInfo(payload.mood);

  if (!moodInfo) return null;

  return (
    <text x={cx} y={cy} dy={4} textAnchor="middle" fontSize="16">
      {moodInfo.emoji}
    </text>
  );
};


export default function MoodTrackerPage() {
  const [mood, setMood] = useState([8]);
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [timeRange, setTimeRange] = useState('all');
  const [showLowMoodCard, setShowLowMoodCard] = useState(false);
  const [lowMoodReason, setLowMoodReason] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [filteredData, setFilteredData] = useState<MoodEntry[]>([]);
  const { toast } = useToast();

  // Ensure client-side only rendering for date-dependent logic
  useEffect(() => {
    setIsClient(true);

    // Load mood data from localStorage
    try {
        const savedMoodData = localStorage.getItem('moodTrackerData');
        if (savedMoodData) {
            const parsedData: {date: string; mood: number}[] = JSON.parse(savedMoodData);
            const dailyEntries = new Map<string, MoodEntry>();

            // Ensure only one entry per day, keeping the first one.
            for (const entry of parsedData) {
                const day = startOfDay(new Date(entry.date)).toISOString();
                if (!dailyEntries.has(day)) {
                    dailyEntries.set(day, {
                        ...entry,
                        date: new Date(entry.date)
                    });
                }
            }

            const cleanedData = Array.from(dailyEntries.values());
            setMoodData(cleanedData);
        }
    } catch (error) {
        console.error("Failed to load mood data from localStorage", error);
    }
  }, []);

  // Auto-save mood data to localStorage whenever it changes
  useEffect(() => {
    if (!isClient) return;
    try {
        if (moodData.length > 0) {
            localStorage.setItem('moodTrackerData', JSON.stringify(moodData));
        }
    } catch (error) {
        console.error("Failed to save mood data to localStorage", error);
    }
  }, [moodData, isClient]);

  useEffect(() => {
    if (isClient) {
        const data = moodData.filter(entry => {
            const now = new Date();
            if (timeRange === 'week') {
                return isWithinInterval(entry.date, { start: subDays(now, 7), end: now });
            }
            if (timeRange === 'month') {
                return isWithinInterval(entry.date, { start: subDays(now, 30), end: now });
            }
            return true;
        });
        setFilteredData(data);
    }
  }, [moodData, timeRange, isClient]);


  const handleLogMood = () => {
    const today = startOfDay(new Date());
    const newMoodValue = mood[0];

    // Check if an entry for today already exists
    const todayEntryIndex = moodData.findIndex(entry => isSameDay(entry.date, today));

    if (todayEntryIndex !== -1) {
      // If an entry for today already exists, do not add a new one.
      // Inform the user.
      toast({
        title: "Mood Already Logged",
        description: "You've already logged your mood for today. You can log a new mood tomorrow.",
      });
      return;
    }

    // Add a new entry for today, as one doesn't exist.
    const newEntry: MoodEntry = { date: new Date(), mood: newMoodValue };
    const updatedData = [...moodData, newEntry];

    setMoodData(updatedData.sort((a, b) => a.date.getTime() - b.date.getTime()));

    toast({
      title: "Mood Logged!",
      description: `Your mood has been logged as ${getMoodInfo(newMoodValue).label}.`,
    });


    if (newMoodValue <= 5) {
        setShowLowMoodCard(true);
        // Reset AI card state only when a new low mood is logged
        setAiResponse('');
        setLowMoodReason('');
    } else {
        setShowLowMoodCard(false);
    }
  }

  const handleShareReason = async () => {
      if (!lowMoodReason.trim()) return;
      setIsSubmittingReason(true);
      setAiResponse('');
      try {
          const response = await aiChatbotMentalHealthSupport({
              message: lowMoodReason,
              tone: 'empathetic'
          });
          setAiResponse(response.response);
      } catch (error) {
          console.error("Error fetching AI response for mood:", error);
          setAiResponse("I'm having a little trouble connecting right now, but please know I'm here to listen.");
      } finally {
          setIsSubmittingReason(false);
      }
  }

  const currentMoodInfo = getMoodInfo(mood[0]);
  
  if (!isClient) {
    return null; // or a loading skeleton
  }


  return (
    <div className="flex flex-col gap-6">
        <Button asChild variant="ghost" size="icon">
             <Link href="/dashboard"><ArrowLeft /></Link>
        </Button>
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                    <CardTitle className="font-headline">How are you feeling today?</CardTitle>
                    <CardDescription>Log your current mood on a scale of 1 to 10.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                    <div className="text-center">
                        <p className="text-6xl font-bold">{currentMoodInfo.emoji}</p>
                        <p className="text-xl font-semibold mt-2">{mood[0]}</p>
                        <p className="text-muted-foreground">{currentMoodInfo.label}</p>
                    </div>
                    <Slider
                        value={mood}
                        onValueChange={setMood}
                        min={1}
                        max={10}
                        step={1}
                        aria-label={`Mood: ${currentMoodInfo.label}`}
                    />
                    <Button className="w-full" size="lg" onClick={handleLogMood}>Log Mood</Button>
                    </CardContent>
                </Card>
                <AnimatePresence>
                {showLowMoodCard && (
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    >
                    <Card>
                        <CardHeader>
                        <CardTitle className="font-headline">Share a little more?</CardTitle>
                        <CardDescription>I've noticed your mood is a bit low. If you're comfortable, telling me what's on your mind can help.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Textarea 
                            placeholder="What's contributing to how you feel today?"
                            value={lowMoodReason}
                            onChange={(e) => setLowMoodReason(e.target.value)}
                        />
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-4">
                        <Button onClick={handleShareReason} disabled={isSubmittingReason || !lowMoodReason.trim()}>
                            {isSubmittingReason && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Share with Elysium
                        </Button>
                        {isSubmittingReason && (
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                                <p>Thinking of a thoughtful response...</p>
                            </div>
                        )}
                        {aiResponse && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full"
                            >
                                <div className="flex items-start gap-3 rounded-md bg-muted p-4">
                                    <Bot className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-primary">Elysium says:</p>
                                        <p className="text-sm text-muted-foreground">{aiResponse}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        </CardFooter>
                    </Card>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            <Card>
                <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Your Mood History</CardTitle>
                        <CardDescription>A look at your mood fluctuations over time.</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                        <Button variant={timeRange === 'week' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setTimeRange('week')}>Week</Button>
                        <Button variant={timeRange === 'month' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setTimeRange('month')}>Month</Button>
                        <Button variant={timeRange === 'all' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setTimeRange('all')}>All</Button>
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    {filteredData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                            dataKey="date"
                            tickFormatter={(value) => format(new Date(value), 'MMM d')}
                            stroke="hsl(var(--muted-foreground))"
                            tickLine={false}
                            axisLine={false}
                            />
                            <YAxis domain={[1, 10]} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false}/>
                            <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                indicator="line"
                                labelFormatter={(value, payload) => {
                                    if (payload && payload.length) {
                                    return format(new Date(payload[0].payload.date), 'eeee, MMM d');
                                    }
                                    return value;
                                }}
                                formatter={(value) => [`${value} - ${getMoodInfo(value as number).label}`, 'Mood']}
                                />
                            }
                            />
                            <Line
                            dataKey="mood"
                            type="monotone"
                            stroke="var(--color-mood)"
                            strokeWidth={2}
                            dot={<CustomDot />}
                            activeDot={<CustomDot />}
                            />
                        </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <p className="text-muted-foreground">Log your mood to see your history here.</p>
                        </div>
                    )}
                </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
