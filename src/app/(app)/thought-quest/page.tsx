
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateThought } from '@/ai/flows/thought-quest-game-ai-thought-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Zap, Loader, PartyPopper, CheckCircle, XCircle, Flame, Star, Gem, Shield, Award, Crown, Diamond, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Feedback = 'correct' | 'incorrect' | null;
const TOTAL_QUESTIONS = 10;


const trophies = [
    { name: 'Bronze', type: 'XP', threshold: 2000, img: '/trophies/bronze.jpg' },
    { name: 'Silver', type: 'XP', threshold: 3000, img: '/trophies/silver.jpg' },
    { name: 'Gold', type: 'XP', threshold: 5000, img: '/trophies/gold.jpg' },
    { name: 'Platinum', type: 'EP', threshold: 2000, img: '/trophies/platinum.jpg' },
    { name: 'Diamond', type: 'EP', threshold: 3000, img: '/trophies/diamond.jpg' },
    { name: 'Master', type: 'XP', threshold: 20000, img: '/trophies/master.jpg' },
    { name: 'Grandmaster', type: 'XP', threshold: 50000, img: '/trophies/grandmaster.jpg' },
];


export default function ThoughtQuestPage() {
  const [thought, setThought] = useState<string>('');
  const [isHelpful, setIsHelpful] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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


  const isGameComplete = questionsAnswered >= TOTAL_QUESTIONS;
  
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
            correctAnswersCount: savedCorrectCount = 0,
            lastPlayedDate: savedLastPlayed
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
        
        // Reset daily game if it's a new day
        if(savedDate !== today) {
          setScore(0);
          setQuestionsAnswered(0);
          setPreviousThoughts([]);
          setXp(0);
          setEp(0);
          setCorrectAnswersCount(0);
          fetchNewThought([]); // pass empty array for a fresh start
        } else {
            setScore(savedScore);
            setQuestionsAnswered(savedQuestions);
            setPreviousThoughts(savedThoughts);
            setXp(savedXp);
            setEp(savedEp);
            setCorrectAnswersCount(savedCorrectCount);
            if (savedQuestions < TOTAL_QUESTIONS) {
                fetchNewThought(savedThoughts);
            } else {
                setIsLoading(false);
            }
        }

        setStreak(currentStreak);
        setLastPlayedDate(savedDate);
      } else {
        // First time ever playing
        setStreak(1);
        fetchNewThought([]);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      if (questionsAnswered < TOTAL_QUESTIONS) {
        fetchNewThought([]);
      }
    }
  }, []);

  // Auto-save state to localStorage
  useEffect(() => {
    // Avoid saving initial blank state
    if (questionsAnswered > 0 || score > 0 || xp > 0) {
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
                correctAnswersCount,
                lastPlayedDate: today
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
    if (answered || isGameComplete) return;
    
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
      if(questionsAnswered + 1 < TOTAL_QUESTIONS) {
        fetchNewThought([...previousThoughts, thought]);
      }
    }, 1500);
  };

  const feedbackVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold font-headline">Thought Quest</h1>
        <p className="text-muted-foreground">Challenge cognitive distortions and build healthier thinking habits.</p>
        <div className="mt-2 text-base text-muted-foreground">{questionsAnswered}/{TOTAL_QUESTIONS} thoughts reviewed | Total Score: {score}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-orange-500"><Flame /> Daily Streak</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold">{streak}</p>
                <p className="text-muted-foreground">Day{streak !== 1 && 's'}</p>
            </CardContent>
        </Card>
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-yellow-500"><Star /> Experience</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold">{xp}</p>
                <p className="text-muted-foreground">XP</p>
            </CardContent>
        </Card>
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-blue-500"><Gem /> Engagement</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold">{ep}</p>
                <p className="text-muted-foreground">EP</p>
            </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader>
            <CardTitle className="text-center">Trophies</CardTitle>
        </CardHeader>
        <CardContent>
            <TooltipProvider>
                <div className="flex justify-center gap-4 md:gap-8">
                    {trophies.map(trophy => {
                        const isUnlocked = trophy.type === 'XP' ? xp >= trophy.threshold : ep >= trophy.threshold;
                        return (
                            <Tooltip key={trophy.name}>
                                <TooltipTrigger>
                                    <div className="flex flex-col items-center gap-2">
                                        <Image 
                                          src={trophy.img}
                                          alt={`${trophy.name} Trophy`}
                                          width={40}
                                          height={40}
                                          className={cn(
                                            "transition-all",
                                            !isUnlocked && "filter grayscale"
                                          )}
                                        />
                                        <span className={cn("text-xs font-semibold", isUnlocked ? "text-foreground" : "text-muted-foreground")}>{trophy.name}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Unlock at {trophy.threshold} {trophy.type}</p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </div>
            </TooltipProvider>
        </CardContent>
      </Card>
      
      <div className="relative w-full max-w-lg h-64">
        <AnimatePresence>
         {isGameComplete ? (
            <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0"
              >
                <Card className="h-full flex flex-col justify-center items-center text-center p-6 bg-green-500/10 border-green-500">
                   <PartyPopper className="h-12 w-12 text-green-600 mb-4" />
                   <CardTitle className="font-headline">Quest Complete!</CardTitle>
                   <CardDescription>You've answered all thoughts for today. Your final score is {score}. Come back tomorrow for a new quest!</CardDescription>
                </Card>
            </motion.div>
         ) : !isLoading ? (
            <motion.div
              key={thought}
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
                    <motion.div 
                      key="correct"
                      variants={feedbackVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute inset-0 flex items-center justify-center bg-green-500/20"
                    >
                        <CheckCircle className="h-24 w-24 text-white" />
                    </motion.div>
                  )}
                  {feedback === 'incorrect' && (
                     <motion.div 
                      key="incorrect"
                      variants={feedbackVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute inset-0 flex items-center justify-center bg-destructive/20"
                    >
                        <XCircle className="h-24 w-24 text-white" />
                    </motion.div>
                  )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ): null}
        </AnimatePresence>
        {isLoading && !isGameComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
             <Loader className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
      </div>

      {!isGameComplete && (
        <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            <p className="text-muted-foreground">Is this thought pattern helpful or unhelpful?</p>
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

    

