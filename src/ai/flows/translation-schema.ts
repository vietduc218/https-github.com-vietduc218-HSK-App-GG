/**
 * @fileOverview Schemas and types for translation flows.
 */
import { z } from "zod";

// Schema for generating a new translation challenge
export const GenerateTranslationChallengeInputSchema = z.object({
  topic: z
    .string()
    .describe(
      'The topic for the text, e.g., "daily life", "technology", "travel".'
    ),
  level: z.string().describe('The HSK level for the text, e.g., "HSK 3".'),
});
export type GenerateTranslationChallengeInput = z.infer<
  typeof GenerateTranslationChallengeInputSchema
>;

// Schema for evaluating a translation
export const EvaluateTranslationAttemptInputSchema = z.object({
  chineseText: z.string().describe("The original Chinese text."),
  userTranslation: z.string().describe("The user's Vietnamese translation."),
});
export type EvaluateTranslationAttemptInput = z.infer<
  typeof EvaluateTranslationAttemptInputSchema
>;

export const EvaluateTranslationAttemptOutputSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score from 0-100 for the translation accuracy and fluency."
    ),
  feedback: z
    .string()
    .describe(
      "Constructive feedback on the translation, explaining what is good and what can be improved."
    ),
  suggestedTranslation: z
    .string()
    .describe(
      "A natural and accurate Vietnamese translation of the original text."
    ),
});
export type EvaluateTranslationAttemptOutput = z.infer<
  typeof EvaluateTranslationAttemptOutputSchema
>;
