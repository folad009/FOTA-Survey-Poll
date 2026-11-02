import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { ContactInfo } from '../types/survey';

interface ContactStepProps {
  contact: ContactInfo;
  onChange: (updated: Partial<ContactInfo>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ContactStep: React.FC<ContactStepProps> = ({
  contact,
  onChange,
  onNext,
  onPrev
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation rules
  const isNameValid = contact.fullName.trim().length >= 2;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(contact.email.trim());

  // Phone validation: allows digits, +, spaces, dashes, parentheses; requires at least 7 digits
  const phoneDigitsOnly = contact.phoneNumber.replace(/\D/g, '');
  const isPhoneValid = phoneDigitsOnly.length >= 7 && phoneDigitsOnly.length <= 15;

  const canProceed = isNameValid && isEmailValid && isPhoneValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phoneNumber: true });
    if (canProceed) {
      onNext();
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
          Contact Details
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Let’s start with your contact details
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
          We use this to verify responses and follow up according to your preferences. All fields marked with <span className="text-red-500 font-semibold">*</span> are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="fullName"
              type="text"
              required
              value={contact.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
              placeholder="e.g. Sarah Jenkins"
              className={`w-full h-12 pl-10 pr-4 text-sm rounded-xl border bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors ${
                touched.fullName && !isNameValid
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'
              }`}
            />
          </div>
          {touched.fullName && !isNameValid && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Please enter your full name (at least 2 characters).</span>
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={contact.email}
              onChange={(e) => onChange({ email: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              placeholder="e.g. sarah.jenkins@example.com"
              className={`w-full h-12 pl-10 pr-4 text-sm rounded-xl border bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors ${
                touched.email && !isEmailValid
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'
              }`}
            />
          </div>
          {touched.email && !isEmailValid && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Please enter a valid email address (e.g. name@domain.com).</span>
            </p>
          )}
        </div>

        {/* Phone / WhatsApp */}
        <div>
          <label htmlFor="phoneNumber" className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
            Phone Number / WhatsApp <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="phoneNumber"
              type="tel"
              required
              value={contact.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, phoneNumber: true }))}
              placeholder="e.g. +234 803 123 4567"
              className={`w-full h-12 pl-10 pr-4 text-sm rounded-xl border bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none transition-colors ${
                touched.phoneNumber && !isPhoneValid
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'
              }`}
            />
          </div>
          {touched.phoneNumber && !isPhoneValid ? (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Please enter a valid phone or WhatsApp number with at least 7 digits.</span>
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-stone-500">
              Include country code if outside your local region.
            </p>
          )}
        </div>

        {/* Optional Communication Consent */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200/90 bg-white/70 hover:bg-white cursor-pointer transition-colors group">
            <div className="relative flex items-center pt-0.5">
              <input
                type="checkbox"
                checked={contact.contactConsent}
                onChange={(e) => onChange({ contactConsent: e.target.checked })}
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
            <div className="text-xs text-stone-700 leading-snug">
              <span className="font-medium text-stone-900">
                I agree to receive relevant communication from the church.
              </span>
              <p className="text-stone-500 mt-0.5">
                (Optional) You can participate without agreeing to FOTA Church.
              </p>
            </div>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="h-12 px-4 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-xs sm:text-sm hover:bg-stone-50 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Intro</span>
          </button>

          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs sm:text-sm shadow-sm shadow-amber-900/10 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>Next: Question 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
