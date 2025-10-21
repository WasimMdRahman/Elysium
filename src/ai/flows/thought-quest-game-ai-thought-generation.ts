
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
  previousThoughts: z.array(z.string()).optional().describe('A list of thoughts that have already been generated in the current session to avoid repetition.'),
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
  
  **Critically, you must generate a balanced mix of helpful and unhelpful thoughts. Do not only generate unhelpful thoughts.**
  
  A helpful thought is positive and empowering (e.g., 'I am capable and strong', 'Today is a new opportunity').
  An unhelpful thought is often negative or a cognitive distortion (e.g., 'I'll never succeed', 'Everyone is better than me').
  
  **To ensure variety, do not generate any of the following thoughts which have already been used:**
  {{#each previousThoughts}}
  - "{{this}}"
  {{/each}}

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
    // Retry logic for 503 errors
    for (let i = 0; i < 3; i++) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        if (error.message && error.message.includes('503')) {
          console.log(`Attempt ${i + 1} for generateThought failed with 503. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          continue;
        }
        // For any other error, throw it immediately
        throw error;
      }
    }
     // If all retries fail, throw a user-friendly error.
    throw new Error('The AI service is currently busy. Please try again in a few moments.');
  }
);
