
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/lib/mail';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const replySchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

interface ReplyFormProps {
  to: string;
  onSent: () => void;
}

export function ReplyForm({ to, onSent }: ReplyFormProps) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: { message: '' },
  });

  async function onSubmit(values: z.infer<typeof replySchema>) {
    setIsSending(true);
    const result = await sendEmail({
      to,
      subject: `Re: Your message to FunToKnow`,
      replyMessage: values.message,
    });

    if (result.success) {
      toast({ title: 'Reply Sent', description: 'Your message has been sent successfully.' });
      onSent();
    } else {
      toast({
        title: 'Error Sending Reply',
        description: result.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
    setIsSending(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Reply</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your response here..." rows={8} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSending}>
            {isSending && <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />}
            Send Reply
          </Button>
        </div>
      </form>
    </Form>
  );
}
