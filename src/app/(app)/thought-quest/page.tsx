'use client';

import { useState, useEffect } from 'react';
import { generateThought } from '@/ai/flows/thought-quest-game-ai-thought-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Zap, Loader, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Feedback = 'correct' | 'incorrect' | null;
const TOTAL_QUESTIONS = 10;

export default function ThoughtQuestPage() {
  const [thought, setThought] = useState<string>('');
  const [isHelpful, setIsHelpful] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [answered, setAnswered] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [previousThoughts, setPreviousThoughts] = useState<string[]>([]);

  const isGameComplete = questionsAnswered >= TOTAL_QUESTIONS;

  // Load state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('thoughtQuestState');
      if (savedState) {
        const { score: savedScore, questions: savedQuestions, date, thoughts: savedThoughts } = JSON.parse(savedState);
        const today = new Date().toDateString();
        // Reset if it's a new day
        if(date !== today) {
          localStorage.removeItem('thoughtQuestState');
          setScore(0);
          setQuestionsAnswered(0);
          setPreviousThoughts([]);
        } else {
            setScore(savedScore);
            setQuestionsAnswered(savedQuestions);
            setPreviousThoughts(savedThoughts || []);
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
    if (questionsAnswered < TOTAL_QUESTIONS) {
        fetchNewThought();
    } else {
        setIsLoading(false);
    }
  }, []);

  // Auto-save state to localStorage
  useEffect(() => {
    try {
        const today = new Date().toDateString();
        const stateToSave = { score, questions: questionsAnswered, date: today, thoughts: previousThoughts };
        localStorage.setItem('thoughtQuestState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [score, questionsAnswered, previousThoughts]);


  const fetchNewThought = async () => {
    setIsLoading(true);
    setAnswered(false);
    setFeedback(null);
    try {
      const topics = ['social situations', 'work stress', 'self-esteem', 'the future', 'making mistakes', 'personal growth', 'daily life'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const result = await generateThought({ topic: randomTopic, previousThoughts });
      setThought(result.thought);
      setIsHelpful(result.isHelpful); 
      setPreviousThoughts(prev => [...prev, result.thought]);
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
    setQuestionsAnswered(q => q + 1);

    if (userChoice === isHelpful) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setScore(s => s + 0); // No negative marking
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if(questionsAnswered + 1 < TOTAL_QUESTIONS) {
        fetchNewThought();
      }
    }, 1500);
  };
  
  const resetGame = () => {
      setScore(0);
      setQuestionsAnswered(0);
      setPreviousThoughts([]);
      localStorage.removeItem('thoughtQuestState');
      fetchNewThought();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Thought Quest</h1>
        <p className="text-muted-foreground">Challenge cognitive distortions and build healthier thinking habits.</p>
        <div className="mt-2 flex items-center justify-center gap-4 text-xl">
          <div className="font-bold text-primary flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span>Score: {score}</span>
          </div>
          <div className="text-base text-muted-foreground">{questionsAnswered}/{TOTAL_QUESTIONS}</div>
        </div>
      </div>
      
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
              <Card className={`h-full flex flex-col justify-center items-center text-center transition-all duration-300 ${
                feedback === 'correct' ? 'border-green-500 bg-green-500/10' :
                feedback === 'incorrect' ? 'border-destructive bg-destructive/10' :
                ''
              }`}>
                <CardContent className="p-6">
                  <p className="text-xl font-medium">"{thought}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ): null}
        </AnimatePresence>
        {isLoading && (
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
                variant={answered && isHelpful === true ? 'outline' : answered && isHelpful === false ? 'destructive' : 'outline'}
                onClick={() => handleAnswer(false)}
                disabled={answered}
            >
                <ThumbsDown className="mr-2 h-5 w-5" /> Unhelpful
            </Button>
            <Button
                size="lg"
                variant={answered && isHelpful === true ? 'default' : 'outline'}
                className={answered && isHelpful ? "bg-green-500 hover:bg-green-600 text-white" : ""}
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
