export interface ContactInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  contactConsent: boolean;
}

export interface SurveyAnswers {
  /** Single tap: what matters most when choosing a church */
  whatMattersMost: string;
  otherText: string;
}

export interface SurveyState {
  contact: ContactInfo;
  answers: SurveyAnswers;
  submissionDate?: string;
  submissionId?: string;
}

export interface SubmissionRecord {
  id: string;
  submissionDate: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  whatMattersMost: string;
  contactConsent: string;
  syncStatus: 'synced' | 'pending' | 'offline_saved';
}

export type SurveyStep =
  | 'intro'
  | 'poll'
  | 'success';
