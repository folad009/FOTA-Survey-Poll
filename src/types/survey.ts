export interface ContactInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  contactConsent: boolean;
}

export interface SurveyAnswers {
  // Q1: Single selection
  churchJourney: string;
  // Q2: Multiple selection
  discoveryChannel: string[];
  // Q3: Multiple selection with max 3
  top3Expectations: string[];
  // Q4: Single selection
  firstVisitComfort: string;
  // Q5: Multiple selection
  reasonsToStay: string[];
  // Q6: Single selection
  preferredCommunication: string;
  // Q7: Optional open-ended response
  suggestionsFeedback: string;
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
  churchJourney: string;
  discoveryChannel: string;
  top3Expectations: string;
  firstVisitExpectations: string;
  reasonsToStay: string;
  preferredCommunication: string;
  suggestionsFeedback: string;
  contactConsent: string;
  syncStatus: 'synced' | 'pending' | 'offline_saved';
}

export type SurveyStep = 
  | 'intro'
  | 'contact'
  | 'q1_journey'
  | 'q2_discovery'
  | 'q3_top3'
  | 'q4_first_visit'
  | 'q5_reasons_stay'
  | 'q6_communication'
  | 'q7_feedback'
  | 'review'
  | 'success';
