
'use server';

/**
 * @fileOverview A flow that answers admission-related queries using AI.
 * 
 * - answerAdmissionQuery - A function that answers admission queries.
 * - AnswerAdmissionQueryInput - The input type for the answerAdmissionQuery function.
 * - AnswerAdmissionQueryOutput - The return type for the answerAdmissionQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerAdmissionQueryInputSchema = z.object({
  query: z.string().describe('The admission-related query from the student.'),
  language: z.enum(['en', 'hi']).describe('The language for the response.'),
  courseDetails: z.string().optional().describe('A comprehensive JSON string containing all information about courses, fees, eligibility, application processes, scholarships, facilities, contacts, and FAQs.'),
  feesInformation: z.string().optional().describe('Legacy field, data is in courseDetails.'),
  eligibilityCriteria: z.string().optional().describe('Legacy field, data is in courseDetails.'),
  applicationInfo: z.string().optional().describe('Legacy field, data is in courseDetails.'),
  scholarshipInfo: z.string().optional().describe('Legacy field, data is in courseDetails.'),
  facilitiesInformation: z.string().optional().describe('Legacy field, data is in courseDetails.'),
  contactInformation: z.string().optional().describe('Legacy field, data is in courseDetails.'),
});
export type AnswerAdmissionQueryInput = z.infer<typeof AnswerAdmissionQueryInputSchema>;

const AnswerAdmissionQueryOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the admission query.'),
});
export type AnswerAdmissionQueryOutput = z.infer<typeof AnswerAdmissionQueryOutputSchema>;

export async function answerAdmissionQuery(input: AnswerAdmissionQueryInput): Promise<AnswerAdmissionQueryOutput> {
  const query = input.query.toLowerCase().trim();
  const language = input.language || 'en';
  
  if (query === 'course' || query === 'courses' || query === 'पाठ्यक्रम') {
    return { answer: 'ACTION_SELECT_COURSE_INFO' };
  }

  if (query === 'hi' || query === 'hello' || query === 'नमस्ते' || query === 'namaste') {
    return { 
        answer: language === 'en' 
            ? "Hello! I am the university's AI admission counselor. How can I assist you today? You can ask me about courses, fees, eligibility, and more."
            : "नमस्ते! मैं विश्वविद्यालय का एआई एडमिशन काउंसलर हूं। मैं आज आपकी कैसे मदद कर सकता हूं? आप मुझसे पाठ्यक्रम, शुल्क, पात्रता आदि के बारे में पूछ सकते हैं।"
    };
  }

  if (query === 'fees' || query === 'fee' || query === 'शुल्क') {
    return { answer: 'ACTION_SELECT_FEE_TYPE' };
  }

  const isCourseQuery = query.includes('course') || query.includes('program') || query.includes('पाठ्यक्रम');
  const hasSpecificCourse = /b\.a\.|bfa|bjmc|ba llb|b\.sc\.|b\.tech|be|bca|mbbs|bds|b\.pharm|b\.com|bba|bhm|b\.des/i.test(query);

  if (isCourseQuery && !hasSpecificCourse && query !== 'course' && query !== 'courses' && query !== 'पाठ्यक्रम') {
      // Handles queries like "tell me about courses" but not just "courses"
      return { answer: 'ACTION_SELECT_COURSE_INFO' };
  }
  
  return answerAdmissionQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAdmissionQueryPrompt',
  input: {schema: AnswerAdmissionQueryInputSchema},
  output: {schema: AnswerAdmissionQueryOutputSchema},
  prompt: `You are a highly knowledgeable and friendly AI admission counselor for a university. Your primary role is to provide accurate and helpful information to prospective students based *exclusively* on the comprehensive university data provided below.

  **Response Language:** You MUST respond in the language specified: {{{language}}}. If the language is 'hi', you must respond in Hindi. If it is 'en', you must respond in English.

  **University Knowledge Base (Source of Truth):**
  {{{courseDetails}}}
  
  **Student's Query:**
  "{{{query}}}"

  **Your Task:**
  1.  **Analyze the Query:** Carefully understand what the student is asking.
  2.  **Consult the Knowledge Base:** Find the most relevant information within the provided "University Knowledge Base" to answer the query. You have access to all courses, fees, FAQs, placement data, contacts, and more.
  3.  **Synthesize a Concise Answer:** Formulate a clear, concise, and friendly answer using *only* the information from the knowledge base, in the required language ({{language}}).
  4.  **Be Direct:** Answer the question directly. If asked about fees for a specific course, provide that fee structure. If asked about eligibility, state the requirements clearly.
  5.  **Handle Missing Information:** If the information needed to answer the query is not in the knowledge base, you MUST state that the information is not available and recommend contacting the university's admission office for the most accurate details. **Do not invent or assume any information.**
  6.  **Maintain Persona:** Always be helpful, polite, and professional, representing the university in the best possible light.
  `,
});

const answerAdmissionQueryFlow = ai.defineFlow(
  {
    name: 'answerAdmissionQueryFlow',
    inputSchema: AnswerAdmissionQueryInputSchema,
    outputSchema: AnswerAdmissionQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    