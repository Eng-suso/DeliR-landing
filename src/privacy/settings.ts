// These are release gates, not a claim that a privacy review has happened.
export const privacyNoticeReady = import.meta.env.VITE_PRIVACY_NOTICE_READY === 'true';
export const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? '';
export const analyticsAvailable = privacyNoticeReady
  && import.meta.env.VITE_ANALYTICS_READY === 'true'
  && /^G-[A-Z0-9]+$/.test(measurementId);
export const consentKey = 'delir-consent-v1';
export type Consent = { version: 1; analytics: boolean; savedAt: number; expiresAt: number };

export function readConsent(now = Date.now()): Consent | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(consentKey) ?? 'null');
    if (!value || typeof value !== 'object') return null;
    const record = value as Partial<Consent>;
    return record.version === 1 && typeof record.analytics === 'boolean'
      && typeof record.savedAt === 'number' && Number.isFinite(record.savedAt)
      && typeof record.expiresAt === 'number' && Number.isFinite(record.expiresAt)
      && record.savedAt <= now && record.expiresAt > now
      && record.expiresAt <= record.savedAt + 185 * 86400000 ? record as Consent : null;
  } catch { return null; }
}

export function saveConsent(analytics: boolean, now = Date.now()): Consent {
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + 6);
  const record: Consent = { version: 1, analytics, savedAt: now, expiresAt: expires.getTime() };
  try { localStorage.setItem(consentKey, JSON.stringify(record)); } catch { /* Session-only choice. */ }
  return record;
}
