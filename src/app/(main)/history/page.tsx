'use client';
import { useEffect, useState } from 'react';
import { getInterviewHistory } from '@/app/actions';
import { useAuth } from '@/hooks/use-auth';
import type { Interview } from '@/lib/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function InterviewHistoryCard({ interview }: { interview: Interview }) {
  // Firestore timestamps need to be converted to JS Dates.
  // The 'seconds' property exists on a Firestore Timestamp object.
  const interviewDate = interview.createdAt && (interview.createdAt as any).seconds 
    ? new Date((interview.createdAt as any).seconds * 1000)
    : new Date();

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">{interview.interviewType}</CardTitle>
                <CardDescription>
                    Conducted in {interview.interviewLanguage} on {format(interviewDate, 'MMMM d, yyyy')}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {interview.summary && interview.summary.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-primary mb-2">
              Performance Summary
            </h4>
            <ul className="space-y-1 list-disc pl-5 text-foreground/90 text-sm">
                {interview.summary.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                ))}
            </ul>
          </div>
        )}
        <Accordion type="single" collapsible className="w-full">
            {interview.results.map((result, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline text-sm">
                  <span className="font-semibold mr-2">Q{index + 1}:</span>
                  {result.question}
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2 text-sm">
                      Your Answer
                    </h4>
                    <p className="text-foreground/80 whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm">
                      {result.answer}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2 text-sm">
                      AI Feedback
                    </h4>
                    <p className="text-foreground/80 whitespace-pre-wrap rounded-md bg-muted/50 p-3 border-l-4 border-primary text-sm">
                      {result.feedback}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
      </CardContent>
    </Card>
  );
}


export default function HistoryPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getInterviewHistory(user.uid)
        .then(data => {
          setInterviews(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to load interview history", error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading your interview history..." />;
  }

  return (
    <div className="w-full max-w-3xl space-y-8 mt-12">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Interview History</h1>
            <p className="text-muted-foreground mt-1">
                Review your past interviews and feedback.
            </p>
        </div>

      {interviews.length === 0 ? (
        <Card className="text-center p-8">
            <CardTitle>No interviews yet!</CardTitle>
            <CardDescription className="mt-2">
                You haven't completed any interviews. Start one to see your history here.
            </CardDescription>
            <Button asChild className="mt-4">
                <Link href="/">Start New Interview</Link>
            </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map(interview => (
            <InterviewHistoryCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
