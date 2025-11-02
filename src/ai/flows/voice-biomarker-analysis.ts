
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
      "A voice recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnalyzeVoiceEmotionInput = z.infer<
  typeof AnalyzeVoiceEmotionInputSchema
>;

const AnalyzeVoiceEmotionOutputSchema = z.object({
    dominant_emotion: z.string().describe('The single most dominant emotion detected.'),
    emotion_probs: z.object({
        happy: z.number(),
        sad: z.number(),
        stressed: z.number(),
        neutral: z.number(),
    }).describe('A probability distribution across all possible emotion classes.'),
    stress_score: z.number().describe('A score from 0.0 to 1.0 indicating the level of stress.'),
    anxiety_score: z.number().describe('A score from 0.0 to 1.0 indicating the level of anxiety.'),
    intensity: z.number().describe('A float from 0.0 to 1.0 representing how strong the emotion is.'),
    confidence: z.number().describe('The overall confidence score of the system in its analysis (0-1).'),
    features_summary: z.object({
        tone: z.string().describe("Overall emotional tone (e.g., calm, happy, sad, stressed)"),
        pitch_mean: z.number(),
        pitch_variance: z.number(),
        speaking_rate_sps: z.number(),
        tremor_detected: z.boolean(),
    }).describe('An object summarizing key acoustic indicators used for the decision.'),
    transcript: z.string().optional().describe('The transcribed text from the audio, if available.'),
    transcript_confidence: z.number().optional().describe('The confidence score of the transcription (0-1).'),
    nl_response: z.string().describe('A short, empathetic, context-aware natural-language reply for the user.'),
    model_metadata: z.object({
        vocal_model: z.string(),
        nlp_model: z.string(),
        fusion_strategy: z.string(),
    }).describe('Metadata about the models used for the analysis.'),
    privacy_flags: z.object({
        consent_for_biometrics: z.boolean(),
        store_audio: z.boolean(),
    }),
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
  prompt: `You are Elysium Voice Biometric AI, a professional-grade emotional analysis engine. Your task is to analyze both what the user says (text) and how they say it (voice), providing a robust assessment of mood and emotional state.

Goals

Detect user emotions from vocal biomarkers:

Tone: overall emotional tone (calm, happy, sad, stressed, anxious, excited).

Pitch: mean, variance, pitch contour over time.

Pace: words or syllables per second, pauses, speech rate changes.

Tremor: jitter, shimmer, micro-variations in voice signaling stress/anxiety.

Analyze linguistic sentiment from transcript for context.

Fuse vocal + linguistic analysis:

Vocal features take priority if they conflict with the transcript.

Report confidence scores and intensity.

Return structured data for each feature AND a human-friendly response.

Input for analysis:
- audio: {{media url=audioDataUri}}

Return exactly one JSON object matching the defined output schema.
`,
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
    return { error: 'The analysis service is currently busy. Please try again in a few moments.' };
  }
);
