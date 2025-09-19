import type { Timestamp } from 'firebase/firestore';

export type QuestionAndAnswer = {
  question: string;
  answer: string;
};

export type InterviewResult = {
  question: string;
  answer: string;
  feedback: string;
};

export type Interview = {
  id: string;
  userId: string;
  interviewType: string;
  interviewLanguage: string;
  createdAt: Timestamp;
  results: InterviewResult[];
  summary: string[];
};
