'use client';

import { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { generateQuestions, analyzeInterview } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { InterviewSetup } from '@/components/interview/interview-setup';
import { InterviewSession } from '@/components/interview/interview-session';
import { InterviewResults } from '@/components/interview/interview-results';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import type { InterviewResult, QuestionAndAnswer } from '@/lib/types';

type AppState = 'idle' | 'starting' | 'interviewing' | 'analyzing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [interviewType, setInterviewType] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAndAnswer[]>([]);
  const [results, setResults] = useState<InterviewResult[]>([]);

  const { toast } = useToast();

  const handleStartInterview = async (type: string) => {
    setInterviewType(type);
    setAppState('starting');
    try {
      const generatedQuestions = await generateQuestions(type);
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setAppState('interviewing');
      } else {
        throw new Error('Failed to generate questions.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Could not start the interview. Please try again later.',
      });
      setAppState('idle');
    }
  };

  const handleSubmitAnswer = (answer: string) => {
    setAnswers((prev) => [
      ...prev,
      { question: questions[currentQuestionIndex], answer },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishInterview([
        ...answers,
        { question: questions[currentQuestionIndex], answer },
      ]);
    }
  };

  const handleFinishInterview = async (
    finalAnswers: QuestionAndAnswer[]
  ) => {
    setAppState('analyzing');
    try {
      const analysisResults = await analyzeInterview(
        interviewType,
        finalAnswers
      );
      if (analysisResults) {
        setResults(analysisResults);
        setAppState('results');
      } else {
        throw new Error('Failed to analyze interview.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Could not analyze the interview results. Please try again later.',
      });
      setAppState('interviewing');
    }
  };

  const handleRestart = () => {
    setAppState('idle');
    setInterviewType('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults([]);
  };

  const renderContent = () => {
    switch (appState) {
      case 'idle':
        return (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <InterviewSetup onStart={handleStartInterview} />
          </motion.div>
        );
      case 'starting':
        return <LoadingSpinner text="Crafting your interview questions..." />;
      case 'interviewing':
        return (
          <motion.div
            key="interviewing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <InterviewSession
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onSubmit={handleSubmitAnswer}
              interviewType={interviewType}
            />
          </motion.div>
        );
      case 'analyzing':
        return <LoadingSpinner text="Analyzing your performance..." />;
      case 'results':
        return (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <InterviewResults
              results={results}
              onRestart={handleRestart}
              interviewType={interviewType}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-headline tracking-tight">
            AI Interviewer
          </h1>
        </div>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl">
          Your personal AI-powered coach to help you ace your next interview.
        </p>
      </div>
      <div className="w-full max-w-3xl flex justify-center">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </main>
  );
}
