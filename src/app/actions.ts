'use server';

import {
  generateAIInterviewQuestions,
  type GenerateAIInterviewQuestionsInput,
} from '@/ai/flows/generate-ai-interview-questions';
import {
  provideFeedback,
  type ProvideFeedbackInput,
} from '@/ai/flows/provide-feedback-on-user-answers';
import {
  summarizeInterview,
  type SummarizeInterviewInput,
} from '@/ai/flows/summarize-interview';
import type { InterviewResult, QuestionAndAnswer, Interview } from '@/lib/types';

export async function generateQuestions(
  interviewType: string,
  interviewLanguage: string
): Promise<string[]> {
  const input: GenerateAIInterviewQuestionsInput = {
    interviewType,
    interviewLanguage,
    numberOfQuestions: 8,
  };
  const result = await generateAIInterviewQuestions(input);
  return result.questions;
}

export async function analyzeAndSaveInterview(
  userId: string, // This is now a placeholder ('anonymous')
  interviewType: string,
  interviewLanguage: string,
  answers: QuestionAndAnswer[]
): Promise<{ results: InterviewResult[]; summary: string[] }> {
  const feedbackPromises = answers.map((qa) => {
    const feedbackInput: ProvideFeedbackInput = {
      interviewType,
      interviewLanguage,
      question: qa.question,
      userAnswer: qa.answer,
    };
    return provideFeedback(feedbackInput);
  });

  const summaryInput: SummarizeInterviewInput = {
    interviewType,
    interviewLanguage,
    questionsAndAnswers: answers,
  };
  const summaryPromise = summarizeInterview(summaryInput);

  const [feedbackResults, summaryResult] = await Promise.all([
    Promise.all(feedbackPromises),
    summaryPromise,
  ]);

  const results: InterviewResult[] = answers.map((qa, index) => ({
    ...qa,
    feedback: feedbackResults[index].feedback,
  }));
  
  // Database saving is disabled.
  
  return { results, summary: summaryResult.highlights };
}

export async function getInterviewHistory(userId: string): Promise<Interview[]> {
    // History is disabled.
    return [];
}
