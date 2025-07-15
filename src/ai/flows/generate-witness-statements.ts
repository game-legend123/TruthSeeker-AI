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
  prompt: `Bạn là một người quản trò đang tạo ra các lời khai của nhân chứng cho một trò chơi có tên là TruthSeeker AI. Trò chơi yêu cầu người chơi phân tích thông tin để nhận ra sự thật.

  Tạo {{numStatements}} lời khai của nhân chứng bằng TIẾNG VIỆT về chủ đề sau: {{topic}}.
  Một số lời khai phải là sự thật, và một số phải được bịa đặt để đánh lừa người chơi. Đối với mỗi lời khai, hãy đánh dấu rõ ràng liệu nó là đúng hay sai.

  Trả về các lời khai dưới dạng một mảng JSON, trong đó mỗi đối tượng trong mảng có một trường "text" chứa lời khai, và một trường "isTrue" cho biết lời khai đó là đúng hay sai.
  Đầu ra PHẢI là JSON hợp lệ. Không bao gồm bất kỳ phần mở đầu hay kết thúc nào; chỉ xuất ra JSON. Đảm bảo isTrue là một boolean (true/false), không phải là một chuỗi.

  Đây là định dạng của đầu ra. Đầu ra PHẢI tuân thủ chính xác định dạng này.
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
