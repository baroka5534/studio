'use server';
/**
 * @fileOverview A document analysis AI agent.
 *
 * - analyzeDocuments - A function that handles the document analysis process.
 * - AnalyzeDocumentsInput - The input type for the analyzeDocuments function.
 * - AnalyzeDocumentsOutput - The return type for the analyzeDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDocumentsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (PDF, JPG, HTML), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDocumentsInput = z.infer<typeof AnalyzeDocumentsInputSchema>;

const AnalyzeDocumentsOutputSchema = z.object({
  abstractSummary: z.string().describe('An abstract summary of the document.'),
  concreteSummary: z.string().describe('A concrete summary of the document.'),
});
export type AnalyzeDocumentsOutput = z.infer<typeof AnalyzeDocumentsOutputSchema>;

export async function analyzeDocuments(input: AnalyzeDocumentsInput): Promise<AnalyzeDocumentsOutput> {
  return analyzeDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentsPrompt',
  input: {schema: AnalyzeDocumentsInputSchema},
  output: {schema: AnalyzeDocumentsOutputSchema},
  prompt: `You are an expert document analyst.

You will analyze the document and provide both an abstract summary and a concrete summary.

Document: {{media url=documentDataUri}}`,
});

const analyzeDocumentsFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentsFlow',
    inputSchema: AnalyzeDocumentsInputSchema,
    outputSchema: AnalyzeDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
