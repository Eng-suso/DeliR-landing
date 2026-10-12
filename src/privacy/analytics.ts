import { analyticsAvailable, measurementId, readConsent } from './settings';

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}
const analyticsWindow = () => window;
let started = false;
let previousPage = '';
const denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };

// No Google request, script, preconnect or queue before an affirmative choice.
export function startAnalytics(consented: boolean) {
  if (!analyticsAvailable || !consented || !readConsent()?.analytics || started) return;
  const target = analyticsWindow();
  target[`ga-disable-${measurementId}`] = false;
  target.dataLayer = [];
  target.gtag = (...args) => { target.dataLayer?.push(args); };
  target.gtag('consent', 'default', denied);
  target.gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
  target.gtag('js', new Date());
  target.gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 180 * 86400,
    cookie_update: false,
    cookie_path: '/',
    page_location: 'https://delir.it/',
    page_referrer: '',
  });
  const script = document.createElement('script');
  script.id = 'delir-ga4';
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
  started = true;
}

export function stopAnalytics() {
  const target = analyticsWindow();
  target[`ga-disable-${measurementId}`] = true;
  target.dataLayer = [];
  target.gtag = undefined;
  document.getElementById('delir-ga4')?.remove();
  // Remove the first-party root-path cookies used by this integration.
  const host = location.hostname;
  const domains = ['', host, ...host.split('.').map((_, index, parts) => `.${parts.slice(index).join('.')}`)];
  for (const part of document.cookie.split(';')) {
    const name = part.trim().split('=')[0];
    if (name !== '_ga' && !name.startsWith('_ga_')) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}; SameSite=Lax`;
    }
  }
  const wasStarted = started;
  started = false;
  previousPage = '';
  return wasStarted;
}

export function trackPage(pathname: string, language: 'it' | 'en', consented: boolean) {
  if (!analyticsAvailable || !consented || !started || !readConsent()?.analytics) return;
  // Allowlist routes and language; never send arbitrary URL parameters, hash,
  // form content, titles, or a referrer query that might contain personal data.
  if (!['/', '/pilot', '/waitlist', '/privacy', '/security-data', '/comparison-sources'].includes(pathname)) return;
  const page = `${pathname}${language === 'en' ? '?lang=en' : ''}`;
  if (page === previousPage) return;
  const context = {
    send_to: measurementId,
    page_location: `https://delir.it${page}`,
    page_referrer: '',
    page_title: pathname === '/' ? 'DeliR' : `DeliR ${pathname.slice(1)}`,
    language,
  };
  analyticsWindow().gtag?.('config', measurementId, { ...context, send_page_view: false });
  analyticsWindow().gtag?.('event', 'page_view', context);
  previousPage = page;
}

export type PilotEvent = 'pilot_cta_clicked' | 'pilot_form_started' | 'pilot_submit_attempt' | 'pilot_submit_failed' | 'generate_lead';
const pilotEvents: readonly string[] = ['pilot_cta_clicked', 'pilot_form_started', 'pilot_submit_attempt', 'pilot_submit_failed', 'generate_lead'];
const pilotSections: readonly string[] = ['hero', 'pilot-summary', 'caso', 'confronto', 'fiducia', 'pilot', 'early-access', 'navigation', 'application', 'other'];

// Deliberately excludes fields, error messages, identifiers and arbitrary URLs.
export function trackPilotEvent(event: PilotEvent, language: 'it' | 'en', section = 'application'): boolean {
  if (!analyticsAvailable || !started || !readConsent()?.analytics || !pilotEvents.includes(event)) return false;
  analyticsWindow().gtag?.('event', event, {
    send_to: measurementId, language: language === 'en' ? 'en' : 'it',
    form_name: 'pilot_application',
    section: pilotSections.includes(section) ? section : 'other',
    page_location: `https://delir.it${event === 'pilot_cta_clicked' ? '/' : '/pilot'}${language === 'en' ? '?lang=en' : ''}`,
    page_referrer: '',
  });
  return true;
}
