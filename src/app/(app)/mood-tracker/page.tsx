'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const moodData = [
  { date: subDays(new Date(), 6), mood: 7 },
  { date: subDays(new Date(), 5), mood: 5 },
  { date: subDays(new Date(), 4), mood: 6 },
  { date: subDays(new Date(), 3), mood: 8 },
  { date: subDays(new Date(), 2), mood: 7 },
  { date: subDays(new Date(), 1), mood: 9 },
  { date: new Date(), mood: 8 },
];

const chartConfig = {
  mood: {
    label: 'Mood',
    color: 'hsl(var(--primary))',
  },
};

const moodLabels: { [key: number]: string } = {
  1: 'Awful',
  2: 'Very Bad',
  3: 'Bad',
  4: 'Not Good',
  5: 'Okay',
  6: 'Fine',
  7: 'Good',
  8: 'Very Good',
  9: 'Great',
  10: 'Excellent',
};

export default function MoodTrackerPage() {
  const [mood, setMood] = useState([8]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">How are you feeling today?</CardTitle>
          <CardDescription>Log your current mood on a scale of 1 to 10.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-6xl font-bold">{mood[0]}</p>
            <p className="text-muted-foreground">{moodLabels[mood[0]]}</p>
          </div>
          <Slider
            value={mood}
            onValueChange={setMood}
            min={1}
            max={10}
            step={1}
            aria-label={`Mood: ${moodLabels[mood[0]]}`}
          />
          <Button className="w-full" size="lg">Log Mood</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Week in a Glance</CardTitle>
          <CardDescription>A look at your mood fluctuations over the past 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'EEE')}
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
                    />
                  }
                />
                <Line
                  dataKey="mood"
                  type="monotone"
                  stroke="var(--color-mood)"
                  strokeWidth={2}
                  dot={{
                    fill: 'var(--color-mood)',
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
