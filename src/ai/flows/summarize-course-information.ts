'use server';

/**
 * @fileOverview Summarizes course information to provide prospective students with key details.
 *
 * - summarizeCourseInformation - A function that summarizes course information.
 * - SummarizeCourseInformationInput - The input type for the summarizeCourseInformation function.
 * - SummarizeCourseInformationOutput - The return type for the summarizeCourseInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCourseInformationInputSchema = z.object({
  courseDescription: z
    .string()
    .describe('The detailed description of the course.'),
});
export type SummarizeCourseInformationInput = z.infer<
  typeof SummarizeCourseInformationInputSchema
>;

const SummarizeCourseInformationOutputSchema = z.object({
  coreContent: z.string().describe('A summary of the core content of the course, as a single paragraph.'),
  prerequisites: z
    .string()
    .describe('The prerequisites required to take the course, as a single paragraph.'),
  potentialCareerPaths: z
    .string()
    .describe('Potential career paths for students who complete the course, as a single paragraph.'),
});
export type SummarizeCourseInformationOutput = z.infer<
  typeof SummarizeCourseInformationOutputSchema
>;

export async function summarizeCourseInformation(
  input: SummarizeCourseInformationInput
): Promise<SummarizeCourseInformationOutput> {
  return summarizeCourseInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCourseInformationPrompt',
  input: {schema: SummarizeCourseInformationInputSchema},
  output: {schema: SummarizeCourseInformationOutputSchema},
  prompt: `You are an expert academic advisor. Please provide a summary of the core content, prerequisites, and potential career paths for the following course description. **You must use a single paragraph for each section.**

Course Description: {{{courseDescription}}}

Format your response as follows:

Core Content: [summary of core content as a single paragraph]
Prerequisites: [list of prerequisites as a single paragraph]
Potential Career Paths: [list of potential career paths as a single paragraph]`,
});

const summarizeCourseInformationFlow = ai.defineFlow(
  {
    name: 'summarizeCourseInformationFlow',
    inputSchema: SummarizeCourseInformationInputSchema,
    outputSchema: SummarizeCourseInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
