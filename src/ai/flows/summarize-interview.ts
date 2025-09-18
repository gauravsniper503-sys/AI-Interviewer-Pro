'use server';

/**
 * @fileOverview Summarizes the interview into key highlights.
 *
 * - summarizeInterview - A function that summarizes the interview and provides key highlights.
 * - SummarizeInterviewInput - The input type for the summarizeInterview function.
 * - SummarizeInterviewOutput - The return type for the summarizeInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInterviewInputSchema = z.object({
  interviewType: z.string().describe('The type of interview conducted.'),
  questionsAndAnswers: z
    .array(z.object({
      question: z.string().describe('The interview question.'),
      answer: z.string().describe('The user\'s answer to the question.'),
    }))
    .describe('An array of questions and answers from the interview.'),
});

export type SummarizeInterviewInput = z.infer<typeof SummarizeInterviewInputSchema>;

const SummarizeInterviewOutputSchema = z.object({
  highlights: z
    .array(z.string())
    .describe('Key highlights and summaries from the interview.'),
});

export type SummarizeInterviewOutput = z.infer<typeof SummarizeInterviewOutputSchema>;

export async function summarizeInterview(input: SummarizeInterviewInput): Promise<SummarizeInterviewOutput> {
  return summarizeInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInterviewPrompt',
  input: {schema: SummarizeInterviewInputSchema},
  output: {schema: SummarizeInterviewOutputSchema},
  prompt: `You are an AI assistant that summarizes job interview conversations and returns a list of highlights from the interview.

  Interview Type: {{interviewType}}

  Questions and Answers:
  {{#each questionsAndAnswers}}
  Question: {{this.question}}
  Answer: {{this.answer}}
  {{/each}}

  Please provide a list of key highlights that accurately summarizes the interview. Focus on the most important aspects of the candidate's responses and overall performance. Return the highlights as a bulleted list.
  `,
});

const summarizeInterviewFlow = ai.defineFlow(
  {
    name: 'summarizeInterviewFlow',
    inputSchema: SummarizeInterviewInputSchema,
    outputSchema: SummarizeInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
