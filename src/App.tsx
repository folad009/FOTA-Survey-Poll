import React, { useState, useEffect } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { IntroScreen } from './components/IntroScreen';
import { QuestionCard } from './components/QuestionCard';
import { SuccessScreen } from './components/SuccessScreen';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { AboutModal } from './components/AboutModal';
import { POLL_QUESTION } from './data/surveyQuestions';
import { ContactInfo, SurveyAnswers, SurveyStep, SurveyState } from './types/survey';
import { submitToGoogleSheets } from './services/googleSheets';

const DRAFT_STORAGE_KEY = 'church_discovery_survey_draft_v3';

const INITIAL_CONTACT: ContactInfo = {
  fullName: '',
  email: '',
  phoneNumber: '',
  contactConsent: false,
};

const INITIAL_ANSWERS: SurveyAnswers = {
  whatMattersMost: '',
  otherText: '',
  ageGroup: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<SurveyStep>('intro');
  const [contact, setContact] = useState<ContactInfo>(INITIAL_CONTACT);
  const [answers, setAnswers] = useState<SurveyAnswers>(INITIAL_ANSWERS);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionRecord, setSubmissionRecord] = useState<{ id: string; date: string } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: SurveyState = JSON.parse(saved);
        if (parsed.answers?.whatMattersMost) {
          setHasSavedDraft(true);
        }
      }
    } catch (e) {
      console.warn('Error reading saved poll draft', e);
    }
  }, []);

  useEffect(() => {
    if (currentStep === 'poll') {
      const stateToSave: SurveyState = { contact, answers };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [contact, answers, currentStep]);

  const handleResume = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: SurveyState = JSON.parse(saved);
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.answers) {
          setAnswers({
            whatMattersMost: parsed.answers.whatMattersMost || '',
            otherText: parsed.answers.otherText || '',
            ageGroup: parsed.answers.ageGroup || '',
          });
        }
        setCurrentStep('poll');
      }
    } catch {
      setCurrentStep('poll');
    }
  };

  const handleStartFresh = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setContact(INITIAL_CONTACT);
    setAnswers(INITIAL_ANSWERS);
    setHasSavedDraft(false);
    setSubmissionError(null);
    setCurrentStep('poll');
  };

  const handleSubmitPoll = async () => {
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
      timeZoneName: 'short',
    });

    try {
      await submitToGoogleSheets(contact, answers, submissionId);
      setSubmissionRecord({ id: submissionId, date: currentDateStr });
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setCurrentStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Submission failed', err);
      setSubmissionError(
        'Unable to record your answer right now. Please try again or check your connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      <ProgressBar currentStep={currentStep} />

      <main className="flex-1 flex flex-col justify-center">
        {currentStep === 'intro' && (
          <IntroScreen
            onStart={handleStartFresh}
            hasSavedData={hasSavedDraft}
            onResume={handleResume}
          />
        )}

        {currentStep === 'poll' && (
          <QuestionCard
            question={POLL_QUESTION}
            fullName={contact.fullName}
            onFullNameChange={(name) =>
              setContact((prev) => ({ ...prev, fullName: name }))
            }
            ageGroup={answers.ageGroup}
            onAgeGroupChange={(age) =>
              setAnswers((prev) => ({ ...prev, ageGroup: age }))
            }
            value={answers.whatMattersMost}
            otherText={answers.otherText}
            onChange={(val) => setAnswers(
              (prev) => ({
                ...prev,
                whatMattersMost: val,
                otherText: val === 'Other' ? prev.otherText : ''
              }))
            }
            onOtherTextChange={(text) =>
              setAnswers((prev) => ({ ...prev, otherText: text }))
            }
            onSubmit={handleSubmitPoll}
            onPrev={() => {
              setCurrentStep('intro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
          />
        )}

        {currentStep === 'success' && submissionRecord && (
          <SuccessScreen
            submissionId={submissionRecord.id}
            submissionDate={submissionRecord.date}
            onNewSurvey={() => {
              setContact(INITIAL_CONTACT);
              setAnswers(INITIAL_ANSWERS);
              setSubmissionRecord(null);
              setCurrentStep('intro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

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
      </footer>

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
