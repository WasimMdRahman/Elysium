
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Star, Gem, ArrowLeft, Play, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import './animations.css';
import './loading-animation.css';
import { useRouter } from 'next/navigation';

const levels = [
    { name: 'Bronze', type: 'XP', threshold: 2000, color: 'text-yellow-600' },
    { name: 'Silver', type: 'XP', threshold: 3000, color: 'text-slate-400' },
    { name: 'Gold', type: 'XP', threshold: 5000, color: 'text-yellow-400' },
    { name: 'Platinum', type: 'EP', threshold: 2000, color: 'text-purple-400' },
    { name: 'Diamond', type: 'EP', threshold: 3000, color: 'text-blue-300' },
];

export const LoadingScreen = ({ text = "Loading Thought Quest...", showSixDots = false }: { text?: string, showSixDots?: boolean }) => (
    <div className="loading-screen">
      <div className="loader">
        <div className="brain">🧠</div>
        <div className="orbit">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          {showSixDots && (
            <>
              <div className="dot"></div>
              <div className="dot"></div>
            </>
          )}
        </div>
      </div>
      <div className={cn(text.includes('decode') ? "glowing-text" : "loading-text")}>{text}</div>
    </div>
);

export default function ThoughtQuestLobbyPage() {
  const router = useRouter();
  
  // Gamification state
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [ep, setEp] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  // Load state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('thoughtQuestState');
      if (savedState) {
        const { 
            streak: savedStreak = 0,
            xp: savedXp = 0,
            ep: savedEp = 0,
            questions: savedQuestions = 0,
            score: savedScore = 0
        } = JSON.parse(savedState);
        
        setStreak(savedStreak);
        setXp(savedXp); 
        setEp(savedEp); 
        setQuestionsAnswered(savedQuestions);
        setScore(savedScore);
      } else {
        setStreak(2);
        setXp(180);
        setEp(30);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      // Fallback for first-time players or errors
      setStreak(2);
      setXp(180);
      setEp(30);
    }
  }, []);

  const startGame = () => {
    setIsLoading(true);
    setTimeout(() => {
        router.push('/thought-quest/game');
    }, 2000);
  };

  if (isLoading) {
    return <LoadingScreen text="Get ready to decode your thoughts" showSixDots={true} />;
  }


  return (
    <div className="flex flex-col items-center gap-6">
        <Button asChild variant="ghost" size="icon" className="self-start">
             <Link href="/dashboard"><ArrowLeft /></Link>
        </Button>
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold font-headline">Thought Quest</h1>
        <p className="text-muted-foreground">Identify thoughts as helpful or unhelpful to build healthier thinking habits.</p>
        <div className="mt-2 text-base text-muted-foreground">{questionsAnswered} thoughts reviewed | Total Score: {score}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-orange-500"><Flame /></CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold">{streak}</p>
                <p className="text-muted-foreground">Day{streak !== 1 && 's'}</p>
            </CardContent>
        </Card>
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-yellow-500"><Star /></CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold">{xp}</p>
                <p className="text-muted-foreground">XP</p>
            </CardContent>
        </Card>
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-blue-500"><Gem /></CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold">{ep}</p>
                <p className="text-muted-foreground">EP</p>
            </CardContent>
        </Card>
      </div>

       <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold font-headline text-center mb-4">Achievements</h2>
        <div className="flex justify-center items-center gap-4 md:gap-8">
          <TooltipProvider>
            {levels.map(level => {
              const isUnlocked = level.type === 'XP' ? xp >= level.threshold : ep >= level.threshold;
              return (
                <Tooltip key={level.name}>
                  <TooltipTrigger>
                    <Star className={cn(
                        "h-10 w-10 md:h-12 md:w-12 transition-all duration-300",
                        isUnlocked ? level.color : 'text-gray-400'
                      )} 
                      fill={isUnlocked ? 'currentColor' : 'none'}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                      <p className="font-semibold">{level.name}</p>
                      <p>Unlock at {level.threshold} {level.type}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </div>
      
      <div className="relative w-full max-w-lg h-64">
        <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
        >
            <Card className="h-full flex flex-col justify-center items-center text-center p-6">
               <div className="text-5xl mb-4">🧠</div>
               <CardTitle className="font-headline">Begin Your Quest</CardTitle>
               <CardDescription className="mb-6">Identify thoughts as helpful or unhelpful to continue your quest.</CardDescription>
               <Button onClick={startGame} size="lg" disabled={isLoading}>
                   {isLoading ? (
                       <Loader className="mr-2 h-5 w-5 animate-spin" />
                   ) : (
                       <Play className="mr-2 h-5 w-5" />
                   )}
                   {isLoading ? 'Loading...' : 'Start Game'}
               </Button>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}
