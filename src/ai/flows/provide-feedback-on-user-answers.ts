'use server';

/**
 * @fileOverview Provides feedback on user answers during an interview.
 *
 * - provideFeedback - A function that takes the question and user's answer and returns feedback.
 * - ProvideFeedbackInput - The input type for the provideFeedback function.
 * - ProvideFeedbackOutput - The return type for the provideFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideFeedbackInputSchema = z.object({
  question: z.string().describe('The question asked during the interview.'),
  userAnswer: z.string().describe('The user\'s answer to the question.'),
  interviewType: z.string().describe('The type of interview being conducted, e.g., Software Engineer, Data Analyst.'),
});
export type ProvideFeedbackInput = z.infer<typeof ProvideFeedbackInputSchema>;

const ProvideFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Constructive feedback on the user\'s answer, including strengths, weaknesses, and suggestions for improvement.'),
});
export type ProvideFeedbackOutput = z.infer<typeof ProvideFeedbackOutputSchema>;

export async function provideFeedback(input: ProvideFeedbackInput): Promise<ProvideFeedbackOutput> {
  return provideFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideFeedbackPrompt',
  input: {schema: ProvideFeedbackInputSchema},
  output: {schema: ProvideFeedbackOutputSchema},
  prompt: `You are an AI Interviewer providing feedback on a candidate's answer during a {{interviewType}} interview.

Question: {{{question}}}
User's Answer: {{{userAnswer}}}

Provide clear, constructive, and professional feedback. Highlight what was good in the answer. Suggest how to improve it for real interviews. Include strengths, weaknesses, and concrete suggestions.
`,
});

const provideFeedbackFlow = ai.defineFlow(
  {
    name: 'provideFeedbackFlow',
    inputSchema: ProvideFeedbackInputSchema,
    outputSchema: ProvideFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {feedback: output!.feedback!};
  }
);
