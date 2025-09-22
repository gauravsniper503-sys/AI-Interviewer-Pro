
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  interviewType: z.string().min(2, {
    message: 'Please select or enter a valid role.',
  }),
  customInterviewType: z.string().optional(),
  interviewLanguage: z.string().min(2, {
    message: 'Please select a language.',
  }),
  numberOfQuestions: z.string().min(1, {
    message: 'Please select the number of questions.',
  }),
}).refine(data => {
    if (data.interviewType === 'other' && (!data.customInterviewType || data.customInterviewType.length < 2)) {
      return false;
    }
    return true;
}, {
    message: "Please enter a custom interview type.",
    path: ["customInterviewType"],
});

export type InterviewSettings = {
  interviewType: string;
  interviewLanguage: string;
  numberOfQuestions: number;
};

interface InterviewSetupProps {
  onStart: (settings: InterviewSettings) => void;
}

const interviewTypes = [
    { value: 'software-engineer', label: 'Software Engineer' },
    { value: 'data-analyst', label: 'Data Analyst' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'ux-designer', label: 'UX Designer' },
    { value: 'other', label: 'Other' },
];

const languages = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Marathi', label: 'Marathi' },
];

const questionCounts = Array.from({ length: 6 }, (_, i) => i + 5); // 5 to 10

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewType: '',
      customInterviewType: '',
      interviewLanguage: 'English',
      numberOfQuestions: '8',
    },
  });

  const watchInterviewType = form.watch('interviewType');

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const finalInterviewType = values.interviewType === 'other' 
        ? values.customInterviewType! 
        : interviewTypes.find(t => t.value === values.interviewType)?.label!;
    
    onStart({
        interviewType: finalInterviewType,
        interviewLanguage: values.interviewLanguage,
        numberOfQuestions: parseInt(values.numberOfQuestions, 10),
    });
  }

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Let's Get Started
            </CardTitle>
            <CardDescription>
              What kind of interview would you like to practice for?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="interviewType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an interview type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {interviewTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchInterviewType === 'other' && (
                <FormField
                control={form.control}
                name="customInterviewType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Custom Interview Type</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="e.g., 10th Standard Student"
                        {...field}
                        disabled={isLoading}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormField
              control={form.control}
              name="interviewLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {languages.map(lang => (
                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the number of questions" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {questionCounts.map(count => (
                                <SelectItem key={count} value={String(count)}>{count}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                'Preparing...'
              ) : (
                <>
                  Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
