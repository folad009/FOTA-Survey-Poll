import React from 'react';
import { CheckCircle2, RotateCcw, Church, Heart, Calendar, Mail, User } from 'lucide-react';
import { ContactInfo } from '../types/survey';

interface SuccessScreenProps {
  contact: ContactInfo;
  submissionId: string;
  submissionDate: string;
  onNewSurvey: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  contact,
  submissionId,
  submissionDate,
  onNewSurvey
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Success Badge & Headline */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block mb-1">
          Submission Received
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
          Thank you for sharing what matters to you
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed max-w-md mx-auto">
          Your feedback is deeply appreciated and plays a meaningful role in shaping a warm, hospitable, and spiritually grounded church environment.
        </p>
      </div>

      {/* Confirmation Receipt Box 
      <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs mb-8 space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Submission Receipt
          </span>
          <span className="text-xs font-mono font-medium text-stone-500 tabular-nums">
            ID: {submissionId.slice(0, 8)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-stone-600">Respondent:</span>
            <span className="font-medium text-stone-900">{contact.fullName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-stone-600">Email:</span>
            <span className="font-medium text-stone-900 truncate">{contact.email}</span>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-stone-600">Recorded:</span>
            <span className="font-medium text-stone-900">{submissionDate}</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-100">
          <span>Destination: Responses Google Sheet</span>
          <span className="text-emerald-700 font-medium">Synced</span>
        </div>
      </div>*/}

      {/* Warm Note */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 mb-8 flex items-start gap-3">
        <Heart className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          {contact.contactConsent
            ? "Thank you for opting in to church communications. We look forward to staying warmly connected with you."
            : "We respect your communication preferences. Thank you once again for taking time to guide our community."}
        </p>
      </div>

      {/* Action */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNewSurvey}
          className="w-full sm:w-auto h-12 px-6 rounded-xl border border-stone-300 bg-white text-stone-800 font-medium text-xs sm:text-sm hover:bg-stone-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Submit Another Response</span>
        </button>
      </div>
    </div>
  );
};
