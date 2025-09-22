
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Mic, MicOff } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] =
    useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: '',
    },
  });

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const currentAnswer = form.getValues('answer');
        form.setValue('answer', currentAnswer + finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: `An error occurred: ${event.error}. Please try again.`,
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [form, toast]);

  useEffect(() => {
    setProgress(((questionNumber - 1) / totalQuestions) * 100);
  }, [questionNumber, totalQuestions]);

  useEffect(() => {
    form.reset();
    setIsLoading(false);
  }, [question, form]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Could not start recording', error);
        toast({
          variant: 'destructive',
          title: 'Could Not Start Recording',
          description: 'Please ensure your microphone is enabled and try again.',
        });
        setIsRecording(false);
      }
    }
  };


  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
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
                                <div className="relative">
                                    <Textarea
                                    placeholder="Type or speak your answer here..."
                                    className="min-h-[150px] resize-none pr-12"
                                    {...field}
                                    disabled={isLoading}
                                    />
                                    {isSpeechRecognitionSupported && (
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant={isRecording ? 'destructive' : 'ghost'}
                                        className="absolute right-2 top-2"
                                        onClick={toggleRecording}
                                        disabled={isLoading}
                                    >
                                        {isRecording ? <MicOff /> : <Mic />}
                                        <span className="sr-only">
                                        {isRecording ? 'Stop recording' : 'Record answer'}
                                        </span>
                                    </Button>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         {!isSpeechRecognitionSupported && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                Speech recognition is not supported in your browser. Please
                                use a modern browser like Chrome for this feature.
                                </AlertDescription>
                            </Alert>
                        )}
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
