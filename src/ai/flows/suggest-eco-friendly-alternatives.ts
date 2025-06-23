// use server'
'use server';

/**
 * @fileOverview Suggests eco-friendly alternatives based on past purchase history.
 *
 * - suggestEcoFriendlyAlternatives - A function that suggests eco-friendly alternatives.
 * - SuggestEcoFriendlyAlternativesInput - The input type for the suggestEcoFriendlyAlternatives function.
 * - SuggestEcoFriendlyAlternativesOutput - The return type for the suggestEcoFriendlyAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEcoFriendlyAlternativesInputSchema = z.object({
  purchaseHistory: z
    .string()
    .describe('A detailed history of the user past purchases.'),
});
export type SuggestEcoFriendlyAlternativesInput = z.infer<typeof SuggestEcoFriendlyAlternativesInputSchema>;

const SuggestEcoFriendlyAlternativesOutputSchema = z.object({
  alternatives: z
    .array(z.string())
    .describe('A list of eco-friendly alternatives to the user past purchases.'),
});
export type SuggestEcoFriendlyAlternativesOutput = z.infer<typeof SuggestEcoFriendlyAlternativesOutputSchema>;

export async function suggestEcoFriendlyAlternatives(
  input: SuggestEcoFriendlyAlternativesInput
): Promise<SuggestEcoFriendlyAlternativesOutput> {
  return suggestEcoFriendlyAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEcoFriendlyAlternativesPrompt',
  input: {schema: SuggestEcoFriendlyAlternativesInputSchema},
  output: {schema: SuggestEcoFriendlyAlternativesOutputSchema},
  prompt: `Given the following purchase history: {{{purchaseHistory}}}, suggest eco-friendly alternatives for each item. Provide a list of alternatives.`,
});

const suggestEcoFriendlyAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestEcoFriendlyAlternativesFlow',
    inputSchema: SuggestEcoFriendlyAlternativesInputSchema,
    outputSchema: SuggestEcoFriendlyAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
