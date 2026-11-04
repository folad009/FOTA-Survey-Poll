import React from 'react';
import { SurveyStep } from '../types/survey';

interface ProgressBarProps {
  currentStep: SurveyStep;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  if (currentStep !== 'poll') {
    return null;
  }

  return (
    <div className="w-full bg-stone-100/90 border-b border-stone-200/60 sticky top-0 z-20 backdrop-blur-xs">
      <div className="max-w-2xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
          <span className="tracking-wide text-stone-700">1 question · about 1 minute</span>
          <span className="tabular-nums font-semibold text-amber-700">Almost done</span>
        </div>
        <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-600 h-full rounded-full w-1/2 transition-all duration-300 ease-out"
            role="progressbar"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
};
