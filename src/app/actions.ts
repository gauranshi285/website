
'use server';

import { answerAdmissionQuery } from '@/ai/flows/answer-admission-queries';
import { getStartedGuideFromPrompt } from '@/ai/flows/get-started-guide-from-prompt';
import { courses, contacts, generalInfo, faqs } from '@/lib/data';
import { z } from 'zod';

const getContextString = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  // Provide the full context to the AI for better responses.
  const courseDetails = `Courses Information: ${JSON.stringify(courses)}`;
  const feesInformation = `General Fees Information: ${generalInfo.fees}. Bus Fees: ${JSON.stringify(generalInfo.busFees)}`;
  const eligibilityCriteria = `General Eligibility Criteria: ${generalInfo.eligibility}`;
  const applicationInfo = `Application Process: ${generalInfo.applicationSteps.join(', ')}. Deadlines: Fall - ${generalInfo.applicationDeadlines.fall}, Spring - ${generalInfo.applicationDeadlines.spring}. Required Documents: ${generalInfo.requiredDocuments.join(', ')}.`;
  const scholarshipInfo = `The university offers merit-based and need-based scholarships. Students can also apply for various government scholarships. For more details, please check the university's official website or contact the financial aid office.`;
  const facilitiesInformation = `Campus Facilities: ${generalInfo.facilities}`;
  const contactInformation = `Contact Information: ${JSON.stringify(contacts)}`;
  const faqContext = `Frequently Asked Questions: ${JSON.stringify(faqs)}`;
  
  // Combine all context into a single string for the prompt.
  const combinedContext = [
    courseDetails,
    feesInformation,
    eligibilityCriteria,
    applicationInfo,
    scholarshipInfo,
    facilitiesInformation,
    contactInformation,
    faqContext,
    `Entrance Exams: ${generalInfo.entranceExams}`,
    `Application Status Check: ${generalInfo.applicationStatus}`,
    `International Admissions: ${generalInfo.internationalAdmissions}`,
    `Placements: ${generalInfo.placements}`,
  ].join('\n\n');

  return {
    // Pass the combined context through one of the properties.
    // The prompt is designed to read from all properties, so we can condense it.
    courseDetails: combinedContext,
    feesInformation: undefined,
    eligibilityCriteria: undefined,
    applicationInfo: undefined,
    scholarshipInfo: undefined,
    facilitiesInformation: undefined,
    contactInformation: undefined,
  };
};

const AskAISchema = z.object({
  query: z.string().min(1, { message: 'Query cannot be empty.' }).max(500, { message: 'Query is too long.' }),
  language: z.enum(['en', 'hi']),
});

export async function askAI(prevState: any, formData: FormData): Promise<{ answer?: string; error?: string }> {
  const validation = AskAISchema.safeParse({
    query: formData.get('query'),
    language: formData.get('language'),
  });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { query, language } = validation.data;

  try {
    const context = getContextString(query);
    const result = await answerAdmissionQuery({
      query: query,
      language: language,
      ...context,
    });
    return { answer: result.answer };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while processing your request. Please try again.' };
  }
}

const GetStartedSchema = z.string().min(3, { message: 'Please enter your study interest.' }).max(100, { message: 'Your input is too long.' });

export async function getStarted(prevState: any, formData: FormData): Promise<{ guide?: string; error?: string }> {
  const studyInterest = formData.get('studyInterest');
  const validation = GetStartedSchema.safeParse(studyInterest);

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const validInterest = validation.data;

  try {
    const courseDetails = `Available courses: ${courses.map(c => `${c.title} - ${c.description}`).join('; ')}`;
    const result = await getStartedGuideFromPrompt({
      studyInterest: validInterest,
      universityCourses: courseDetails,
      admissionRequirements: generalInfo.eligibility,
      financialAidOptions: 'Information about financial aid is available on the university website and can be discussed with our financial aid advisors.',
      studentLifeInfo: generalInfo.facilities,
    });
    return { guide: result.guide };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while generating your guide. Please try again.' };
  }
}

    