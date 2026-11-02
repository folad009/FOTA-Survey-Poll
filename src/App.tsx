import React, { useState, useEffect } from 'react';
// import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { IntroScreen } from './components/IntroScreen';
import { ContactStep } from './components/ContactStep';
import { QuestionCard } from './components/QuestionCard';
import { ReviewScreen } from './components/ReviewScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { AboutModal } from './components/AboutModal';
import { QUESTIONS } from './data/surveyQuestions';
import { ContactInfo, SurveyAnswers, SurveyStep, SurveyState } from './types/survey';
import { submitToGoogleSheets } from './services/googleSheets';

const DRAFT_STORAGE_KEY = 'church_discovery_survey_draft_v2';

const INITIAL_CONTACT: ContactInfo = {
  fullName: '',
  email: '',
  phoneNumber: '',
  contactConsent: false,
};

const INITIAL_ANSWERS: SurveyAnswers = {
  churchJourney: '',
  discoveryChannel: [],
  top3Expectations: [],
  firstVisitComfort: '',
  reasonsToStay: [],
  preferredCommunication: '',
  suggestionsFeedback: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<SurveyStep>('intro');
  const [contact, setContact] = useState<ContactInfo>(INITIAL_CONTACT);
  const [answers, setAnswers] = useState<SurveyAnswers>(INITIAL_ANSWERS);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Modals & Submission states
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionRecord, setSubmissionRecord] = useState<{ id: string; date: string } | null>(null);

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: SurveyState = JSON.parse(saved);
        if (parsed.contact?.fullName || parsed.answers?.churchJourney) {
          setHasSavedDraft(true);
        }
      }
    } catch (e) {
      console.warn('Error reading saved survey draft', e);
    }
  }, []);

  // Save draft whenever answers or contact changes
  useEffect(() => {
    if (currentStep !== 'intro' && currentStep !== 'success') {
      const stateToSave: SurveyState = { contact, answers };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [contact, answers, currentStep]);

  // Handle Resume draft
  const handleResume = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: SurveyState = JSON.parse(saved);
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.answers) setAnswers(parsed.answers);
        setCurrentStep('contact');
      }
    } catch {
      setCurrentStep('contact');
    }
  };

  // Handle Start fresh
  const handleStartFresh = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setContact(INITIAL_CONTACT);
    setAnswers(INITIAL_ANSWERS);
    setHasSavedDraft(false);
    setCurrentStep('contact');
  };

  // Full reset
  const handleResetSurvey = () => {
    if (window.confirm("Are you sure you want to restart the survey? All current answers will be cleared.")) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setContact(INITIAL_CONTACT);
      setAnswers(INITIAL_ANSWERS);
      setHasSavedDraft(false);
      setCurrentStep('intro');
      setSubmissionError(null);
    }
  };

  // Step ordering array
  const stepSequence: SurveyStep[] = [
    'intro',
    'contact',
    'q1_journey',
    'q2_discovery',
    'q3_top3',
    'q4_first_visit',
    'q5_reasons_stay',
    'q6_communication',
    'q7_feedback',
    'review',
    'success'
  ];

  const currentStepIndex = stepSequence.indexOf(currentStep);

  // Compute progress percentage
  // Steps 1 to 9 (contact through review) = 9 actionable steps
  const progressPercent = currentStepIndex > 0 && currentStepIndex < 10
    ? (currentStepIndex / 9) * 100
    : currentStep === 'success' ? 100 : 0;

  // Step display label
  const getStepLabel = (): string => {
    switch (currentStep) {
      case 'contact':
        return 'Step 1 of 9 · Contact Details';
      case 'q1_journey':
        return 'Question 1 of 7 · Church Journey';
      case 'q2_discovery':
        return 'Question 2 of 7 · Discovery Channel';
      case 'q3_top3':
        return 'Question 3 of 7 · Top 3 Priorities';
      case 'q4_first_visit':
        return 'Question 4 of 7 · First Visit Comfort';
      case 'q5_reasons_stay':
        return 'Question 5 of 7 · Reasons to Stay';
      case 'q6_communication':
        return 'Question 6 of 7 · Preferred Communication';
      case 'q7_feedback':
        return 'Question 7 of 7 · Feedback & Suggestions';
      case 'review':
        return 'Step 9 of 9 · Review & Submit';
      default:
        return '';
    }
  };

  // Update handlers
  const handleContactChange = (updated: Partial<ContactInfo>) => {
    setContact(prev => ({ ...prev, ...updated }));
  };

  const handleAnswerChange = (field: keyof SurveyAnswers, val: string | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: val }));
  };

  // Submit survey handler
  const handleSubmitSurvey = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    const submissionId = 'SUB-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const currentDateStr = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    try {
      const res = await submitToGoogleSheets(contact, answers, submissionId);
      setSubmissionRecord({ id: submissionId, date: currentDateStr });
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setCurrentStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Submission failed', err);
      setSubmissionError(
        'Unable to record submission right now. Your answers are kept safe. Please try again or check connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const q1 = QUESTIONS.find(q => q.id === 'q1_journey')!;
  const q2 = QUESTIONS.find(q => q.id === 'q2_discovery')!;
  const q3 = QUESTIONS.find(q => q.id === 'q3_top3')!;
  const q4 = QUESTIONS.find(q => q.id === 'q4_first_visit')!;
  const q5 = QUESTIONS.find(q => q.id === 'q5_reasons_stay')!;
  const q6 = QUESTIONS.find(q => q.id === 'q6_communication')!;
  const q7 = QUESTIONS.find(q => q.id === 'q7_feedback')!;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      {/* Top Bar following Top Bar Contract 
      <Navbar
        onOpenSettings={() => setIsSheetsModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onReset={handleResetSurvey}
        showReset={currentStep !== 'intro' && currentStep !== 'success'}
      />*/}

      {/* Progress Bar Indicator */}
      <ProgressBar
        currentStep={currentStep}
        progressPercent={progressPercent}
        stepLabel={getStepLabel()}
      />

      {/* Main Survey Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {currentStep === 'intro' && (
          <IntroScreen
            onStart={handleStartFresh}
            hasSavedData={hasSavedDraft}
            onResume={handleResume}
          />
        )}

        {currentStep === 'contact' && (
          <ContactStep
            contact={contact}
            onChange={handleContactChange}
            onNext={() => {
              setCurrentStep('q1_journey');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('intro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentStep === 'q1_journey' && (
          <QuestionCard
            question={q1}
            value={answers.churchJourney}
            onChange={(val) => handleAnswerChange('churchJourney', val)}
            onNext={() => {
              setCurrentStep('q2_discovery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLastQuestion={false}
          />
        )}

        {currentStep === 'q2_discovery' && (
          <QuestionCard
            question={q2}
            value={answers.discoveryChannel}
            onChange={(val) => handleAnswerChange('discoveryChannel', val)}
            onNext={() => {
              setCurrentStep('q3_top3');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('q1_journey');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLastQuestion={false}
          />
        )}

        {currentStep === 'q3_top3' && (
          <QuestionCard
            question={q3}
            value={answers.top3Expectations}
            onChange={(val) => handleAnswerChange('top3Expectations', val)}
            onNext={() => {
              setCurrentStep('q4_first_visit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('q2_discovery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLastQuestion={false}
          />
        )}

        {currentStep === 'q4_first_visit' && (
          <QuestionCard
            question={q4}
            value={answers.firstVisitComfort}
            onChange={(val) => handleAnswerChange('firstVisitComfort', val)}
            onNext={() => {
              setCurrentStep('q5_reasons_stay');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('q3_top3');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLastQuestion={false}
          />
        )}

        {currentStep === 'q5_reasons_stay' && (
          <QuestionCard
            question={q5}
            value={answers.reasonsToStay}
            onChange={(val) => handleAnswerChange('reasonsToStay', val)}
            onNext={() => {
              setCurrentStep('q6_communication');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('q4_first_visit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLastQuestion={false}
          />
        )}

        {currentStep === 'q6_communication' && (
          <QuestionCard
            question={q6}
            value={answers.preferredCommunication}
            onChange={(val) => handleAnswerChange('preferredCommunication', val)}
            onNext={() => {
              setCurrentStep('q7_feedback');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('q5_reasons_stay');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLastQuestion={false}
          />
        )}

        {currentStep === 'q7_feedback' && (
          <QuestionCard
            question={q7}
            value={answers.suggestionsFeedback}
            onChange={(val) => handleAnswerChange('suggestionsFeedback', val)}
            onNext={() => {
              setCurrentStep('review');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrev={() => {
              setCurrentStep('q6_communication');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isLastQuestion={true}
          />
        )}

        {currentStep === 'review' && (
          <ReviewScreen
            contact={contact}
            answers={answers}
            onConsentChange={(consent) => handleContactChange({ contactConsent: consent })}
            onNavigateToStep={(step) => {
              setCurrentStep(step);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSubmit={handleSubmitSurvey}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
          />
        )}

        {currentStep === 'success' && submissionRecord && (
          <SuccessScreen
            contact={contact}
            submissionId={submissionRecord.id}
            submissionDate={submissionRecord.date}
            onNewSurvey={() => {
              setContact(INITIAL_CONTACT);
              setAnswers(INITIAL_ANSWERS);
              setCurrentStep('intro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Subtle Footer with clean unboxed metadata 
      <footer className="py-5 px-4 text-center border-t border-stone-200/60 bg-stone-100/50 text-xs text-stone-500">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Finding a Church – What Matters to You?</span>
          <div className="flex items-center gap-2">
            <span>Confidential & Respected</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsSheetsModalOpen(true)}
              className="text-stone-600 hover:text-amber-800 underline transition-colors"
            >
              Google Sheets Integration
            </button>
          </div>
        </div>
      </footer>*/}

      {/* Modals */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
