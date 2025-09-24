'use server';

/**
 * @fileOverview An AI agent for proactively anticipating user needs and automating repetitive tasks.
 *
 * - intelligentTaskAutomation - A function that handles the task automation process.
 * - IntelligentTaskAutomationInput - The input type for the intelligentTaskAutomation function.
 * - IntelligentTaskAutomationOutput - The return type for the intelligentTaskAutomation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentTaskAutomationInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The user profile, including preferences, history, and context.'),
  currentDateTime: z
    .string()
    .describe('The current date and time.'),
});
export type IntelligentTaskAutomationInput = z.infer<typeof IntelligentTaskAutomationInputSchema>;

const IntelligentTaskAutomationOutputSchema = z.object({
  anticipatedTasks: z.array(
    z.object({
      taskDescription: z.string().describe('The description of the anticipated task.'),
      reasoning: z.string().describe('The reasoning behind anticipating this task.'),
    })
  ).describe('A list of anticipated tasks based on the user profile and current context.'),
});
export type IntelligentTaskAutomationOutput = z.infer<typeof IntelligentTaskAutomationOutputSchema>;

export async function intelligentTaskAutomation(input: IntelligentTaskAutomationInput): Promise<IntelligentTaskAutomationOutput> {
  return intelligentTaskAutomationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentTaskAutomationPrompt',
  input: {schema: IntelligentTaskAutomationInputSchema},
  output: {schema: IntelligentTaskAutomationOutputSchema},
  prompt: `You are an AI assistant designed to proactively anticipate user needs and automate repetitive tasks.

  Based on the user's profile and the current date and time, identify potential tasks that the user might need to perform.
  Provide a list of these tasks, along with a reasoning for each task.

  User Profile: {{{userProfile}}}
  Current Date and Time: {{{currentDateTime}}}

  Format your response as a JSON object with a single key "anticipatedTasks", which is an array of objects.
  Each object in the array should have two keys: "taskDescription" and "reasoning".
`,
});

const intelligentTaskAutomationFlow = ai.defineFlow(
  {
    name: 'intelligentTaskAutomationFlow',
    inputSchema: IntelligentTaskAutomationInputSchema,
    outputSchema: IntelligentTaskAutomationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
