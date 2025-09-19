
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
  createdAt: unknown; // Using unknown for Firestore Timestamp
  results: InterviewResult[];
  summary: string[];
};
