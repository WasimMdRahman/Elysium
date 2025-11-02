
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

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

  // Load mood data from localStorage
  useEffect(() => {
    try {
        const savedMoodData = localStorage.getItem('moodTrackerData');
        if (savedMoodData) {
            const parsedData = JSON.parse(savedMoodData).map((d: any) => ({
                ...d,
                date: new Date(d.date)
            }));
            setMoodData(parsedData);
        }
    } catch (error) {
        console.error("Failed to load mood data from localStorage", error);
    }
  }, []);

  // Auto-save mood data to localStorage whenever it changes
  useEffect(() => {
    try {
        if (moodData.length > 0) {
            localStorage.setItem('moodTrackerData', JSON.stringify(moodData));
        }
    } catch (error) {
        console.error("Failed to save mood data to localStorage", error);
    }
  }, [moodData]);

  const handleLogMood = () => {
    const newEntry: MoodEntry = { date: new Date(), mood: mood[0] };
    setMoodData(prevData => [...prevData, newEntry].sort((a,b) => a.date.getTime() - b.date.getTime()));
  }
  
  const filteredData = moodData.filter(entry => {
      const now = new Date();
      if (timeRange === 'week') {
          return isWithinInterval(entry.date, { start: subDays(now, 7), end: now });
      }
      if (timeRange === 'month') {
          return isWithinInterval(entry.date, { start: subDays(now, 30), end: now });
      }
      return true;
  });

  const currentMoodInfo = getMoodInfo(mood[0]);


  return (
    <div className="grid gap-6 lg:grid-cols-2">
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
  );
}
