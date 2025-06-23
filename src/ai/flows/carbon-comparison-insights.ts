'use server';

/**
 * @fileOverview A carbon comparison AI agent.
 *
 * - carbonComparisonInsights - A function that handles the carbon comparison process.
 * - CarbonComparisonInput - The input type for the carbonComparisonInsights function.
 * - CarbonComparisonOutput - The return type for the carbonComparisonInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CarbonComparisonInputSchema = z.object({
  productOneDescription: z.string().describe('The description of the first product.'),
  productTwoDescription: z.string().describe('The description of the second product.'),
  userShoppingPatterns: z.string().describe('The user shopping patterns and preferences.'),
});
export type CarbonComparisonInput = z.infer<typeof CarbonComparisonInputSchema>;

const CarbonComparisonOutputSchema = z.object({
  productOneImpact: z.string().describe('The predicted environmental impact of the first product.'),
  productTwoImpact: z.string().describe('The predicted environmental impact of the second product.'),
  recommendation: z.string().describe('A recommendation of which product is more sustainable based on the predicted impacts and user shopping patterns.'),
});
export type CarbonComparisonOutput = z.infer<typeof CarbonComparisonOutputSchema>;

export async function carbonComparisonInsights(input: CarbonComparisonInput): Promise<CarbonComparisonOutput> {
  return carbonComparisonInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'carbonComparisonPrompt',
  input: {schema: CarbonComparisonInputSchema},
  output: {schema: CarbonComparisonOutputSchema},
  prompt: `You are an AI assistant specializing in comparing the environmental impact of products and providing sustainable recommendations.

  Based on the product descriptions and the user's shopping patterns, provide an estimated environmental impact for each product and a recommendation of which product is more sustainable.

  Product One Description: {{{productOneDescription}}}
  Product Two Description: {{{productTwoDescription}}}
  User Shopping Patterns: {{{userShoppingPatterns}}}
  `,
});

const carbonComparisonInsightsFlow = ai.defineFlow(
  {
    name: 'carbonComparisonInsightsFlow',
    inputSchema: CarbonComparisonInputSchema,
    outputSchema: CarbonComparisonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
