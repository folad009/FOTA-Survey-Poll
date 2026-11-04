export interface QuestionConfig {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  type: 'single';
  required: boolean;
  options: { id: string; label: string }[];
}

export const SURVEY_METADATA = {
  title: "Finding a Church – What Matters to You?",
  description: "One quick question. Tell us what matters most when choosing a church.",
  estimatedTime: "1 minute",
  totalQuestions: 1,
};

export const POLL_QUESTION: QuestionConfig = {
  id: "q_what_matters",
  number: 1,
  title: "What matters most when choosing a church?",
  subtitle: "Tap the one that matters most to you.",
  type: "single",
  required: true,
  options: [
    { id: "biblical_teaching", label: "Clear Biblical teaching" },
    { id: "worship_experience", label: "Worship experience" },
    { id: "authentic_community", label: "Warm, authentic community" },
    { id: "youth_children", label: "Strong kids & youth ministry" },
    { id: "small_groups", label: "Small groups & discipleship" },
    { id: "community_impact", label: "Serving & community impact" },
    { id: "healthy_leadership", label: "Healthy, transparent leadership" },
    { id: "spiritual_growth", label: "Spiritual growth" },
    { id: "family_friendly", label: "Family-friendly" },
    { id: "location_convenience", label: "Location convenience" },
    { id: "signs_wonder", label: "Signs and Wonders / Prophetic ministry" },
    { id: "other", label: "Other" },
  ],
};

/** @deprecated Use POLL_QUESTION — kept for any leftover imports */
export const QUESTIONS: QuestionConfig[] = [POLL_QUESTION];
