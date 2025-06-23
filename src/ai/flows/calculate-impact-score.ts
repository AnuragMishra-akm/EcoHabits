'use server';

/**
 * @fileOverview Calculates a user's environmental impact score based on a questionnaire.
 *
 * - calculateImpactScore - A function that calculates the score.
 * - ImpactScoreInput - The input type for the calculateImpactScore function.
 * - ImpactScoreOutput - The return type for the calculateImpactScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImpactScoreInputSchema = z.object({
  commute: z.string().describe('Primary mode of commute.'),
  diet: z.string().describe('Frequency of eating red meat.'),
  energy: z.string().describe('Household energy source.'),
});
export type ImpactScoreInput = z.infer<typeof ImpactScoreInputSchema>;

const ImpactScoreOutputSchema = z.object({
  impactScore: z
    .number()
    .describe('A numerical score from 0 to 1000 representing the user environmental impact, where 1000 is the best possible score.'),
  feedback: z
    .string()
    .describe('Personalized feedback and suggestions for improvement based on the user answers.'),
});
export type ImpactScoreOutput = z.infer<typeof ImpactScoreOutputSchema>;

export async function calculateImpactScore(input: ImpactScoreInput): Promise<ImpactScoreOutput> {
  return calculateImpactScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'impactScorePrompt',
  input: {schema: ImpactScoreInputSchema},
  output: {schema: ImpactScoreOutputSchema},
  prompt: `You are an AI assistant that assesses a user's environmental impact based on their lifestyle choices. Calculate an impact score from 0 to 1000, where 1000 represents a highly sustainable lifestyle.

Analyze the following user answers:
- Primary Commute: {{{commute}}}
- Red Meat Consumption: {{{diet}}}
- Home Energy Source: {{{energy}}}

Based on these answers, provide a numerical 'impactScore' and actionable 'feedback' for the user. A user who bikes, never eats red meat, and uses 100% renewable energy should get a score close to 1000. A user who drives a gas car, eats red meat daily, and uses non-renewable energy should get a low score.`,
});

const calculateImpactScoreFlow = ai.defineFlow(
  {
    name: 'calculateImpactScoreFlow',
    inputSchema: ImpactScoreInputSchema,
    outputSchema: ImpactScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
