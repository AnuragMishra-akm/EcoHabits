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
  answers: z
    .record(z.string(), z.string())
    .describe('A JSON object where keys are the full question texts and values are the user-selected answers.'),
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
  input: {schema: z.object({ answersJson: z.string() })},
  output: {schema: ImpactScoreOutputSchema},
  prompt: `You are an AI assistant that assesses a user's environmental impact based on their lifestyle choices. Calculate an impact score from 0 to 1000, where 1000 represents a highly sustainable lifestyle.

Analyze the user's answers provided in the following JSON object of question-answer pairs:
{{{answersJson}}}

Based on these answers, provide a numerical 'impactScore' and actionable 'feedback' for the user. A user with highly eco-friendly answers should get a score close to 1000. A user with less sustainable choices should get a lower score. The feedback should be encouraging and provide 1-2 specific, actionable tips for improvement based on their lowest-scoring answers.`,
});

const calculateImpactScoreFlow = ai.defineFlow(
  {
    name: 'calculateImpactScoreFlow',
    inputSchema: ImpactScoreInputSchema,
    outputSchema: ImpactScoreOutputSchema,
  },
  async ({ answers }) => {
    const answersJson = JSON.stringify(answers, null, 2);
    const {output} = await prompt({ answersJson });
    return output!;
  }
);
