import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Info } from 'lucide-react';
import { QuestionConfig } from '../data/surveyQuestions';

interface QuestionCardProps {
  question: QuestionConfig;
  value: string | string[];
  onChange: (val: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  onNext,
  onPrev,
  isLastQuestion
}) => {
  const [showError, setShowError] = useState(false);

  // Determine if valid
  const isAnswered = (): boolean => {
    if (!question.required) return true;
    if (question.type === 'single') {
      return typeof value === 'string' && value.trim().length > 0;
    }
    if (question.type === 'multiple') {
      return Array.isArray(value) && value.length > 0;
    }
    if (question.type === 'text') {
      return true; // Q7 is optional
    }
    return false;
  };

  const handleNextClick = () => {
    if (isAnswered()) {
      setShowError(false);
      onNext();
    } else {
      setShowError(true);
    }
  };

  const handleSingleSelect = (optionLabel: string) => {
    setShowError(false);
    onChange(optionLabel);
  };

  const handleMultipleSelect = (optionLabel: string) => {
    setShowError(false);
    const current = Array.isArray(value) ? [...value] : [];
    const exists = current.includes(optionLabel);

    if (exists) {
      onChange(current.filter(item => item !== optionLabel));
    } else {
      if (question.maxSelections && current.length >= question.maxSelections) {
        // Enforce max selections
        return;
      }
      onChange([...current, optionLabel]);
    }
  };

  const currentCount = Array.isArray(value) ? value.length : 0;
  const isMaxReached = question.maxSelections ? currentCount >= question.maxSelections : false;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
          <span className="uppercase tracking-wider font-semibold text-amber-800">
            Question {question.number} of 7
          </span>
          {question.type === 'multiple' && question.maxSelections && (
            <span className={`font-semibold tabular-nums ${isMaxReached ? 'text-amber-700' : 'text-stone-500'}`}>
              {currentCount} of {question.maxSelections} selected
            </span>
          )}
          {question.type === 'multiple' && !question.maxSelections && (
            <span className="text-stone-500 font-medium">Multiple selection</span>
          )}
          {question.type === 'single' && (
            <span className="text-stone-500 font-medium">Single selection</span>
          )}
          {question.type === 'text' && (
            <span className="text-stone-500 font-medium">Optional</span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
          {question.title}
        </h2>

        {question.subtitle && (
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Render Single Selection */}
      {question.type === 'single' && question.options && (
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = value === opt.label;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSingleSelect(opt.label)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 shadow-xs ring-1 ring-amber-600'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium leading-snug ${isSelected ? 'text-stone-900 font-semibold' : 'text-stone-800'}`}>
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      {opt.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Render Multiple Selection */}
      {question.type === 'multiple' && question.options && (
        <div className="space-y-2.5">
          {question.maxSelections && isMaxReached && (
            <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-700" />
              <span>You have chosen {question.maxSelections} options. Deselect one to pick another.</span>
            </div>
          )}

          {question.options.map((opt) => {
            const isSelected = Array.isArray(value) && value.includes(opt.label);
            const isDisabled = !isSelected && isMaxReached;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isDisabled}
                onClick={() => handleMultipleSelect(opt.label)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 shadow-xs ring-1 ring-amber-600'
                    : isDisabled
                    ? 'border-stone-100 bg-stone-50/60 opacity-50 cursor-not-allowed'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium leading-snug ${isSelected ? 'text-stone-900 font-semibold' : 'text-stone-800'}`}>
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      {opt.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Render Open-ended Text */}
      {question.type === 'text' && (
        <div className="space-y-3">
          <textarea
            rows={5}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => {
              setShowError(false);
              onChange(e.target.value);
            }}
            placeholder={question.placeholder}
            className="w-full p-4 text-sm rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-colors"
          />
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Optional response</span>
            <span>{typeof value === 'string' ? value.length : 0} characters</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {showError && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>Please select an option before proceeding.</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="h-12 px-4 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-xs sm:text-sm hover:bg-stone-50 active:scale-[0.98] transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleNextClick}
          className="h-12 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs sm:text-sm shadow-sm shadow-amber-900/10 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <span>{isLastQuestion ? 'Review Answers' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
