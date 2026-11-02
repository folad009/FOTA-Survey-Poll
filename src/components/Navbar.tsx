import React from 'react';
import { Church, FileSpreadsheet, RotateCcw, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onReset: () => void;
  showReset: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onOpenAbout,
  onReset,
  showReset
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark with church iconography */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-600/10 text-amber-700 flex items-center justify-center border border-amber-600/20 shadow-xs">
            <Church className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-semibold text-stone-900 tracking-tight text-base sm:text-lg whitespace-nowrap">
            Church Discovery Survey
          </span>
        </div>

        {/* Zone 2: Navigation / contextual links */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-stone-600">
          <button
            type="button"
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-stone-200/60 hover:text-stone-900 transition-colors whitespace-nowrap"
            title="About this survey"
          >
            <HelpCircle className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">About</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-stone-200/60 hover:text-stone-900 transition-colors whitespace-nowrap"
            title="Google Sheets Integration"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Sheets Setup</span>
          </button>

          {showReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors whitespace-nowrap"
              title="Reset survey answers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
