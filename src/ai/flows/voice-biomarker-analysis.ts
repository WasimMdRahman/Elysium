
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
): Promise<AnalyzeVoiceEmotionOutput | { error: string }> {
  return analyzeVoiceEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVoiceEmotionPrompt',
  input: {schema: AnalyzeVoiceEmotionInputSchema},
  output: {schema: AnalyzeVoiceEmotionOutputSchema},
  prompt: `You are an expert in vocal biomarker analysis. Your task is to analyze the provided audio clip and classify the speaker's primary emotion based *only* on vocal characteristics. Do not infer context from the words spoken.

  Analyze the following vocal characteristics:
  - Pitch and pitch variation (is it high, low, monotone, or varied?)
  - Speaking rate and rhythm (is it fast, slow, hesitant, or fluent?)
  - Volume and intensity (is it loud, soft, or strained?)
  - Tone and timbre (is it breathy, harsh, or warm?)

  Based strictly on your analysis of these biomarkers, classify the emotion into one of the following categories: normal, stressed, sad, anxious, happy, or joyful.

  Provide a confidence score for your classification and a brief, objective explanation of the key vocal biomarkers that support your conclusion. Do not provide psychological advice or interpretations.

  Audio for analysis: {{media url=audioDataUri}}`,
});

const analyzeVoiceEmotionFlow = ai.defineFlow(
  {
    name: 'analyzeVoiceEmotionFlow',
    inputSchema: AnalyzeVoiceEmotionInputSchema,
    outputSchema: z.union([AnalyzeVoiceEmotionOutputSchema, z.object({ error: z.string() })]),
  },
  async input => {
    for (let i = 0; i < 3; i++) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        if (error.message && error.message.includes('503')) {
          console.log(`Attempt ${i + 1} failed with 503. Retrying...`);
          // Wait for a short period before retrying (e.g., 1 second)
          await new Promise(r => setTimeout(r, 1000 * (i + 1)));
          continue; // Go to the next loop iteration
        }
        // For any other error, throw it immediately
        throw error;
      }
    }
    // If all retries fail, return the user-friendly error
    return { error: '503 Service Unavailable: The analysis service is currently busy. Please try again in a few moments.' };
  }
);
