'use server';

/**
 * @fileOverview Generates new thoughts for the Thought Quest game using AI.
 *
 * - generateThought - A function that generates a new thought for the Thought Quest game.
 * - GenerateThoughtInput - The input type for the generateThought function.
 * - GenerateThoughtOutput - The return type for the generateThought function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThoughtInputSchema = z.object({
  topic: z
    .string()
    .describe('The topic for the thought, which can be anything.'),
});
export type GenerateThoughtInput = z.infer<typeof GenerateThoughtInputSchema>;

const GenerateThoughtOutputSchema = z.object({
  thought: z.string().describe('The AI generated thought.'),
  isHelpful: z.boolean().describe('Whether the generated thought is helpful (true) or unhelpful (false).'),
});
export type GenerateThoughtOutput = z.infer<typeof GenerateThoughtOutputSchema>;

export async function generateThought(input: GenerateThoughtInput): Promise<GenerateThoughtOutput> {
  return generateThoughtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThoughtPrompt',
  input: {schema: GenerateThoughtInputSchema},
  output: {schema: GenerateThoughtOutputSchema},
  prompt: `You are an AI that generates thoughts for a CBT based game called Thought Quest.

  The user will provide you with a topic and you will generate a new thought related to that topic.
  You should generate a mix of helpful and unhelpful thoughts.
  A helpful thought is positive and empowering (e.g., 'I am capable and strong', 'Today is a new opportunity').
  An unhelpful thought is often negative or a cognitive distortion (e.g., 'I'll never succeed', 'Everyone is better than me').
  
  You must also determine if the thought you generated is helpful (true) or unhelpful (false) and set the isHelpful boolean field accordingly.

  Topic: {{{topic}}}
  `,
});

const generateThoughtFlow = ai.defineFlow(
  {
    name: 'generateThoughtFlow',
    inputSchema: GenerateThoughtInputSchema,
    outputSchema: GenerateThoughtOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
