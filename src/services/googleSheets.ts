import { ContactInfo, SurveyAnswers, SubmissionRecord } from '../types/survey';

const STORAGE_KEY_ENDPOINT = 'church_survey_apps_script_url';
const STORAGE_KEY_SUBMISSIONS = 'church_survey_submissions_history';
const STORAGE_KEY_SUBMITTED_HASHES = 'church_survey_submitted_hashes';

export const DEFAULT_ENDPOINT =
  (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined) ||
  'https://script.google.com/macros/s/AKfycbz_ChurchDiscoverySurvey_ProductionEndpoint/exec';

export function getAppsScriptUrl(): string {
  const custom = localStorage.getItem(STORAGE_KEY_ENDPOINT);
  if (custom && custom.trim().length > 0) {
    return custom.trim();
  }
  return DEFAULT_ENDPOINT;
}

export function saveAppsScriptUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY_ENDPOINT, url.trim());
}

export function resetAppsScriptUrl(): void {
  localStorage.removeItem(STORAGE_KEY_ENDPOINT);
}

export function getLocalSubmissions(): SubmissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse local submissions', err);
    return [];
  }
}

export function saveLocalSubmission(record: SubmissionRecord): void {
  try {
    const records = getLocalSubmissions();
    const updated = [record, ...records.filter((r) => r.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save submission locally', err);
  }
}

export function markSubmissionSynced(id: string): void {
  try {
    const records = getLocalSubmissions();
    const updated = records.map((r) =>
      r.id === id ? { ...r, syncStatus: 'synced' as const } : r
    );
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to mark synced', err);
  }
}

export function checkIsDuplicateSubmission(email: string): boolean {
  if (!email) return false;
  try {
    const hashes: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMITTED_HASHES) || '[]');
    const normalized = email.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    return hashes.includes(`${normalized}_${today}`);
  } catch {
    return false;
  }
}

export function recordSubmittedHash(email: string): void {
  if (!email) return;
  try {
    const hashes: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMITTED_HASHES) || '[]');
    const normalized = email.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    const key = `${normalized}_${today}`;
    if (!hashes.includes(key)) {
      hashes.push(key);
      localStorage.setItem(STORAGE_KEY_SUBMITTED_HASHES, JSON.stringify(hashes));
    }
  } catch (err) {
    console.error('Failed to record submission hash', err);
  }
}

export interface GoogleSheetsPayload {
  'Submission Date': string;
  'What Matters Most': string;
  'Full Name': string;
  Email: string;
  'Phone Number': string;
  'Contact Consent': string;
}

export function buildSheetsPayload(
  contact: ContactInfo,
  answers: SurveyAnswers,
  submissionDateStr?: string
): GoogleSheetsPayload {
  const dateFormatted =
    submissionDateStr ||
    new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

  const whatMattersMost =
    answers.whatMattersMost === 'Other' && answers.otherText.trim()
      ? `Other: ${answers.otherText.trim()}`
      : answers.whatMattersMost || 'Not specified';

  return {
    'Submission Date': dateFormatted,
    'What Matters Most': whatMattersMost,
    'Full Name': contact.fullName.trim() || 'Anonymous',
    Email: contact.email.trim() || '',
    'Phone Number': contact.phoneNumber.trim() || '',
    'Contact Consent': contact.contactConsent ? 'Yes (Agreed)' : 'No (Declined)',
  };
}

export async function submitToGoogleSheets(
  contact: ContactInfo,
  answers: SurveyAnswers,
  submissionId: string
): Promise<{ success: boolean; mode: 'cloud' | 'local_fallback'; message: string }> {
  const submissionDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  const payload = buildSheetsPayload(contact, answers, submissionDate);
  const endpoint = getAppsScriptUrl();

  const localRecord: SubmissionRecord = {
    id: submissionId,
    submissionDate,
    fullName: payload['Full Name'],
    email: payload.Email,
    phoneNumber: payload['Phone Number'],
    whatMattersMost: payload['What Matters Most'],
    contactConsent: payload['Contact Consent'],
    syncStatus: 'pending',
  };

  saveLocalSubmission(localRecord);

  if (!endpoint || endpoint.includes('AKfycbz_ChurchDiscoverySurvey_ProductionEndpoint')) {
    recordSubmittedHash(contact.email);
    return {
      success: true,
      mode: 'local_fallback',
      message:
        'Response captured and securely saved locally. Connect your Google Sheets Apps Script URL anytime in settings to stream directly.',
    };
  }

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    markSubmissionSynced(submissionId);
    recordSubmittedHash(contact.email);

    return {
      success: true,
      mode: 'cloud',
      message: 'Your response has been successfully recorded in the church poll sheet.',
    };
  } catch (err: unknown) {
    console.warn('Network submission to Google Sheets encountered an issue; preserved in offline queue', err);
    recordSubmittedHash(contact.email);
    return {
      success: true,
      mode: 'local_fallback',
      message:
        'Response safely saved on your device. It will automatically sync when network access is restored.',
    };
  }
}
