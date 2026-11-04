import React from 'react';
import { CheckCircle2, RotateCcw, Heart } from 'lucide-react';

interface SuccessScreenProps {
  submissionId: string;
  submissionDate: string;
  onNewSurvey: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  submissionId,
  submissionDate,
  onNewSurvey,
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block mb-1">
          Answer received
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
          Thank you for sharing what matters to you
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed max-w-md mx-auto">
          Your quick response helps us shape a warmer, more welcoming church experience.
        </p>

        <p className="text-[11px] text-stone-400 mt-3 tabular-nums">
          {submissionDate} · {submissionId.slice(0, 8)}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 mb-8 flex items-start gap-3">
        <Heart className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          We appreciate you taking a minute to guide our community. Every answer counts.
        </p>
      </div>

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
