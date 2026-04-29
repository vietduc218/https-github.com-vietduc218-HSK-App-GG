'use server';
/**
 * @fileOverview A Genkit flow for generating advanced example sentences for HSK vocabulary words.
 *
 * - generateAdvancedExamples - A function that generates example sentences for a given HSK word.
 * - GenerateAdvancedExamplesInput - The input type for the generateAdvancedExamples function.
 * - GenerateAdvancedExamplesOutput - The return type for the generateAdvancedExamples function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdvancedExamplesInputSchema = z.object({
  chineseCharacter: z.string().describe('The HSK Chinese character.'),
  pinyin: z.string().describe('The pinyin of the HSK word.'),
  vietnameseMeaning: z.string().describe('The Vietnamese meaning of the HSK word.'),
});
export type GenerateAdvancedExamplesInput = z.infer<typeof GenerateAdvancedExamplesInputSchema>;

const GenerateAdvancedExamplesOutputSchema = z.object({
  examples: z.array(z.string()).describe('A list of contextually relevant example sentences in Chinese.'),
});
export type GenerateAdvancedExamplesOutput = z.infer<typeof GenerateAdvancedExamplesOutputSchema>;

export async function generateAdvancedExamples(input: GenerateAdvancedExamplesInput): Promise<GenerateAdvancedExamplesOutput> {
  return generateAdvancedExamplesFlow(input);
}

const generateAdvancedExamplesPrompt = ai.definePrompt({
  name: 'generateAdvancedExamplesPrompt',
  input: {schema: GenerateAdvancedExamplesInputSchema},
  output: {schema: GenerateAdvancedExamplesOutputSchema},
  prompt: `Bạn là một giáo viên tiếng Trung chuyên nghiệp, có khả năng tạo ra các câu ví dụ đa dạng và ngữ cảnh cho từ vựng.
Nhiệm vụ của bạn là tạo ra 3 câu ví dụ tiếng Trung độc đáo và ngữ cảnh cho từ HSK sau đây, dựa trên chữ Hán, bính âm và nghĩa tiếng Việt của nó. Các câu ví dụ phải thể hiện cách sử dụng từ trong các tình huống khác nhau.

Từ Hán Việt: {{{chineseCharacter}}}
Bính âm: {{{pinyin}}}
Nghĩa tiếng Việt: {{{vietnameseMeaning}}}`,
});

const generateAdvancedExamplesFlow = ai.defineFlow(
  {
    name: 'generateAdvancedExamplesFlow',
    inputSchema: GenerateAdvancedExamplesInputSchema,
    outputSchema: GenerateAdvancedExamplesOutputSchema,
  },
  async (input) => {
    const {output} = await generateAdvancedExamplesPrompt(input);
    return output!;
  }
);
