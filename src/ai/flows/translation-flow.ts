'use server';
/**
 * @fileOverview Genkit flows for the translation practice mode.
 * - evaluateTranslationAttempt: Evaluates the user's translation and provides feedback.
 */

import { ai } from '@/ai/genkit';
import {
  EvaluateTranslationAttemptInputSchema,
  type EvaluateTranslationAttemptInput,
  EvaluateTranslationAttemptOutputSchema,
  type EvaluateTranslationAttemptOutput,
} from '@/ai/flows/translation-schema';


// --- Flow for evaluating translation ---
const evaluateTranslationPrompt = ai.definePrompt({
  name: 'evaluateTranslationPrompt',
  input: { schema: EvaluateTranslationAttemptInputSchema },
  output: { schema: EvaluateTranslationAttemptOutputSchema },
  prompt: `Bạn là một chuyên gia dịch thuật và giáo viên dạy tiếng Trung-Việt.
    Nhiệm vụ của bạn là đánh giá bản dịch của người học từ tiếng Trung sang tiếng Việt.

    Văn bản gốc tiếng Trung:
    ---
    {{{chineseText}}}
    ---

    Bản dịch của người học:
    ---
    {{{userTranslation}}}
    ---

    Hãy thực hiện các công việc sau:
    1.  Chấm điểm bản dịch trên thang điểm 100, dựa trên độ chính xác về ngữ nghĩa, ngữ pháp và sự tự nhiên trong văn phong tiếng Việt.
    2.  Đưa ra phản hồi mang tính xây dựng:
        -   Khen ngợi những điểm dịch tốt.
        -   Chỉ ra những lỗi sai (nếu có) về từ vựng, ngữ pháp hoặc diễn đạt.
        -   Giải thích tại sao đó là lỗi và cách sửa.
    3.  Đề xuất một bản dịch tiếng Việt chuẩn, tự nhiên và phù hợp nhất.
    `,
});

const evaluateTranslationAttemptFlow = ai.defineFlow(
  {
    name: 'evaluateTranslationAttemptFlow',
    inputSchema: EvaluateTranslationAttemptInputSchema,
    outputSchema: EvaluateTranslationAttemptOutputSchema,
  },
  async (input) => {
    const { output } = await evaluateTranslationPrompt(input);
    return output!;
  }
);

export async function evaluateTranslationAttempt(
  input: EvaluateTranslationAttemptInput
): Promise<EvaluateTranslationAttemptOutput> {
  return evaluateTranslationAttemptFlow(input);
}
