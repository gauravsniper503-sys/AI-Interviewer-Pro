'use client';

import { format } from 'date-fns';
import { MessageSquare, Calendar } from 'lucide-react';

import type { Interview } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InterviewHistoryCardProps {
  interview: Interview;
}

export function InterviewHistoryCard({ interview }: InterviewHistoryCardProps) {
  const interviewDate = new Date(interview.createdAt as any);

  return (
    <Card className="flex flex-col h-full shadow-lg border-primary/20 hover:border-primary/40 transition-all">
      <CardHeader>
        <CardTitle className="font-headline">{interview.interviewType}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <Calendar className="w-4 h-4"/> 
            {format(interviewDate, 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible>
          <AccordionItem value="summary">
            <AccordionTrigger>View Summary</AccordionTrigger>
            <AccordionContent>
                <ul className="space-y-2 list-disc pl-5 text-sm text-foreground/90">
                    {interview.summary.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                    ))}
                </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="details">
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent>
              {interview.results.map((result, index) => (
                 <div key={index} className="mb-4">
                    <p className="font-semibold text-primary">{`Q: ${result.question}`}</p>
                    <p className="text-sm text-foreground/80 mt-1">{`A: ${result.answer}`}</p>
                 </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap pt-4">
        <Badge variant="secondary">{interview.interviewLanguage}</Badge>
        <Badge variant="secondary">
          <MessageSquare className="mr-1.5" />
          {interview.results.length} Questions
        </Badge>
      </CardFooter>
    </Card>
  );
}
