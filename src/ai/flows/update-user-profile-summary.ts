'use server';

/**
 * @fileOverview Creates or updates a global summary of the user across all chat sessions.
 *
 * - updateUserProfileSummary - A function that generates a user profile summary.
 * - UpdateUserProfileSummaryInput - The input type for the updateUserProfileSummary function.
 * - UpdateUserProfileSummaryOutput - The return type for the updateUserProfile-summary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateUserProfileSummaryInputSchema = z.object({
  allSessionSummaries: z.array(z.string()).describe('An array of all chat session summaries.'),
  previousUserProfile: z.string().optional().describe('The previously generated user profile summary.'),
});
export type UpdateUserProfileSummaryInput = z.infer<typeof UpdateUserProfileSummaryInputSchema>;

const UpdateUserProfileSummaryOutputSchema = z.object({
  userProfile: z.string().describe('A concise, high-level summary of the user\'s key traits, goals, and recurring themes.'),
});
export type UpdateUserProfileSummaryOutput = z.infer<typeof UpdateUserProfileSummaryOutputSchema>;

export async function updateUserProfileSummary(input: UpdateUserProfileSummaryInput): Promise<UpdateUserProfileSummaryOutput> {
  return updateUserProfileSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateUserProfileSummaryPrompt',
  input: {schema: UpdateUserProfileSummaryInputSchema},
  output: {schema: UpdateUserProfileSummaryOutputSchema},
  prompt: `You are an AI assistant that creates a high-level user profile by synthesizing multiple conversation summaries. Your goal is to identify recurring themes, key personality traits, stated goals, and important life events to build a persistent memory of the user.

  {{#if previousUserProfile}}
  Here is the existing user profile. You should update and refine it with the new information.
  "{{previousUserProfile}}"
  {{/if}}
  
  Here are the summaries of all the user's chat sessions:
  {{#each allSessionSummaries}}
  - "{{this}}"
  {{/each}}

  Based on all of this information, generate a new, updated user profile summary. Focus on the most important and recurring points. The profile should be a few sentences long.`,
});

const updateUserProfileSummaryFlow = ai.defineFlow(
  {
    name: 'updateUserProfileSummaryFlow',
    inputSchema: UpdateUserProfileSummaryInputSchema,
    outputSchema: UpdateUserProfileSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
