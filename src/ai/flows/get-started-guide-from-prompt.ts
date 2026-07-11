'use server';

/**
 * @fileOverview Generates a personalized, step-by-step guide for prospective students based on their interests, leveraging university-specific information.
 *
 * - getStartedGuideFromPrompt - A function that generates a personalized guide.
 * - GetStartedGuideFromPromptInput - The input type for the getStartedGuideFromPrompt function.
 * - GetStartedGuideFromPromptOutput - The return type for the getStartedGuideFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetStartedGuideFromPromptInputSchema = z.object({
  studyInterest: z
    .string()
    .describe("The student's area of interest (e.g., 'Computer Science', 'Biology')."),
  universityCourses: z.string().optional().describe('Course catalog information.'),
  admissionRequirements: z.string().optional().describe('Admission requirements information.'),
  financialAidOptions: z.string().optional().describe('Financial aid options information.'),
  studentLifeInfo: z.string().optional().describe('Information about student life.'),
});
export type GetStartedGuideFromPromptInput = z.infer<
  typeof GetStartedGuideFromPromptInputSchema
>;

const GetStartedGuideFromPromptOutputSchema = z.object({
  guide: z.string().describe('A step-by-step guide tailored to the student, formatted as a single paragraph.'),
});
export type GetStartedGuideFromPromptOutput = z.infer<
  typeof GetStartedGuideFromPromptOutputSchema
>;

export async function getStartedGuideFromPrompt(
  input: GetStartedGuideFromPromptInput
): Promise<GetStartedGuideFromPromptOutput> {
  return getStartedGuideFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getStartedGuideFromPromptPrompt',
  input: {schema: GetStartedGuideFromPromptInputSchema},
  output: {schema: GetStartedGuideFromPromptOutputSchema},
  prompt: `You are an AI assistant creating a short, personalized guide for a student.

  Based on their interest, create a simple, one-paragraph guide.

  Student's Interest: {{{studyInterest}}}
  University Courses: {{{universityCourses}}}
  Admission Requirements: {{{admissionRequirements}}}
  Financial Aid Options: {{{financialAidOptions}}}
  Student Life Information: {{{studentLifeInfo}}}

  The guide should be a single, concise paragraph. Recommend one or two relevant courses and briefly mention the next steps for admission.
  `,
});

const getStartedGuideFromPromptFlow = ai.defineFlow(
  {
    name: 'getStartedGuideFromPromptFlow',
    inputSchema: GetStartedGuideFromPromptInputSchema,
    outputSchema: GetStartedGuideFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
