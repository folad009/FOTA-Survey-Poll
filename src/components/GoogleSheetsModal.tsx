import React, { useState } from 'react';
import { X, Check, Copy, FileSpreadsheet, ExternalLink, Download, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getAppsScriptUrl, saveAppsScriptUrl, resetAppsScriptUrl, getLocalSubmissions } from '../services/googleSheets';
import { APPS_SCRIPT_CODE } from '../services/appsScriptTemplate';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState(getAppsScriptUrl());
  const [copiedScript, setCopiedScript] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'endpoint' | 'script' | 'records'>('endpoint');

  if (!isOpen) return null;

  const localSubmissions = getLocalSubmissions();

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppsScriptUrl(url);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    resetAppsScriptUrl();
    setUrl(getAppsScriptUrl());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleExportCsv = () => {
    if (localSubmissions.length === 0) return;
    const headers = [
      "Submission Date",
      "Full Name",
      "Age Group",
      "What Matters Most",
      "Email",
      "Phone Number",
      "Contact Consent"
    ];

    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

    const rows = localSubmissions.map(s => [
      escapeCsv(s.submissionDate),
      escapeCsv(s.fullName),
      escapeCsv(s.ageGroup),
      escapeCsv(s.whatMattersMost),
      escapeCsv(s.email),
      escapeCsv(s.phoneNumber),
      escapeCsv(s.contactConsent)
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `church_poll_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheets-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 id="sheets-modal-title" className="text-base font-semibold text-stone-900">
                Google Sheets Integration
              </h2>
              <p className="text-xs text-stone-500">Google Apps Script Web App connector & response logs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-5 bg-white text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('endpoint')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors ${
              activeTab === 'endpoint'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Webhook Endpoint
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors ${
              activeTab === 'script'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Apps Script Code (Code.gs)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('records')}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'records'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Saved Records</span>
            <span className="w-4 h-4 rounded-full bg-stone-100 text-[10px] text-stone-600 flex items-center justify-center tabular-nums">
              {localSubmissions.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'endpoint' && (
            <div className="space-y-4">
              <p className="text-stone-600 leading-relaxed">
                Poll responses are dispatched directly to your Google Sheet’s “Responses” tab via Google Apps Script.
                Configure your Web App execution URL below:
              </p>

              <form onSubmit={handleSaveUrl} className="space-y-3">
                <div>
                  <label htmlFor="endpointUrl" className="block font-semibold text-stone-700 uppercase tracking-wider text-[11px] mb-1">
                    Google Apps Script Web App URL
                  </label>
                  <input
                    id="endpointUrl"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full h-11 px-3 text-xs font-mono rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">
                    The URL generated when deploying your Apps Script project as a Web App (ends in <code className="font-mono">/exec</code>).
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-lg bg-amber-700 text-white font-medium hover:bg-amber-800 transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Endpoint</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-9 px-3 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Google Sheets endpoint updated successfully!</span>
                  </div>
                )}
              </form>

              <div className="pt-2">
                <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px] block mb-2">
                  Mapped Fields in Responses Sheet (7 Columns):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-mono text-stone-700">
                  <div>1. Submission Date</div>
                  <div>2. Full Name</div>
                  <div>3. Age Group</div>
                  <div>4. What Matters Most</div>
                  <div>5. Email</div>
                  <div>6. Phone Number</div>
                  <div>7. Contact Consent</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-stone-600 leading-relaxed">
                  Copy this Apps Script code directly into your Google Sheet under <strong>Extensions &gt; Apps Script</strong>:
                </p>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-1.5 font-medium shrink-0 ml-2"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied!' : 'Copy Code.gs'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-stone-900 text-stone-100 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto selection:bg-amber-600">
                  {APPS_SCRIPT_CODE}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 space-y-1">
                <p className="font-semibold">Quick 30-Second Setup:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-amber-800">
                  <li>In your Google Sheet, click <em>Extensions &gt; Apps Script</em>.</li>
                  <li>Paste the code above into the script editor.</li>
                  <li>Click <em>Deploy &gt; New deployment &gt; Select type: Web app</em>.</li>
                  <li>Set <em>Execute as: "Me"</em> and <em>Who has access: "Anyone"</em>.</li>
                  <li>Click Deploy and copy the Web App URL into the Webhook Endpoint tab!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-stone-600">
                  Submissions captured and mirrored locally ({localSubmissions.length} total):
                </p>
                {localSubmissions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>

              {localSubmissions.length === 0 ? (
                <div className="p-8 text-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  No responses recorded on this device yet. Completed poll submissions will appear here.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {localSubmissions.map((rec) => (
                    <div key={rec.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900">{rec.fullName || 'Anonymous'}</span>
                        <span className="text-stone-400 font-mono text-[10px]">{rec.submissionDate}</span>
                      </div>
                      <div className="text-stone-500 text-[11px] pt-1">
                        Age group:{' '}
                        <span className="text-stone-700 font-medium">{rec.ageGroup || '—'}</span>
                        {' · '}
                        What matters most:{' '}
                        <span className="text-stone-700 font-medium">{rec.whatMattersMost || '—'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-200 text-stone-800 font-medium hover:bg-stone-300 transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
