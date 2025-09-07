'use client';

import { useState, useEffect } from 'react';
import { generateThought } from '@/ai/flows/thought-quest-game-ai-thought-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Zap, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Feedback = 'correct' | 'incorrect' | null;

export default function ThoughtQuestPage() {
  const [thought, setThought] = useState<string>('');
  const [isHelpful, setIsHelpful] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [answered, setAnswered] = useState(false);

  const fetchNewThought = async () => {
    setIsLoading(true);
    setAnswered(false);
    setFeedback(null);
    try {
      // In a real scenario, the AI would also determine if the thought is helpful or not.
      // For this simulation, we'll randomize it.
      const topics = ['social situations', 'work stress', 'self-esteem', 'the future', 'making mistakes'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const result = await generateThought({ topic: randomTopic });
      setThought(result.thought);
      setIsHelpful(Math.random() > 0.5); // 50% chance of being helpful
    } catch (error) {
      console.error("Failed to generate thought:", error);
      setThought("I can't seem to think of anything right now. Please try again.");
      setIsHelpful(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewThought();
  }, []);

  const handleAnswer = (userChoice: boolean) => {
    if (answered) return;
    setAnswered(true);

    if (userChoice === isHelpful) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setScore(s => Math.max(0, s - 5));
      setFeedback('incorrect');
    }

    setTimeout(() => {
      fetchNewThought();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Thought Quest</h1>
        <p className="text-muted-foreground">Challenge cognitive distortions and build healthier thinking habits.</p>
        <div className="mt-2 flex items-center justify-center gap-2 text-xl font-bold text-primary">
          <Zap className="h-5 w-5" />
          <span>Score: {score}</span>
        </div>
      </div>
      
      <div className="relative w-full max-w-lg h-64">
        <AnimatePresence>
          {!isLoading && (
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
          )}
        </AnimatePresence>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
             <Loader className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 w-full max-w-lg">
        <p className="text-muted-foreground">Is this thought pattern helpful or unhelpful?</p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            onClick={() => handleAnswer(false)}
            disabled={answered}
          >
            <ThumbsDown className="mr-2 h-5 w-5" /> Unhelpful
          </Button>
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
            onClick={() => handleAnswer(true)}
            disabled={answered}
          >
            <ThumbsUp className="mr-2 h-5 w-5" /> Helpful
          </Button>
        </div>
      </div>
    </div>
  );
}
