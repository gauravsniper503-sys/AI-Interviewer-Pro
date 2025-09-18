'use client';

import { RefreshCw } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { InterviewResult } from '@/lib/types';

interface InterviewResultsProps {
  results: InterviewResult[];
  onRestart: () => void;
  interviewType: string;
}

export function InterviewResults({
  results,
  onRestart,
  interviewType,
}: InterviewResultsProps) {
  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline">Interview Complete!</h2>
        <p className="text-muted-foreground mt-1">
          Here is the feedback for your {interviewType} interview.
        </p>
      </div>

      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline">Detailed Feedback</CardTitle>
          <CardDescription>
            Review each question, your answer, and the AI's feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {results.map((result, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold mr-2">Q{index + 1}:</span>
                  {result.question}
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Your Answer
                    </h4>
                    <p className="text-foreground/80 whitespace-pre-wrap rounded-md bg-muted/50 p-3">
                      {result.answer}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      AI Feedback
                    </h4>
                    <p className="text-foreground/80 whitespace-pre-wrap rounded-md bg-muted/50 p-3 border-l-4 border-primary">
                      {result.feedback}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onRestart}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Interview
        </Button>
      </div>
    </div>
  );
}
