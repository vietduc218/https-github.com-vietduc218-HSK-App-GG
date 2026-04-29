"use server";

import { generateAdvancedExamples } from "@/ai/flows/generate-advanced-examples";
import { z } from "zod";

const hskWordSchema = z.object({
  chineseCharacter: z.string(),
  pinyin: z.string(),
  vietnameseMeaning: z.string(),
});

export async function getAiExamples(input: {
  chineseCharacter: string;
  pinyin: string;
  vietnameseMeaning: string;
}) {
  const validatedInput = hskWordSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error("Invalid input");
  }

  try {
    const result = await generateAdvancedExamples(validatedInput.data);
    return {
      success: true,
      examples: result.examples,
    };
  } catch (error) {
    console.error("AI example generation failed:", error);
    return {
      success: false,
      error: "Không thể tạo ví dụ. Vui lòng thử lại.",
    };
  }
}
