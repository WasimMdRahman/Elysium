'use server';

/**
 * @fileOverview An AI chatbot emotion detection flow.
 *
 * - detectChatbotEmotion - A function that handles the emotion detection process.
 * - DetectChatbotEmotionInput - The input type for the detectChatbotEmotion function.
 * - DetectChatbotEmotionOutput - The return type for the detectChatbotEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectChatbotEmotionInputSchema = z.object({
  message: z.string().describe('The message from the user to analyze for emotion.'),
});
export type DetectChatbotEmotionInput = z.infer<typeof DetectChatbotEmotionInputSchema>;

const DetectChatbotEmotionOutputSchema = z.object({
  emotion: z.string().describe('The detected emotion in the message.'),
  confidence: z.number().describe('The confidence level of the detected emotion (0-1).'),
});
export type DetectChatbotEmotionOutput = z.infer<typeof DetectChatbotEmotionOutputSchema>;

export async function detectChatbotEmotion(input: DetectChatbotEmotionInput): Promise<DetectChatbotEmotionOutput> {
  return detectChatbotEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectChatbotEmotionPrompt',
  input: {schema: DetectChatbotEmotionInputSchema},
  output: {schema: DetectChatbotEmotionOutputSchema},
  prompt: `You are an AI emotion detection expert. Analyze the following message and determine the primary emotion expressed. Also, provide a confidence level for your assessment.

Message: {{{message}}}

Respond with the detected emotion and a confidence level (0-1).`,
});

const detectChatbotEmotionFlow = ai.defineFlow(
  {
    name: 'detectChatbotEmotionFlow',
    inputSchema: DetectChatbotEmotionInputSchema,
    outputSchema: DetectChatbotEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
