'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, updateDoc } from 'firebase/firestore';

import { useFirestore, useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { getPersonalizedProjectSuggestions } from '@/ai/flows/personalized-project-suggestions';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faMagic, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  gamingHabits: z.string().min(10, {
    message: 'Please describe your habits in at least 10 characters.',
  }),
});

export function ProjectSuggester() {
  const { user } = useUser();
  const { userProfile } = useUserProfile(user?.uid);
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gamingHabits: userProfile?.gamingHabits || '',
    },
  });

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, { gamingHabits: values.gamingHabits });
      toast({ title: 'Success', description: 'Your gaming habits have been saved.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to save your preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetSuggestions = async () => {
    const habits = form.getValues('gamingHabits');
    if (!habits || habits.length < 10) {
      form.trigger('gamingHabits');
      return;
    }
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const result = await getPersonalizedProjectSuggestions({ userGamingHabits: habits });
      setSuggestions(result.suggestedProjects);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Suggestion Error',
        description: 'Could not generate suggestions at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <FormField
            control={form.control}
            name="gamingHabits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Gaming Habits</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I love open-world RPGs like Skyrim, competitive shooters, and relaxing puzzle games..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={isSaving || isSuggesting}>
              {isSaving && <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />}
              Save Preferences
            </Button>
            <Button type="button" onClick={handleGetSuggestions} disabled={isSaving || isSuggesting} variant="secondary">
              {isSuggesting ? (
                <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faMagic} className="mr-2 h-4 w-4" />
              )}
              Get AI Suggestions
            </Button>
          </div>
        </form>
      </Form>

      {isSuggesting && (
        <div className="text-center text-muted-foreground">
          <FontAwesomeIcon icon={faSpinner} className="mx-auto h-8 w-8 animate-spin" />
          <p>Our AI is thinking...</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="h-6 w-6 text-primary" />
              Here are some project ideas for you!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
