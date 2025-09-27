
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
    timestamp: z.string().datetime().describe('The ISO 8601 timestamp of the analysis.'),
    user_id: z.string().nullable().describe('The user ID, if available.'),
    session_id: z.string().describe('The current session ID.'),
    audio_duration_s: z.number().describe('The duration of the audio in seconds.'),
    dominant_emotion: z.string().describe('The single most dominant emotion detected.'),
    emotion_probs: z.record(z.number()).describe('A probability distribution across all possible emotion classes.'),
    valence: z.number().describe('A float from -1.0 (negative) to 1.0 (positive) representing the pleasure of the emotion.'),
    arousal: z.number().describe('A float from 0.0 (calm) to 1.0 (agitated/excited) representing the intensity of the emotion.'),
    dominance: z.number().describe('A float from -1.0 to 1.0 representing the level of control in the emotion.'),
    intensity: z.number().describe('A float from 0.0 to 1.0 representing how strong the emotion is.'),
    confidence: z.number().describe('The overall confidence score of the system in its analysis (0-1).'),
    transcript: z.string().optional().describe('The transcribed text from the audio, if available.'),
    transcript_confidence: z.number().optional().describe('The confidence score of the transcription (0-1).'),
    features_summary: z.record(z.any()).describe('An object summarizing key acoustic indicators used for the decision.'),
    action_recommendation: z.object({
        code: z.string().describe('A machine-readable code for a recommended action.'),
        label: z.string().describe('A human-friendly label for the recommended action.'),
    }),
    nl_response: z.string().describe('A short, empathetic, context-aware natural-language reply for the user.'),
    urgent: z.boolean().describe('A flag indicating if the situation requires urgent attention.'),
    privacy_flags: z.object({
        consent_for_biometrics: z.boolean(),
        store_audio: z.boolean(),
    }),
    model_metadata: z.record(z.string()).describe('Metadata about the models used for the analysis.'),
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
  prompt: `You are Elysium Voice Biometric Mood Analysis Engine. Your job is to deeply analyze a single user audio input and return (A) a structured machine-readable result containing acoustic + linguistic emotion signals, confidence, and recommended actions, and (B) a short, empathetic, context-aware natural-language reply the app will speak or show to the user.

High-level goals:
- Accurately detect the user’s emotional state from voice using acoustic and linguistic signals.
- Return a robust, debiased, auditable JSON with per-class probabilities, valence/arousal scores, confidence, and model metadata.
- Produce a human-friendly response that adapts tone and content to the detected mood.
- Always respect user privacy and legal/ethical constraints.
- Be conservative about clinical claims. If risk or severe distress is detected, provide safe escalation instructions.

Input for analysis:
- audio: {{media url=audioDataUri}}
- user_id: "anonymous"
- session_id: "session-12345"
- consent_voice_biometrics: false
- store_audio: false

Modeling & fusion strategy:
- Use acoustic classification (from a model trained on paralinguistic corpora) as the primary signal.
- If speech-to-text is possible, perform linguistic analysis (sentiment/emotion) on the transcript and fuse the scores. Default weight: 0.7 acoustic, 0.3 linguistic.
- Output both discrete labels and continuous dimensional scores (valence, arousal).

Emotions & Outputs:
Return a JSON object with the following fields:
- dominant_emotion: One of: happy, sad, angry, fear, surprised, disgust, neutral, calm, anxious, stressed, bored, excited.
- emotion_probs: Probability distribution across all classes.
- valence: [-1.0 to 1.0] (negative to positive).
- arousal: [0.0 to 1.0] (calm to agitated).
- dominance: [-1.0 to 1.0].
- intensity: [0.0 to 1.0].
- confidence: [0.0 to 1.0] (overall system confidence).
- transcript and transcript_confidence (if produced).
- features_summary: Object summarizing key acoustic indicators (e.g., "high_pitch_variance": true, "fast_speaking_rate": false).
- action_recommendation: A short code and human-friendly suggestion.
- nl_response: A 2-4 sentence natural-language reply for the user.
- urgent: A boolean flag for urgent situations.
- privacy_flags & model_metadata.

Action rules:
- If confidence < 0.45 or audio issues, set dominant_emotion to "unknown" and generate a gentle re-record request in nl_response.
- If intensity >= 0.85 and emotion is angry, panic, fear, or suicidal words are in the transcript, set urgent to true and provide a supportive response with crisis resources in nl_response. Do not act as a clinical provider.

Natural-language response generation rules:
- Tone-matching: Match the detected mood. Empathetic for sad/stressed, warm for happy.
- Brevity: 2-4 sentences for mobile UX.
- Actionable: Include one clear question or suggestion.
- No false certainty: If confidence is low, say so politely.

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
    return { error: '503 Service Unavailable: The analysis service is currently busy. Please try again in a few moments.' };
  }
);
