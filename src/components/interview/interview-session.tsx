'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Mic } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  answer: z.string().min(10, {
    message: 'Please provide a more detailed answer.',
  }),
});

interface InterviewSessionProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string) => void;
  interviewType: string;
}

export function InterviewSession({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  interviewType,
}: InterviewSessionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(((questionNumber - 1) / totalQuestions) * 100);
  }, [questionNumber, totalQuestions]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: '',
    },
  });

  useEffect(() => {
    form.reset();
    setIsLoading(false);
  }, [question, form]);

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onSubmit(values.answer);
  }

  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardTitle className="font-headline text-xl">
                {interviewType} Interview
            </CardTitle>
            <CardDescription>
                Question {questionNumber} of {totalQuestions}
            </CardDescription>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={questionNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <CardContent className="space-y-4">
                        <p className="text-lg font-semibold leading-relaxed text-foreground">
                        {question}
                        </p>
                        <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Textarea
                                placeholder="Type your answer here..."
                                className="min-h-[150px] resize-none"
                                {...field}
                                disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            'Processing...'
                        ) : (
                            <>
                            {isLastQuestion ? 'Finish & See Results' : 'Next Question'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                        </Button>
                    </CardFooter>
                </motion.div>
            </AnimatePresence>
        </form>
      </Form>
    </Card>
  );
}
