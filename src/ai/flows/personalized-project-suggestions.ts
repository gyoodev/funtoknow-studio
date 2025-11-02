'use server';

/**
 * @fileOverview An AI agent that provides personalized game project suggestions based on user gaming habits.
 *
 * - getPersonalizedProjectSuggestions - A function that returns a list of game projects tailored to the user's preferences.
 * - PersonalizedProjectSuggestionsInput - The input type for the getPersonalizedProjectSuggestions function.
 * - PersonalizedProjectSuggestionsOutput - The return type for the getPersonalizedProjectSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProjectSuggestionsInputSchema = z.object({
  userGamingHabits: z.string().describe('A description of the user\'s gaming habits and preferences.'),
});
export type PersonalizedProjectSuggestionsInput = z.infer<typeof PersonalizedProjectSuggestionsInputSchema>;

const PersonalizedProjectSuggestionsOutputSchema = z.object({
  suggestedProjects: z.array(z.string()).describe('A list of game project titles that align with the user\'s gaming habits.'),
});
export type PersonalizedProjectSuggestionsOutput = z.infer<typeof PersonalizedProjectSuggestionsOutputSchema>;

export async function getPersonalizedProjectSuggestions(
  input: PersonalizedProjectSuggestionsInput
): Promise<PersonalizedProjectSuggestionsOutput> {
  return personalizedProjectSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProjectSuggestionsPrompt',
  input: {schema: PersonalizedProjectSuggestionsInputSchema},
  output: {schema: PersonalizedProjectSuggestionsOutputSchema},
  prompt: `Based on the following gaming habits and preferences of the user: {{{userGamingHabits}}}, suggest a list of game projects that they might enjoy.  Return ONLY the names of the projects in the suggestedProjects array.\n`,
});

const personalizedProjectSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedProjectSuggestionsFlow',
    inputSchema: PersonalizedProjectSuggestionsInputSchema,
    outputSchema: PersonalizedProjectSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
