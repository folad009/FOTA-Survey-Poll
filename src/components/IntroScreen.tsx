import React from 'react';
import { ArrowRight, Clock, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';
import { SURVEY_METADATA } from '../data/surveyQuestions';

interface IntroScreenProps {
  onStart: () => void;
  hasSavedData: boolean;
  onResume: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  hasSavedData,
  onResume
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Editorial Headline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest mb-3">
          <Compass className="w-4 h-4 text-amber-700" />
          <span>Community Discovery Survey</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-tight text-balance mb-4">
          {SURVEY_METADATA.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
          {SURVEY_METADATA.description}
        </p>

        {/* Unboxed Metadata with Typographic Separator */}
        <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm text-stone-500 mt-4">
          <span className="flex items-center gap-1.5 font-medium text-stone-700">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Estimated time: {SURVEY_METADATA.estimatedTime}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>7 Questions</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Mobile-Friendly</span>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-stone-900 mb-1">Your Voice Truly Matters</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Whether you attend weekly, are searching for a new church, or haven't stepped inside a church in years, your honest expectations guide how we welcome visitors.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-stone-900 mb-1">Respected & Secure</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            All responses are handled with high privacy and stored directly in the church Google Sheets records. Marketing communications are entirely optional.
          </p>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {hasSavedData && (
          <button
            type="button"
            onClick={onResume}
            className="w-full sm:w-auto h-12 px-6 rounded-xl border border-stone-300 bg-white text-stone-800 font-medium text-sm hover:bg-stone-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Resume Where You Left Off</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStart}
          className="w-full sm:w-auto h-12 px-8 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm shadow-md shadow-amber-900/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{hasSavedData ? 'Start New Survey' : 'Begin Survey'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
