'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, History, LogOut, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut } from 'firebase/auth';

import { generateQuestions, analyzeAndSaveInterview } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { InterviewSetup, type InterviewSettings } from '@/components/interview/interview-setup';
import { InterviewSession } from '@/components/interview/interview-session';
import { InterviewResults } from '@/components/interview/interview-results';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import type { InterviewResult, QuestionAndAnswer } from '@/lib/types';

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

  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleStartInterview = async (settings: InterviewSettings) => {
    setInterviewType(settings.interviewType);
    setInterviewLanguage(settings.interviewLanguage);
    setAppState('starting');
    try {
      const generatedQuestions = await generateQuestions(
        settings.interviewType,
        settings.interviewLanguage,
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

  const handleSubmitAnswer = (answer: string) => {
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
  };

  const handleFinishInterview = async (
    finalAnswers: QuestionAndAnswer[]
  ) => {
    if (!user) return;
    setAppState('analyzing');
    try {
      const analysis = await analyzeAndSaveInterview(
        user.uid,
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
  };

  const handleRestart = () => {
    setAppState('idle');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults([]);
    setSummary([]);
  };
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Sparkles className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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
        return <LoadingSpinner text="Analyzing your performance and saving results..." />;
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
    <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="absolute top-4 right-4 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push('/history')}>
            <History className="mr-2" />
            Interview History
        </Button>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2" />
            Sign Out
        </Button>
      </header>
      <div className="flex flex-col items-center text-center my-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-headline tracking-tight">
            AI Interviewer
          </h1>
        </div>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl">
          Welcome, {user.displayName}! Let's ace your next interview.
        </p>
      </div>
      <div className="w-full max-w-3xl flex justify-center">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </main>
  );
}
