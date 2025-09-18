'use server';
/**
 * @fileOverview Generates a list of interview questions based on the selected interview type.
 *
 * - generateAIInterviewQuestions - A function that generates interview questions.
 * - GenerateAIInterviewQuestionsInput - The input type for the generateAIInterviewQuestions function.
 * - GenerateAIInterviewQuestionsOutput - The return type for the generateAIInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAIInterviewQuestionsInputSchema = z.object({
  interviewType: z.string().describe('The type of interview to generate questions for (e.g., Software Engineer, Data Analyst).'),
  interviewLanguage: z.string().describe('The language for the interview (e.g., English, Hindi, Marathi).'),
  numberOfQuestions: z.number().min(5).max(10).default(8).describe('The number of interview questions to generate (between 5 and 10).'),
});
export type GenerateAIInterviewQuestionsInput = z.infer<typeof GenerateAIInterviewQuestionsInputSchema>;

const GenerateAIInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated interview questions.'),
});
export type GenerateAIInterviewQuestionsOutput = z.infer<typeof GenerateAIInterviewQuestionsOutputSchema>;

export async function generateAIInterviewQuestions(input: GenerateAIInterviewQuestionsInput): Promise<GenerateAIInterviewQuestionsOutput> {
  return generateAIInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAIInterviewQuestionsPrompt',
  input: {
    schema: GenerateAIInterviewQuestionsInputSchema,
  },
  output: {
    schema: GenerateAIInterviewQuestionsOutputSchema,
  },
  prompt: `You are an AI Interviewer. Your task is to generate {{numberOfQuestions}} relevant interview questions for a {{interviewType}} interview. The interview should be conducted in {{interviewLanguage}}. The questions should be suitable for assessing a candidate's skills, experience, and cultural fit. Generate a diverse set of questions, including technical, behavioral, and situational questions where applicable. Return a JSON array of strings.

    The questions must be in the {{interviewLanguage}} language.

    Do not provide any introductory or concluding text. Only include the questions themselves.
    `,
});

const generateAIInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateAIInterviewQuestionsFlow',
    inputSchema: GenerateAIInterviewQuestionsInputSchema,
    outputSchema: GenerateAIInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
