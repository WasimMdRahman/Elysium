
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeVoiceEmotion, AnalyzeVoiceEmotionOutput } from '@/ai/flows/voice-biomarker-analysis';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function VoiceJournalPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeVoiceEmotionOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];
                setAnalysisResult(null);
                setError(null);

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const base64Audio = reader.result as string;
                        setIsLoading(true);
                        try {
                            const result = await analyzeVoiceEmotion({ audioDataUri: base64Audio });
                            if ('error' in result) {
                                if (result.error.includes('503')) {
                                    setError("The analysis service is currently busy. Please try again in a few moments.");
                                } else {
                                    setError(result.error);
                                }
                            } else {
                                setAnalysisResult(result);
                            }
                        } catch (err: any) {
                            console.error("Error analyzing voice:", err);
                            setError("Sorry, we couldn't analyze your voice right now. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    };
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                setError("Could not access the microphone. Please grant permission and try again.");
            }
        }
    };
    
    const getEmotionEmoji = (emotion?: string) => {
        switch (emotion) {
            case 'happy': return '😊';
            case 'joyful': return '😄';
            case 'sad': return '😢';
            case 'anxious': return '😟';
            case 'stressed': return '😫';
            case 'normal': return '😐';
            default: return '🤔';
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Voice Biomarker Analysis</h1>
                <p className="text-muted-foreground">Record your voice to get AI-powered emotional insights.</p>
            </div>
            
            <Card className="w-full max-w-lg">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-6">
                    <Button
                        size="icon"
                        className={cn(
                            "h-24 w-24 rounded-full transition-all duration-300",
                            isRecording ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary",
                        )}
                        onClick={handleRecording}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="h-10 w-10 animate-spin" /> : 
                         isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? "Analyzing..." : isRecording ? "Tap to stop recording" : "Tap to start recording your journal entry"}
                    </p>
                </CardContent>
            </Card>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-lg"
                    >
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                    >
                        <Card>
                            <CardHeader className="text-center">
                                <div className="text-6xl mx-auto mb-4">{getEmotionEmoji(analysisResult.emotion)}</div>
                                <CardTitle className="font-headline">Analysis Complete</CardTitle>
                                <CardDescription>Here's what the AI detected in your voice.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="flex justify-between items-baseline p-3 bg-muted rounded-md">
                                   <p className="font-medium">Detected Emotion:</p>
                                   <p className="text-lg font-bold capitalize text-primary">{analysisResult.emotion}</p>
                               </div>
                               <div className="flex justify-between items-baseline p-3 bg-muted rounded-md">
                                   <p className="font-medium">Confidence:</p>
                                   <p className="font-bold">{Math.round(analysisResult.confidence * 100)}%</p>
                               </div>
                               <div>
                                   <h4 className="font-semibold mb-2 flex items-center gap-2"><Activity size={16}/> Vocal Biomarkers:</h4>
                                   <p className="text-sm text-muted-foreground italic p-3 bg-muted/50 rounded-md">
                                       "{analysisResult.explanation}"
                                   </p>
                               </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
