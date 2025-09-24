'use server';

/**
 * @fileOverview A multilingual voice chat AI agent.
 *
 * - multilingualVoiceChat - A function that handles the voice chat process.
 * - MultilingualVoiceChatInput - The input type for the multilingualVoiceChat function.
 * - MultilingualVoiceChatOutput - The return type for the multilingualVoiceChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualVoiceChatInputSchema = z.object({
  query: z.string().describe('The user query in any language.'),
  language: z
    .string()
    .optional()
    .default('tr')
    .describe('The language code to use for the response. Defaults to Turkish (tr).'),
});
export type MultilingualVoiceChatInput = z.infer<typeof MultilingualVoiceChatInputSchema>;

const MultilingualVoiceChatOutputSchema = z.object({
  response: z.string().describe('The response from the AI in the specified language.'),
});
export type MultilingualVoiceChatOutput = z.infer<typeof MultilingualVoiceChatOutputSchema>;

export async function multilingualVoiceChat(input: MultilingualVoiceChatInput): Promise<MultilingualVoiceChatOutput> {
  return multilingualVoiceChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualVoiceChatPrompt',
  input: {schema: MultilingualVoiceChatInputSchema},
  output: {schema: MultilingualVoiceChatOutputSchema},
  prompt: `You are a multilingual AI assistant that can converse in any language.

You will receive a query from the user, and you will respond in the language specified in the 'language' field. The language defaults to Turkish ('tr') if not specified.

Query: {{{query}}}
Language: {{{language}}}

Response:`,
});

const multilingualVoiceChatFlow = ai.defineFlow(
  {
    name: 'multilingualVoiceChatFlow',
    inputSchema: MultilingualVoiceChatInputSchema,
    outputSchema: MultilingualVoiceChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
