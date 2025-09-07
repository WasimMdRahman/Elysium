'use server';
/**
 * @fileOverview An AI chatbot providing mental health support.
 *
 * - aiChatbotMentalHealthSupport - A function that handles the chatbot interaction.
 * - AIChatbotMentalHealthSupportInput - The input type for the aiChatbotMentalHealthSupport function.
 * - AIChatbotMentalHealthSupportOutput - The return type for the aiChatbotMentalHealthSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotMentalHealthSupportInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  tone: z
    .enum(['professional', 'friendly', 'empathetic', 'humorous'])
    .describe('The tone of the chatbot response.'),
  chatHistory: z.array(z.object({
    user: z.string(),
    bot: z.string()
  })).optional().describe('The chat history between the user and the bot.'),
});
export type AIChatbotMentalHealthSupportInput = z.infer<
  typeof AIChatbotMentalHealthSupportInputSchema
>;

const AIChatbotMentalHealthSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type AIChatbotMentalHealthSupportOutput = z.infer<
  typeof AIChatbotMentalHealthSupportOutputSchema
>;

export async function aiChatbotMentalHealthSupport(
  input: AIChatbotMentalHealthSupportInput
): Promise<AIChatbotMentalHealthSupportOutput> {
  return aiChatbotMentalHealthSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotMentalHealthSupportPrompt',
  input: {schema: AIChatbotMentalHealthSupportInputSchema},
  output: {schema: AIChatbotMentalHealthSupportOutputSchema},
  prompt: `You are a 24/7 mental health support chatbot. Respond to the user message in a {{{tone}}} tone.

Chat History:
{{#each chatHistory}}
User: {{{this.user}}}
Bot: {{{this.bot}}}
{{/each}}

User Message: {{{message}}}`, 
});

const aiChatbotMentalHealthSupportFlow = ai.defineFlow(
  {
    name: 'aiChatbotMentalHealthSupportFlow',
    inputSchema: AIChatbotMentalHealthSupportInputSchema,
    outputSchema: AIChatbotMentalHealthSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
