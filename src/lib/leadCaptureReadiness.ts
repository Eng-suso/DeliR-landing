import { privacyNoticeReady } from '../privacy/settings';

// Lead forms are hidden until a real server destination and a publishable notice are configured.
export const privacyNoticeUrl = import.meta.env.VITE_PRIVACY_NOTICE_URL?.trim() ?? '';
const validPrivacyNoticeUrl = (privacyNoticeUrl.startsWith('/') && !privacyNoticeUrl.startsWith('//')) || privacyNoticeUrl.startsWith('https://');
const enabled = privacyNoticeReady && import.meta.env.VITE_LEAD_CAPTURE_READY === 'true' && validPrivacyNoticeUrl;

export const pilotCaptureReady = enabled && Boolean(import.meta.env.VITE_PILOT_ENDPOINT?.trim());
export const waitlistCaptureReady = enabled && import.meta.env.VITE_WAITLIST_READY === 'true'
  && Boolean(import.meta.env.VITE_WAITLIST_ENDPOINT?.trim());
// Set only after the private IONOS library and SMTP configuration are installed:
// the earlier private library rejects the notice version that announces the email.
export const welcomeMailReady = waitlistCaptureReady && import.meta.env.VITE_WELCOME_MAIL_READY === 'true';
