import React from 'react';
import { X, Church, Compass, Heart, ShieldCheck, Clock } from 'lucide-react';
import { SURVEY_METADATA } from '../data/surveyQuestions';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
      >
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <Church className="w-5 h-5 text-amber-700" />
            <h2 id="about-modal-title" className="text-base font-semibold text-stone-900">
              About This Survey
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-600 leading-relaxed">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm mb-1">Finding a Church – What Matters to You?</h3>
            <p>
              We want to understand what people look for when choosing a church and what makes them feel welcomed, connected and spiritually fulfilled.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Est. Time: {SURVEY_METADATA.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-600 shrink-0" />
              <span>1 Quick Question</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 mb-1">Why your perspective counts:</h4>
            <p>
              A single tap tells us what people look for most when choosing a church—so welcoming teams can focus on what truly matters.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              We ask for your name, gender, and age group so responses can be understood by generation. Email and phone are not required.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors text-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
