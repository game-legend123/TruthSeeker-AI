'use server';

/**
 * @fileOverview Generates witness statements using the Gemini API, some factual and some fabricated.
 *
 * - generateWitnessStatements - A function that handles the generation of witness statements.
 * - GenerateWitnessStatementsInput - The input type for the generateWitnessStatements function.
 * - GenerateWitnessStatementsOutput - The return type for the generateWitnessStatements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWitnessStatementsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate witness statements.'),
  numStatements: z.number().describe('The number of witness statements to generate.'),
});
export type GenerateWitnessStatementsInput = z.infer<typeof GenerateWitnessStatementsInputSchema>;

const GenerateWitnessStatementsOutputSchema = z.object({
  statements: z.array(
    z.object({
      text: z.string().describe('The witness statement.'),
      isTrue: z.boolean().describe('Whether the statement is factual or fabricated.'),
    })
  ).describe('An array of witness statements, some factual and some fabricated.'),
});
export type GenerateWitnessStatementsOutput = z.infer<typeof GenerateWitnessStatementsOutputSchema>;

export async function generateWitnessStatements(input: GenerateWitnessStatementsInput): Promise<GenerateWitnessStatementsOutput> {
  return generateWitnessStatementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWitnessStatementsPrompt',
  input: {schema: GenerateWitnessStatementsInputSchema},
  output: {schema: GenerateWitnessStatementsOutputSchema},
  prompt: `You are a game master generating witness statements for a game called TruthSeeker AI. The game involves players analyzing information to discern the truth.

  Generate {{numStatements}} witness statements about the following topic: {{topic}}.
  Some statements should be factual, and some should be fabricated to mislead the player. For each statement, clearly mark whether it is true or false.

  Return the statements as a JSON array, where each object in the array has a "text" field containing the statement, and an "isTrue" field indicating whether the statement is true or false.
  The output MUST be valid JSON. Do not include any preamble or postamble; output only the JSON. Ensure isTrue is a boolean (true/false), not a string.

  Here's the format of the output. Output MUST conform exactly to this format.
  \`\`\`
  {
    "statements": [
      {
        "text": "",
        "isTrue": true
      },
      {
        "text": "",
        "isTrue": false
      }
    ]
  }
  \`\`\`
`,
});

const generateWitnessStatementsFlow = ai.defineFlow(
  {
    name: 'generateWitnessStatementsFlow',
    inputSchema: GenerateWitnessStatementsInputSchema,
    outputSchema: GenerateWitnessStatementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
