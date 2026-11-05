import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { SURVEY_METADATA } from '../data/surveyQuestions';

interface IntroScreenProps {
  onStart: () => void;
  hasSavedData: boolean;
  onResume: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  hasSavedData,
  onResume,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-widest mb-3">
          <img src="/images/fota-logo.png" alt="FOTA Church" width={150} height={150} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-tight text-balance mb-4">
          {SURVEY_METADATA.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto">
          {SURVEY_METADATA.description}
        </p>

        <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm text-stone-500 mt-4">
          <span className="flex items-center gap-1.5 font-medium text-stone-700">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            {SURVEY_METADATA.estimatedTime}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>1 question</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Name & age</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <h2 className="text-sm font-semibold text-stone-900 mb-1">Your Voice Truly Matters</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            One tap tells us what people look for most when choosing a church—and how we can welcome them better.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <h2 className="text-sm font-semibold text-stone-900 mb-1">Fast & Private</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Add your name and age group, then one tap. Your answer is recorded in the church Google Sheet.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {hasSavedData && (
          <button
            type="button"
            onClick={onResume}
            className="w-full sm:w-auto h-12 px-6 rounded-xl border border-stone-300 bg-white text-stone-800 font-medium text-sm hover:bg-stone-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Resume Poll</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStart}
          className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm shadow-md shadow-blue-900/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{hasSavedData ? 'Start Fresh' : 'Answer in 1 Minute'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
