import React, { useState } from 'react';
import { ArrowLeft, Send, Edit2, Check, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { ContactInfo, SurveyAnswers, SurveyStep } from '../types/survey';
import { checkIsDuplicateSubmission } from '../services/googleSheets';

interface ReviewScreenProps {
  contact: ContactInfo;
  answers: SurveyAnswers;
  onConsentChange: (agreed: boolean) => void;
  onNavigateToStep: (step: SurveyStep) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submissionError: string | null;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  contact,
  answers,
  onConsentChange,
  onNavigateToStep,
  onSubmit,
  isSubmitting,
  submissionError
}) => {
  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);
  const isDuplicate = checkIsDuplicateSubmission(contact.email);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    await onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Editorial Header */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
          Final Review
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Review your answers before submitting
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Please verify your details below. You can tap ‘Edit’ on any section to make changes.
        </p>
      </div>

      {/* Duplicate Submission Notice */}
      {isDuplicate && !duplicateConfirmed && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">
                A submission with this email was already received today.
              </p>
              <p className="mt-0.5 text-amber-800">
                To prevent accidental duplicates, please confirm if you would like to submit an updated response.
              </p>
              <button
                type="button"
                onClick={() => setDuplicateConfirmed(true)}
                className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-800 text-white font-medium text-xs hover:bg-amber-900 transition-colors"
              >
                Yes, submit my updated response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission error message */}
      {submissionError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Submission Notice</p>
            <p className="mt-0.5 text-red-700">{submissionError}</p>
          </div>
        </div>
      )}

      {/* Review Cards Grid */}
      <div className="space-y-3.5 mb-8">
        {/* Contact Information Card */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Contact Information
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('contact')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <span className="text-stone-400 block">Name</span>
              <span className="font-medium text-stone-900">{contact.fullName || '—'}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Email</span>
              <span className="font-medium text-stone-900 truncate block">{contact.email || '—'}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Phone / WhatsApp</span>
              <span className="font-medium text-stone-900">{contact.phoneNumber || '—'}</span>
            </div>
          </div>
        </div>

        {/* Q1: Church Journey */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              1. Current Church Journey
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('q1_journey')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm font-medium text-stone-900">
            {answers.churchJourney || <span className="text-stone-400 italic">Not answered</span>}
          </p>
        </div>

        {/* Q2: Discovery Channel */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              2. How You Discover Churches
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('q2_discovery')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          {answers.discoveryChannel.length > 0 ? (
            <ul className="text-xs sm:text-sm font-medium text-stone-900 list-disc list-inside space-y-1">
              {answers.discoveryChannel.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <span className="text-xs text-stone-400 italic">Not answered</span>
          )}
        </div>

        {/* Q3: Top 3 Expectations */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              3. Top 3 Priorities in a Church
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('q3_top3')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          {answers.top3Expectations.length > 0 ? (
            <ul className="text-xs sm:text-sm font-medium text-stone-900 list-disc list-inside space-y-1">
              {answers.top3Expectations.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <span className="text-xs text-stone-400 italic">Not answered</span>
          )}
        </div>

        {/* Q4: First Visit Comfort */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              4. Comfort on First Visit
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('q4_first_visit')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm font-medium text-stone-900">
            {answers.firstVisitComfort || <span className="text-stone-400 italic">Not answered</span>}
          </p>
        </div>

        {/* Q5: Reasons to Stay */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              5. Reasons to Keep Attending & Join
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('q5_reasons_stay')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          {answers.reasonsToStay.length > 0 ? (
            <ul className="text-xs sm:text-sm font-medium text-stone-900 list-disc list-inside space-y-1">
              {answers.reasonsToStay.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <span className="text-xs text-stone-400 italic">Not answered</span>
          )}
        </div>

        {/* Q6: Preferred Communication */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              6. Preferred Follow-up Communication
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('q6_communication')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm font-medium text-stone-900">
            {answers.preferredCommunication || <span className="text-stone-400 italic">Not answered</span>}
          </p>
        </div>

        {/* Q7: Suggestions / Feedback */}
        <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              7. Suggestions to Attract, Welcome & Retain
            </span>
            <button
              type="button"
              onClick={() => onNavigateToStep('q7_feedback')}
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
            {answers.suggestionsFeedback ? answers.suggestionsFeedback : <span className="text-stone-400 italic">No additional suggestions provided</span>}
          </p>
        </div>
      </div>

      {/* Optional Marketing Consent Checkbox */}
      <div className="mb-8 p-4 rounded-xl bg-stone-100/90 border border-stone-200">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center pt-0.5">
            <input
              type="checkbox"
              checked={contact.contactConsent}
              onChange={(e) => onConsentChange(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
              contact.contactConsent
                ? 'bg-amber-600 border-amber-600 text-white'
                : 'bg-white border-stone-300 group-hover:border-stone-400'
            }`}>
              {contact.contactConsent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
          <div className="text-xs leading-snug">
            <span className="font-semibold text-stone-900">
              I agree to receive relevant communication from the church.
            </span>
            <p className="text-stone-600 mt-0.5">
              (Optional) Not required to submit the survey. You may change your preference anytime.
            </p>
          </div>
        </label>
      </div>

      {/* Submission Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigateToStep('q7_feedback')}
          disabled={isSubmitting}
          className="h-12 px-4 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-xs sm:text-sm hover:bg-stone-50 active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || (isDuplicate && !duplicateConfirmed)}
          className="h-12 px-8 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-medium text-xs sm:text-sm shadow-md shadow-amber-900/10 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to Google Sheets...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Survey</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-[11px] text-stone-500 inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          Your feedback is securely recorded directly in the church Google Sheets records.
        </span>
      </div>
    </div>
  );
};
