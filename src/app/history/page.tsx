'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { History, Home, Loader2, Sparkles } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { getInterviewHistory } from '@/app/actions';
import type { Interview } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { InterviewHistoryCard } from '@/components/interview/interview-history-card';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getInterviewHistory(user.uid)
        .then(setInterviews)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Sparkles className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-headline tracking-tight">
                Interview History
            </h1>
        </div>
        <Link href="/" passHref>
            <Button variant="outline">
                <Home className="mr-2" />
                Back to Home
            </Button>
        </Link>
      </header>
      
      <div className="w-full max-w-5xl">
        {loading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        ) : interviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview) => (
                    <InterviewHistoryCard key={interview.id} interview={interview} />
                ))}
            </div>
        ) : (
            <Card className="text-center py-12 shadow-lg border-dashed">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">No interviews yet!</CardTitle>
                    <CardDescription>
                        Complete an interview to see your history here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/" passHref>
                        <Button>
                            <Sparkles className="mr-2"/>
                            Start a New Interview
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )}
      </div>
    </main>
  );
}
