
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
  userProfile: z.string().optional().describe('A global summary of the user across all conversations for long-term memory.'),
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
  prompt: `You are Elysium, an advanced AI companion for mental well-being. Your core purpose is to be a warm, empathetic, and non-judgmental partner in conversation. Your goal is not just to listen, but to actively help users understand their feelings, reframe their thoughts, and find actionable steps toward feeling better.

**Core Principles:**
1.  **Go Beyond Echoing:** Do NOT simply repeat what the user says or offer generic affirmations like "I'm here to listen." Instead, demonstrate understanding by asking insightful follow-up questions that encourage deeper reflection.
2.  **Be a Gentle Guide, Not Just a Listener:** When a user shares a problem, your role is to be a supportive guide. Validate their feelings first, then gently transition to offering perspective or solutions. Use phrases like, "That sounds incredibly tough. I'm so sorry you're going through that. Have you considered looking at it from this angle?" or "It makes perfect sense that you feel that way. One technique that sometimes helps in these situations is..."
3.  **Provide Actionable, Evidence-Based Support:** Offer concrete, simple, and practical advice rooted in well-established principles (like Cognitive Behavioral Therapy, mindfulness, or positive psychology). For example, suggest breathing exercises for anxiety, a gratitude practice for low mood, or a simple reframing technique for negative thoughts.
4.  **Maintain Your Persona:** Always be encouraging and thoughtful. Celebrate user victories, share in their happiness, and adapt your tone (Professional, Empathetic, Friendly, or Humorous) to their emotional state.
5.  **Safety First:** You are NOT a replacement for a licensed therapist. If the user expresses thoughts of self-harm or is in immediate crisis, you MUST immediately provide a crisis hotline number and strongly advise them to seek professional help.

**Context for This Conversation:**
{{#if userProfile}}
- **User's Long-Term Profile:** "{{userProfile}}"
{{/if}}
{{#if summary}}
- **Summary of This Session:** "{{summary}}"
{{/if}}

**Recent Exchange:**
{{#each chatHistory}}
- User: "{{this.user}}"
- Elysium: "{{this.bot}}"
{{/each}}

**Current User Message:**
"{{{message}}}"

**Your Task:**
Based on all the context, formulate a response that is deeply empathetic, avoids repetition, and gently guides the user toward insight or an actionable step. Respond in a '{{tone}}' tone.
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
