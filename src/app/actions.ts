'use server';

import {
  generateAIInterviewQuestions,
  type GenerateAIInterviewQuestionsInput,
} from '@/ai/flows/generate-ai-interview-questions';
import {
  provideFeedback,
  type ProvideFeedbackInput,
} from '@/ai/flows/provide-feedback-on-user-answers';
import type { InterviewResult, QuestionAndAnswer } from '@/lib/types';

export async function generateQuestions(
  interviewType: string
): Promise<string[]> {
  const input: GenerateAIInterviewQuestionsInput = {
    interviewType,
    numberOfQuestions: 8,
  };
  const result = await generateAIInterviewQuestions(input);
  return result.questions;
}

export async function analyzeInterview(
  interviewType: string,
  answers: QuestionAndAnswer[]
): Promise<InterviewResult[]> {
  const feedbackPromises = answers.map((qa) => {
    const feedbackInput: ProvideFeedbackInput = {
      interviewType,
      question: qa.question,
      userAnswer: qa.answer,
    };
    return provideFeedback(feedbackInput);
  });

  const feedbackResults = await Promise.all(feedbackPromises);

  const results: InterviewResult[] = answers.map((qa, index) => ({
    ...qa,
    feedback: feedbackResults[index].feedback,
  }));

  return results;
}
