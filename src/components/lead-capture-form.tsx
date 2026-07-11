
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useState } from 'react';

const leadCaptureSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: 'Please enter a valid 10-digit phone number.',
  }),
});

type LeadCaptureFormValues = z.infer<typeof leadCaptureSchema>;

interface LeadCaptureFormProps {
  onSubmit: (data: LeadCaptureFormValues) => void;
}

export function LeadCaptureForm({ onSubmit }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LeadCaptureFormValues>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  const handleFormSubmit = (values: LeadCaptureFormValues) => {
    setIsSubmitting(true);
    onSubmit(values);
  };

  return (
    <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
      <CardHeader className='p-0 pb-4'>
        <CardTitle className="text-lg">Just one moment...</CardTitle>
        <CardDescription>
          To provide you with the best assistance, could you please share your contact details?
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Please wait...' : 'Continue'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
