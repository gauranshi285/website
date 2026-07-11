
export type Course = {
  id: string;
  title: string;
  department: string;
  code: string;
  description:string;
  eligibility: string;
  duration: string;
  credits: number;
  feeStructure?: {
    [key: string]: number;
  };
  placementInfo?: string;
};

export type Contact = {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  avatarId: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type GeneralInfo = {
  applicationDeadlines: {
    fall: string;
    spring: string;
  };
  requiredDocuments: string[];
  applicationSteps: string[];
  fees: string;
  busFees: {
    [route: string]: number;
  };
  eligibility: string;
  facilities: string;
  entranceExams: string;
  applicationStatus: string;
  internationalAdmissions: string;
  placements?: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};
