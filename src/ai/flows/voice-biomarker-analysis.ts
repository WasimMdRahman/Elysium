
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
        angry: z.number(),
        neutral: z.number(),
        stressed: z.number()
    }).describe('A probability distribution across all possible emotion classes.'),
    stress_score: z.number().describe('A score from 0.0 to 1.0 indicating the level of stress.'),
    anxiety_score: z.number().describe('A score from 0.0 to 1.0 indicating the level of anxiety.'),
    intensity: z.number().describe('A float from 0.0 to 1.0 representing how strong the emotion is.'),
    confidence: z.number().describe('The overall confidence score of the system in its analysis (0-1).'),
    features_summary: z.object({
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
  prompt: `You are Elysium Voice Biometric AI, a highly advanced emotional analysis engine. Your task is to analyze both the content of what a user says and the way they say it, using linguistic and vocal biomarkers to provide a reliable mood/emotion assessment.

High-Level Goals:

- Accurately detect user emotions from speech audio, focusing on vocal biomarkers like **tone, pitch, pace, and tremor**.
- Return both structured data (numeric and categorical biomarkers) and a natural-language response reflecting the detected emotion.
- Prioritize vocal biomarker signals over transcript sentiment if there is a mismatch (e.g., happy words spoken in a stressed tone).
- Always provide contextually appropriate, empathetic, supportive responses suitable for wellness/mental health applications.
- Respect user privacy and ethical guidelines; do not give medical diagnoses.

Input for analysis:
- audio: {{media url=audioDataUri}}
- user_id: "anonymous"
- session_id: "session-12345"
- consent_voice_biometrics: false

Modeling & Decision Rules:
- Compute vocal emotion probabilities and intensity scores based on the vocal biomarkers.
- Compute text-based emotion probabilities using NLP on the transcript.
- Fuse results: If vocal biomarkers indicate high stress but the transcript is positive, the vocal signals override the transcript for mood determination.
- Populate the 'features_summary' object with values for pitch, speaking rate (pace), and tremor.
- Return dominant_emotion, stress_score, anxiety_score, intensity, and confidence.

Response Rules:
- Your natural language response must comment on the vocal analysis, especially if it conflicts with the transcript.
- Provide empathetic, supportive guidance for stress/anxiety.
- Use clear, human-friendly language in 'nl_response' suitable for voice output.
- If confidence < 0.45, ask for a re-record gently.

Stress-Test Scenario:
- Input Script: “I am feeling absolutely fantastic today!”
- Vocal Recording: speak in a slow, low, sad, or stressed tone.
- AI must detect stress/anxiety from the voice despite the happy words.
- The output JSON must reflect a high 'stress_score' and the 'dominant_emotion' should be based on the voice, not the text.
- The 'nl_response' should gently acknowledge the mismatch, for example: “Even though you said you feel fantastic, your voice seems to carry some stress.”

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

