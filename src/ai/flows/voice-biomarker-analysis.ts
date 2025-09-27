
'use server';
/**
 * @fileOverview Analyzes a user's voice to detect emotions.
 *
 * - analyzeVoiceEmotion - A function that handles the voice emotion analysis process.
 * - AnalyzeVoiceEmotionInput - The input type for the analyzeVoiceEmotion function.
 * - AnalyzeVoiceEmotionOutput - The return type for the analyzeVoiceEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVoiceEmotionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A voice recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeVoiceEmotionInput = z.infer<
  typeof AnalyzeVoiceEmotionInputSchema
>;

const AnalyzeVoiceEmotionOutputSchema = z.object({
  emotion: z
    .enum(['normal', 'stressed', 'sad', 'anxious', 'happy', 'joyful'])
    .describe('The detected primary emotion from the voice.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score for the detected emotion (0-1).'),
  explanation: z
    .string()
    .describe(
      'A brief explanation of the vocal biomarkers that led to the conclusion.'
    ),
});
export type AnalyzeVoiceEmotionOutput = z.infer<
  typeof AnalyzeVoiceEmotionOutputSchema
>;

export async function analyzeVoiceEmotion(
  input: AnalyzeVoiceEmotionInput
): Promise<AnalyzeVoiceEmotionOutput> {
  return analyzeVoiceEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVoiceEmotionPrompt',
  input: {schema: AnalyzeVoiceEmotionInputSchema},
  output: {schema: AnalyzeVoiceEmotionOutputSchema},
  prompt: `You are an expert in vocal biomarker analysis. Your task is to analyze the provided audio clip and classify the speaker's primary emotion.

  Analyze the following vocal characteristics:
  - Pitch and pitch variation
  - Speaking rate and rhythm
  - Volume and intensity
  - Tone and timbre

  Based on your analysis, classify the emotion into one of the following categories: normal, stressed, sad, anxious, happy, or joyful.

  Provide a confidence score for your classification and a brief explanation of the key vocal biomarkers that support your conclusion.

  Audio for analysis: {{media url=audioDataUri}}`,
});

const analyzeVoiceEmotionFlow = ai.defineFlow(
  {
    name: 'analyzeVoiceEmotionFlow',
    inputSchema: AnalyzeVoiceEmotionInputSchema,
    outputSchema: z.union([AnalyzeVoiceEmotionOutputSchema, z.object({ error: z.string() })]),
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      if (error.message && error.message.includes('503')) {
        return { error: '503 Service Unavailable: The analysis service is currently busy. Please try again in a few moments.' };
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }
);
