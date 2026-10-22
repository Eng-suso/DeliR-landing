import { welcomeMailReady } from './leadCaptureReadiness';

// The 2026-10-22 notice adds the welcome email with the product walkthrough.
export const interestNoticeVersion = welcomeMailReady ? 'product-interest-2026-10-22' : 'product-interest-2026-10-12';
export const interestPractices = ['independent', 'consulting-team', 'in-house', 'other'] as const;
export const interestTimings = ['active', 'next-90-days', 'exploring'] as const;
export type WaitlistFields = { email: string; practice: string; timing: string };
export type WaitlistErrors = Partial<Record<keyof WaitlistFields, string>>;
export function validateWaitlist(fields: WaitlistFields): WaitlistErrors {
  const errors: WaitlistErrors = {};
  const email = fields.email.trim();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'email';
  if (!interestPractices.some(value => value === fields.practice)) errors.practice = 'practice';
  if (fields.timing && !interestTimings.some(value => value === fields.timing)) errors.timing = 'timing';
  return errors;
}
export async function submitWaitlist(fields: WaitlistFields): Promise<void> {
  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT?.trim();
  if (!endpoint) throw new Error('submission_unavailable');
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: fields.email.trim().toLowerCase(), practice: fields.practice,
      timing: fields.timing, source: 'delir-product-interest', noticeVersion: interestNoticeVersion }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('submission_failed');
  const acknowledgement: unknown = await response.json();
  if (!acknowledgement || typeof acknowledgement !== 'object' || !('accepted' in acknowledgement) || acknowledgement.accepted !== true) throw new Error('submission_failed');
}
