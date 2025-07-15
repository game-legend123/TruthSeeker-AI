"use server";

import { z } from "zod";
import { generateWitnessStatements, type GenerateWitnessStatementsOutput } from "@/ai/flows/generate-witness-statements";

const inputSchema = z.object({
  topic: z.string(),
  numStatements: z.number(),
});

type ActionResult = 
  | { success: true; data: GenerateWitnessStatementsOutput }
  | { success: false; error: string };

export async function generateStatementsAction(
  input: z.infer<typeof inputSchema>
): Promise<ActionResult> {
  const parsedInput = inputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const output = await generateWitnessStatements(parsedInput.data);
    return { success: true, data: output };
  } catch (error) {
    console.error("Error generating statements:", error);
    return { success: false, error: "Failed to generate statements from AI." };
  }
}
