export interface CVTemplateData {
  profile: {
    fullName: string;
    professionalTitle?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    linkedinUrl?: string | null;
    websiteUrl?: string | null;
    profilePhotoUrl?: string | null;
    professionalSummary?: string | null;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    grade?: string | null;
    description?: string | null;
  }>;
  experience: Array<{
    id: string;
    company: string;
    jobTitle: string;
    location?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    isCurrent: boolean;
    description?: string | null;
    bulletPoints?: string[] | null;
  }>;
  skills: Array<{
    id: string;
    skillName: string;
    proficiencyLevel: string;
  }>;
  projects: Array<{
    id: string;
    projectName: string;
    description?: string | null;
    technologies?: string | null;
    projectUrl?: string | null;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuingOrganization?: string | null;
    issueDate?: string | null;
    expirationDate?: string | null;
    credentialId?: string | null;
    credentialUrl?: string | null;
  }>;
}

export type TemplateRenderer = (data: CVTemplateData) => string;
