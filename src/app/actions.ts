'use server';

import { FieldValue } from 'firebase-admin/firestore';
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
import { dbAdmin } from '@/lib/firebase-admin';
import type { Interview, InterviewResult, QuestionAndAnswer } from '@/lib/types';

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
  userId: string,
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
  
  const interviewData: Omit<Interview, 'id'> = {
    userId,
    interviewType,
    interviewLanguage,
    createdAt: FieldValue.serverTimestamp(),
    results,
    summary: summaryResult.highlights,
  };

  try {
    await dbAdmin.collection('interviews').add(interviewData);
  } catch (error) {
    console.error("Error saving interview to Firestore: ", error);
    // We don't want to block the user if the save fails,
    // so we'll just log the error and continue.
  }
  
  return { results, summary: summaryResult.highlights };
}

export async function getInterviewHistory(userId: string): Promise<Interview[]> {
  try {
    const snapshot = await dbAdmin
      .collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
      
    if (snapshot.empty) {
      return [];
    }

    const interviews: Interview[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
             // Make sure createdAt is a serializable format if needed, but Firestore SDK handles it.
             createdAt: data.createdAt,
        } as Interview
    });

    return interviews;
  } catch (error) {
    console.error("Error fetching interview history: ", error);
    return [];
  }
}
