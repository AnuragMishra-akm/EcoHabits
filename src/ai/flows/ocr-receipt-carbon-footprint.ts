'use server';
/**
 * @fileOverview Analyzes receipts using OCR and AI to estimate the carbon footprint of purchases.
 *
 * - analyzeReceiptForCarbonFootprint - A function that handles the receipt analysis and carbon footprint estimation.
 * - AnalyzeReceiptInput - The input type for the analyzeReceiptForCarbonFootprint function.
 * - AnalyzeReceiptOutput - The return type for the analyzeReceiptForCarbonFootprint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReceiptInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "The receipt image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnalyzeReceiptInput = z.infer<typeof AnalyzeReceiptInputSchema>;

const AnalyzeReceiptOutputSchema = z.object({
  estimatedCarbonFootprint: z
    .number()
    .describe(
      'The estimated carbon footprint of the purchases on the receipt, in kilograms of CO2e.'
    ),
  breakdown: z
    .record(z.string(), z.number())
    .describe(
      'A breakdown of the carbon footprint by item, where the key is the item name and the value is the estimated carbon footprint in kilograms of CO2e.'
    ),
});
export type AnalyzeReceiptOutput = z.infer<typeof AnalyzeReceiptOutputSchema>;

export async function analyzeReceiptForCarbonFootprint(
  input: AnalyzeReceiptInput
): Promise<AnalyzeReceiptOutput> {
  return analyzeReceiptForCarbonFootprintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReceiptPrompt',
  input: {schema: AnalyzeReceiptInputSchema},
  output: {schema: AnalyzeReceiptOutputSchema},
  prompt: `You are an AI assistant that analyzes receipts and estimates the carbon footprint of the purchases.

  Analyze the following receipt image and estimate the total carbon footprint of the purchases. Provide a breakdown of the carbon footprint by item.

  Receipt Image: {{media url=receiptDataUri}}
  `,
});

const analyzeReceiptForCarbonFootprintFlow = ai.defineFlow(
  {
    name: 'analyzeReceiptForCarbonFootprintFlow',
    inputSchema: AnalyzeReceiptInputSchema,
    outputSchema: AnalyzeReceiptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

