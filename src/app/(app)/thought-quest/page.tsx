
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateThought, GenerateThoughtInput, GenerateThoughtOutput } from '@/ai/flows/thought-quest-game-ai-thought-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Loader, PartyPopper, Flame, Star, Gem, ArrowLeft, Play, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import './animations.css';

type Feedback = 'correct' | 'incorrect' | null;

const levels = [
    { name: 'Bronze', type: 'XP', threshold: 2000, color: 'text-yellow-600' },
    { name: 'Silver', type: 'XP', threshold: 3000, color: 'text-slate-400' },
    { name: 'Gold', type: 'XP', threshold: 5000, color: 'text-yellow-400' },
    { name: 'Platinum', type: 'EP', threshold: 2000, color: 'text-purple-400' },
    { name: 'Diamond', type: 'EP', threshold: 3000, color: 'text-blue-300' },
];


export default function ThoughtQuestPage() {
  const [thought, setThought] = useState('');
  const [isHelpful, setIsHelpful] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [answered, setAnswered] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [previousThoughts, setPreviousThoughts] = useState<string[]>([]);
  
  // Gamification state
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [ep, setEp] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [lastPlayedDate, setLastPlayedDate] = useState<string | null>(null);
  
  const [isGameStarted, setIsGameStarted] = useState(false);

  const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
  }

  // Load state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('thoughtQuestState');
      const today = new Date().toDateString();

      if (savedState) {
        const { 
            score: savedScore = 0, 
            questions: savedQuestions = 0, 
            date: savedDate, 
            thoughts: savedThoughts = [],
            streak: savedStreak = 0,
            xp: savedXp = 0,
            ep: savedEp = 0,
            correctAnswersCount: savedCorrectCount = 0
        } = JSON.parse(savedState);
        
        // --- Streak Logic ---
        const yesterday = getYesterdayDateString();
        let currentStreak = savedStreak;

        if (savedDate === today) { // Played today already
             currentStreak = savedStreak > 0 ? savedStreak : 1;
        } else if (savedDate === yesterday) { // Played yesterday
            currentStreak = (savedStreak || 0) + 1;
        } else { // Missed a day or first time
            currentStreak = 1;
        }
        
        setStreak(2); // User requested specific values
        setXp(180); 
        setEp(30); 

        // Reset daily game if it's a new day
        if(savedDate !== today) {
          setScore(0);
          setQuestionsAnswered(0);
          setPreviousThoughts([]);
          setCorrectAnswersCount(0); // Reset daily correct count
        } else {
            // Continue session from today
            setScore(savedScore);
            setQuestionsAnswered(savedQuestions);
            setPreviousThoughts(savedThoughts);
            setCorrectAnswersCount(savedCorrectCount);
        }

        setLastPlayedDate(savedDate);
      } else {
        // This is for first-time players after the change.
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

  // Auto-save state to localStorage
  useEffect(() => {
    // Avoid saving initial blank state if nothing has been earned
    if (questionsAnswered > 0 || score > 0) {
        try {
            const today = new Date().toDateString();
            const stateToSave = { 
                score, 
                questions: questionsAnswered, 
                date: today, 
                thoughts: previousThoughts,
                streak,
                xp,
                ep,
                correctAnswersCount
            };
            localStorage.setItem('thoughtQuestState', JSON.stringify(stateToSave));
        } catch (error) {
          console.error("Failed to save state to localStorage", error);
        }
    }
  }, [score, questionsAnswered, previousThoughts, streak, xp, ep, correctAnswersCount]);


  const fetchNewThought = async (currentThoughts: string[]) => {
    setIsLoading(true);
    setAnswered(false);
    setFeedback(null);
    try {
      const topics = ['social situations', 'work stress', 'self-esteem', 'the future', 'making mistakes', 'personal growth', 'daily life'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const result = await generateThought({ topic: randomTopic, previousThoughts: currentThoughts });
      setThought(result.thought);
      setIsHelpful(result.isHelpful); 
      // We update the list of thoughts for the session in the handleAnswer function
    } catch (error) {
      console.error("Failed to generate thought:", error);
      setThought("I can't seem to think of anything right now. Please try again.");
      setIsHelpful(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (userChoice: boolean) => {
    if (answered) return;
    
    setAnswered(true);
    
    const wasCorrect = userChoice === isHelpful;
    if (wasCorrect) {
      setScore(s => s + 10);
      setFeedback('correct');
      setXp(currentXp => currentXp + 10);
      
      const newCorrectCount = correctAnswersCount + 1;
      setCorrectAnswersCount(newCorrectCount);
      if (newCorrectCount > 0 && newCorrectCount % 5 === 0) {
        setEp(currentEp => currentEp + 10);
      }

    } else {
      setScore(s => s + 0); // No negative marking
      setFeedback('incorrect');
    }

    setQuestionsAnswered(q => q + 1);
    setPreviousThoughts(prev => [...prev, thought]);


    setTimeout(() => {
        if (isGameStarted) {
            fetchNewThought([...previousThoughts, thought]);
        }
    }, 2000); // Increased timeout to match new animation
  };

  const startGame = () => {
    if (!isGameStarted) {
        setIsGameStarted(true);
        fetchNewThought(previousThoughts);
    }
  };

  const feedbackVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

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
        <AnimatePresence>
         {!isGameStarted ? (
            <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0"
            >
                <Card className="h-full flex flex-col justify-center items-center text-center p-6">
                   <BrainCircuit className="h-12 w-12 text-primary mb-4" />
                   <CardTitle className="font-headline">Begin Your Quest</CardTitle>
                   <CardDescription className="mb-6">Identify thoughts as helpful or unhelpful to continue your quest.</CardDescription>
                   <Button onClick={startGame} size="lg">
                       <Play className="mr-2 h-5 w-5" />
                       Start Game
                   </Button>
                </Card>
            </motion.div>
         ) : !isLoading ? (
            <motion.div
              key={thought || 'empty'}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Card className="h-full flex flex-col justify-center items-center text-center">
                <CardContent className="p-6 relative w-full h-full flex justify-center items-center">
                  <p className="text-xl font-medium">"{thought}"</p>
                  <AnimatePresence>
                    {feedback === 'correct' && (
                      <>
                        <div className="xp-animation">+10 XP</div>
                        <div className="feedback-animation-overlay">
                            <div className="checkmark"></div>
                            <p>That's correct 🎉</p>
                        </div>
                      </>
                    )}
                    {feedback === 'incorrect' && (
                       <div className="feedback-animation-overlay">
                        <div className="crossmark"></div>
                        <p>Oops... That's Wrong 😢</p>
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ): null}
        </AnimatePresence>
        {isLoading && isGameStarted && (
          <div className="absolute inset-0 flex items-center justify-center">
             <Loader className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
      </div>

      {isGameStarted && (
        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            <p className="text-muted-foreground">Is this Quote Helpful or Unhelpful?</p>
            <div className="flex gap-4">
            <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer(false)}
                disabled={answered}
            >
                <ThumbsDown className="mr-2 h-5 w-5" /> Unhelpful
            </Button>
            <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer(true)}
                disabled={answered}
            >
                <ThumbsUp className="mr-2 h-5 w-5" /> Helpful
            </Button>
            </div>
        </div>
       )}
    </div>
  );

}
