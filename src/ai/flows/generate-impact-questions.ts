'use server';

/**
 * @fileOverview Generates dynamic environmental impact questions.
 *
 * - generateImpactQuestions - A function that generates a set of questions.
 * - ImpactQuestionsOutput - The return type for the generateImpactQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  id: z.string().describe('A unique identifier for the question (e.g., "q1").'),
  text: z.string().describe('The question text.'),
  options: z.array(z.string()).describe('A list of possible answers.'),
});

const ImpactQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of 3 multiple-choice questions to ask the user.'),
});
export type ImpactQuestionsOutput = z.infer<typeof ImpactQuestionsOutputSchema>;

export async function generateImpactQuestions(): Promise<ImpactQuestionsOutput> {
  return generateImpactQuestionsFlow();
}

const prompt = ai.definePrompt({
  name: 'generateImpactQuestionsPrompt',
  output: {schema: ImpactQuestionsOutputSchema},
  prompt: `You are an AI assistant that creates engaging questionnaires to assess a user's environmental impact.

Generate a diverse set of 3 multiple-choice questions about daily habits that affect a person's carbon footprint. For each question, provide 4 concise answer options, ranging from least to most eco-friendly.

Example topics:
- Waste and recycling habits
- Water usage
- Transportation choices
- Dietary habits
- Energy consumption at home
- Shopping and consumerism

Ensure the questions are clear, simple, and distinct from each other.`,
});

const generateImpactQuestionsFlow = ai.defineFlow(
  {
    name: 'generateImpactQuestionsFlow',
    outputSchema: ImpactQuestionsOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
