
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { generateThoughts } from '@/ai/flows/thought-quest-game-ai-thought-generation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Loader, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../animations.css';

type Feedback = 'correct' | 'incorrect' | null;

type Thought = {
  thought: string;
  isHelpful: boolean;
};

export default function ThoughtQuestGamePage() {
  const [currentThought, setCurrentThought] = useState<Thought | null>(null);
  const [thoughtQueue, setThoughtQueue] = useState<Thought[]>([]);
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

  // Load state from localStorage on component mount
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
        
        const getYesterdayDateString = () => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return yesterday.toDateString();
        }
        const yesterday = getYesterdayDateString();
        let currentStreak = savedStreak;

        if (savedDate === today) {
             currentStreak = savedStreak > 0 ? savedStreak : 1;
        } else if (savedDate === yesterday) {
            currentStreak = (savedStreak || 0) + 1;
        } else {
            currentStreak = 1;
        }
        
        setStreak(currentStreak);
        setXp(savedXp); 
        setEp(savedEp); 

        if(savedDate !== today) {
          setScore(0);
          setQuestionsAnswered(0);
          setPreviousThoughts([]);
          setCorrectAnswersCount(0);
        } else {
            setScore(savedScore);
            setQuestionsAnswered(savedQuestions);
            setPreviousThoughts(savedThoughts);
            setCorrectAnswersCount(savedCorrectCount);
        }
      } else {
        setStreak(1);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      setStreak(1);
    }
  }, []);

  // Effect to save state to localStorage whenever it changes
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


  const fetchNewThoughts = useCallback(async (currentThoughts: string[]) => {
    setIsLoading(true);
    try {
      const topics = ['social situations', 'work stress', 'self-esteem', 'the future', 'making mistakes', 'personal growth', 'daily life'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const result = await generateThoughts({ topic: randomTopic, previousThoughts: currentThoughts });
      setThoughtQueue(result.thoughts);
      setCurrentThought(result.thoughts[0] || null);
    } catch (error: any) {
      console.error("Failed to generate thoughts:", error);
      setCurrentThought({ thought: error.message || "The AI is thinking... please try again in a moment.", isHelpful: true });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadNextThought = useCallback(() => {
    setAnswered(false);
    setFeedback(null);

    if (thoughtQueue.length > 1) {
      const newQueue = thoughtQueue.slice(1);
      setThoughtQueue(newQueue);
      setCurrentThought(newQueue[0]);
    } else {
      // Fetch a new batch if the queue is empty or has only one item left
      fetchNewThoughts(previousThoughts);
    }
  }, [thoughtQueue, fetchNewThoughts, previousThoughts]);

  // Fetch the first batch of thoughts when the component mounts
  useEffect(() => {
    fetchNewThoughts([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (userChoice: boolean) => {
    if (answered || !currentThought) return;
    
    setAnswered(true);
    
    const wasCorrect = userChoice === currentThought.isHelpful;
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
    setPreviousThoughts(prev => [...prev, currentThought.thought]);

    setTimeout(() => {
        loadNextThought();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-lg flex items-center justify-between">
            <Button asChild variant="ghost" size="icon">
                <Link href="/thought-quest"><ArrowLeft /></Link>
            </Button>
            <div className="text-sm text-muted-foreground">{questionsAnswered} thoughts reviewed | Score: {score}</div>
        </div>
      
      <div className="relative w-full max-w-lg h-64">
        <AnimatePresence>
          {!isLoading && currentThought ? (
            <motion.div
              key={currentThought.thought}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Card className="h-full flex flex-col justify-center items-center text-center">
                <CardContent className="p-6 relative w-full h-full flex justify-center items-center">
                  <p className="text-xl font-medium">"{currentThought.thought}"</p>
                  <AnimatePresence>
                    {feedback === 'correct' && (
                      <>
                        <div className="xp-animation">+10 XP</div>
                        <div className="feedback-animation-overlay">
                            <div className="checkmark"></div>
                            <p>Correct!</p>
                        </div>
                      </>
                    )}
                    {feedback === 'incorrect' && (
                       <div className="feedback-animation-overlay">
                        <div className="crossmark"></div>
                        <p>Not quite</p>
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ): null}
        </AnimatePresence>
        {isLoading && !currentThought && (
          <div className="absolute inset-0 flex items-center justify-center">
             <Loader className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-lg">
          <p className="text-muted-foreground">Is this thought helpful or unhelpful?</p>
          <div className="flex gap-4">
          <Button
              size="lg"
              variant="outline"
              onClick={() => handleAnswer(false)}
              disabled={answered || isLoading}
          >
              <ThumbsDown className="mr-2 h-5 w-5" /> Unhelpful
          </Button>
          <Button
              size="lg"
              variant="outline"
              onClick={() => handleAnswer(true)}
              disabled={answered || isLoading}
          >
              <ThumbsUp className="mr-2 h-5 w-5" /> Helpful
          </Button>
          </div>
      </div>
    </div>
  );
}
