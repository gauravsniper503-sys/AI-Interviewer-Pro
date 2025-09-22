
'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { analyzeInterview, generateQuestions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { InterviewSetup, type InterviewSettings } from '@/components/interview/interview-setup';
import { InterviewSession } from '@/components/interview/interview-session';
import { InterviewResults } from '@/components/interview/interview-results';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import type { InterviewResult, QuestionAndAnswer } from '@/lib/types';
import { Header } from '@/components/shared/header';
import { SplashScreen } from '@/components/shared/splash-screen';

type AppState = 'idle' | 'starting' | 'interviewing' | 'analyzing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [interviewType, setInterviewType] = useState('');
  const [interviewLanguage, setInterviewLanguage] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAndAnswer[]>([]);
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [summary, setSummary] = useState<string[]>([]);
  const [showSplash, setShowSplash] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartInterview = async (settings: InterviewSettings) => {
    setInterviewType(settings.interviewType);
    setInterviewLanguage(settings.interviewLanguage);
    setAppState('starting');
    try {
      const generatedQuestions = await generateQuestions(
        settings.interviewType,
        settings.interviewLanguage,
        settings.numberOfQuestions
      );
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

  const handleFinishInterview = useCallback(async (
    finalAnswers: QuestionAndAnswer[]
  ) => {
    setAppState('analyzing');
    try {
      const analysis = await analyzeInterview(
        interviewType,
        interviewLanguage,
        finalAnswers
      );
      if (analysis && analysis.results) {
        setResults(analysis.results);
        setSummary(analysis.summary);
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
  }, [interviewType, interviewLanguage, toast]);


  const handleSubmitAnswer = useCallback((answer: string) => {
    const newAnswers: QuestionAndAnswer[] = [
      ...answers,
      { question: questions[currentQuestionIndex], answer },
    ];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishInterview(newAnswers);
    }
  }, [answers, currentQuestionIndex, questions, handleFinishInterview]);


  const handleRestart = () => {
    setAppState('idle');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults([]);
    setSummary([]);
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
              summary={summary}
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
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <Header />
      <main className="flex flex-col items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl flex justify-center mt-12">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>
    </>
  );
}
