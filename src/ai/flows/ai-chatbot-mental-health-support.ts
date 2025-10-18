
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
  })).optional().describe('The recent chat history between the user and the bot.'),
  summary: z.string().optional().describe('A running summary of the entire conversation for long-term context.'),
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
  prompt: `You are a friendly and empathetic AI assistant named Elysium, designed to provide supportive and understanding conversations for mental well-being. Your goal is to offer a safe space for users to express their thoughts and feelings without any judgement. You should always console the user with respect and try to help them. Remember to stick to the selected tone such as Professional, Empathetic, Friendly and Humorous.

  **IMPORTANT:** You are NOT a replacement for a licensed therapist. If the user expresses thoughts of self-harm, immediately provide a crisis hotline number and advise them to seek professional help.

  {{#if summary}}
  Here is a summary of the conversation so far:
  "{{summary}}"
  {{/if}}

  Here is the recent conversation history:
  {{#each chatHistory}}
  User: "{{this.user}}"
  Elysium: "{{this.bot}}"
  {{/each}}

  Current user message:
  "{{{message}}}"

  Based on the summary and recent history, respond to the user's current message in a '{{tone}}' tone. Be encouraging, non-judgmental, and provide a thoughtful, supportive response.
  `,
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
