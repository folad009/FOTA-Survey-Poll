import React, { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { AGE_GROUPS, GENDERS, QuestionConfig } from '../data/surveyQuestions';

interface QuestionCardProps {
  question: QuestionConfig;
  fullName: string;
  onFullNameChange: (name: string) => void;
  gender: string;
  onGenderChange: (gender: string) => void;
  ageGroup: string;
  onAgeGroupChange: (age: string) => void;
  value: string;
  otherText: string;
  onChange: (val: string) => void;
  onOtherTextChange: (text: string) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
  submissionError?: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  fullName,
  onFullNameChange,
  gender,
  onGenderChange,
  ageGroup,
  onAgeGroupChange,
  value,
  otherText,
  onChange,
  onOtherTextChange,
  onSubmit,
  onPrev,
  isSubmitting = false,
  submissionError = null,
}) => {
  const [showError, setShowError] = useState(false);
  const isOtherSelected = value === 'Other';

  const missingFields = (): string[] => {
    const missing: string[] = [];
    if (!fullName.trim()) missing.push('your name');
    if (!gender.trim()) missing.push('a gender');
    if (!ageGroup.trim()) missing.push('an age group');
    if (question.required && !value.trim()) missing.push('an option');
    if (isOtherSelected && !otherText.trim()) missing.push('your answer for Other');
    return missing;
  };

  const handleSubmitClick = () => {
    if (missingFields().length === 0) {
      setShowError(false);
      onSubmit();
    } else {
      setShowError(true);
    }
  };

  const handleSingleSelect = (optionLabel: string) => {
    setShowError(false);
    onChange(optionLabel);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
          <span className="uppercase tracking-wider font-semibold text-amber-800">
            Quick poll · ~1 minute
          </span>
          <span className="text-stone-500 font-medium">Single selection</span>
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

      <div className="mb-6 space-y-4">
        <div>
          <label htmlFor="respondent-name" className="block text-xs font-medium text-stone-700 mb-1.5">
            Your name
          </label>
          <input
            id="respondent-name"
            type="text"
            value={fullName}
            onChange={(e) => {
              setShowError(false);
              onFullNameChange(e.target.value);
            }}
            placeholder="First and last name"
            disabled={isSubmitting}
            autoComplete="name"
            className="w-full h-11 px-3 text-sm rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-colors disabled:opacity-50"
          />
        </div>

        <div>
          <p className="text-xs font-medium text-stone-700 mb-1.5">Gender</p>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((option) => {
              const isSelected = gender === option.label;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setShowError(false);
                    onGenderChange(option.label);
                  }}
                  disabled={isSubmitting}
                  className={`h-9 px-3 rounded-full border text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-stone-700 mb-1.5">Age group</p>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map((group) => {
              const isSelected = ageGroup === group.label;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setShowError(false);
                    onAgeGroupChange(group.label);
                  }}
                  disabled={isSubmitting}
                  className={`h-9 px-3 rounded-full border text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt) => {
          const isSelected = value === opt.label;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSingleSelect(opt.label)}
              disabled={isSubmitting}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-center gap-3.5 ${
                isSelected
                  ? 'border-amber-600 bg-amber-50/60 shadow-xs ring-1 ring-amber-600'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div
                className={`flex-1 text-sm font-medium leading-snug ${
                  isSelected ? 'text-stone-900 font-semibold' : 'text-stone-800'
                }`}
              >
                {opt.label}
              </div>
              {isSelected && <Check className="w-4 h-4 text-amber-700 shrink-0" />}
            </button>
          );
        })}
      </div>

      {isOtherSelected && (
        <div className="mt-3">
          <label
            htmlFor="other-option"
            className="block text-xs font-medium text-stone-700 mb-1.5"
          >
            Please specify
          </label>
          <input
            id="other-option"
            type="text"
            value={otherText}
            onChange={(e) => {
              setShowError(false);
              onOtherTextChange(e.target.value);
            }}
            placeholder="Type your answer…"
            disabled={isSubmitting}
            autoFocus
            className="w-full h-11 px-3 text-sm rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-colors disabled:opacity-50"
          />
        </div>
      )}

      {showError && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>Please add {missingFields().join(', ')} before submitting.</span>
        </div>
      )}

      {submissionError && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{submissionError}</span>
        </div>
      )}

      <div className="pt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="h-12 px-4 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-xs sm:text-sm hover:bg-stone-50 active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
          className="h-12 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs sm:text-sm shadow-sm shadow-amber-900/10 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting…</span>
            </>
          ) : (
            <span>Submit Answer</span>
          )}
        </button>
      </div>
    </div>
  );
};
