import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { saveConsent } from './settings';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  document.getElementById('delir-ga4')?.remove();
  vi.stubEnv('VITE_PRIVACY_NOTICE_READY', 'true');
  vi.stubEnv('VITE_ANALYTICS_READY', 'true');
  vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST');
  Reflect.deleteProperty(window, 'gtag');
  Reflect.deleteProperty(window, 'dataLayer');
});
afterEach(() => { vi.unstubAllEnvs(); });

it('does not load or queue Google before acceptance or after rejection', async () => {
  const { startAnalytics } = await import('./analytics');
  startAnalytics(false);
  startAnalytics(true); // A caller flag cannot override the persisted choice.
  saveConsent(false);
  startAnalytics(true);
  expect(document.getElementById('delir-ga4')).toBeNull();
  expect(Reflect.get(window, 'dataLayer')).toBeUndefined();
});

it('keeps the release gate closed even with an accepted preference', async () => {
  vi.stubEnv('VITE_PRIVACY_NOTICE_READY', 'false');
  const { startAnalytics } = await import('./analytics');
  saveConsent(true);
  startAnalytics(true);
  expect(document.getElementById('delir-ga4')).toBeNull();
});

it('loads once, keeps ads denied, removes URL data and counts one page view per route', async () => {
  const { startAnalytics, trackPage } = await import('./analytics');
  saveConsent(true);
  startAnalytics(true);
  startAnalytics(true);
  expect(document.querySelectorAll('#delir-ga4')).toHaveLength(1);
  expect(document.querySelector<HTMLScriptElement>('#delir-ga4')?.referrerPolicy).toBe('no-referrer');
  trackPage('/', 'it', true);
  trackPage('/', 'it', true);
  trackPage('/pilot', 'en', true);
  trackPage('/security-data', 'it', true);
  trackPage('/comparison-sources', 'en', true);
  trackPage('/unknown/private-value', 'it', true);
  const queue = Reflect.get(window, 'dataLayer') as ArrayLike<unknown>[];
  expect(queue.every(command => Object.prototype.toString.call(command) === '[object Arguments]')).toBe(true);
  expect(Array.from(queue[0])).toEqual(['consent', 'default', expect.objectContaining({ analytics_storage: 'denied', ad_user_data: 'denied' })]);
  expect(Array.from(queue[1])).toEqual(['consent', 'update', expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'denied', ad_personalization: 'denied' })]);
  expect(Array.from(queue[3])).toEqual(['config', 'G-TEST', expect.objectContaining({ send_page_view: false, cookie_update: false, allow_google_signals: false, page_referrer: '' })]);
  const events = queue.filter(item => item[0] === 'event');
  expect(events).toHaveLength(4);
  expect(events[1][2]).toMatchObject({ page_location: 'https://delir.it/pilot?lang=en', page_referrer: '' });
  saveConsent(false);
  trackPage('/waitlist', 'it', true);
  expect(queue.filter(item => item[0] === 'event')).toHaveLength(4);
});

it('withdrawal disables GA, clears its cookies and queue, and preserves technical storage', async () => {
  const { startAnalytics, stopAnalytics, trackPage } = await import('./analytics');
  saveConsent(true);
  startAnalytics(true);
  document.cookie = '_ga=value; path=/';
  document.cookie = '_ga_TEST=value; path=/';
  document.cookie = 'technical=keep; path=/';
  localStorage.setItem('delir-language', 'en');
  saveConsent(false);
  expect(stopAnalytics()).toBe(true);
  trackPage('/', 'it', true);
  expect(Reflect.get(window, 'ga-disable-G-TEST')).toBe(true);
  expect(Reflect.get(window, 'dataLayer')).toEqual([]);
  expect(document.getElementById('delir-ga4')).toBeNull();
  expect(document.cookie).not.toContain('_ga');
  expect(document.cookie).toContain('technical=keep');
  expect(localStorage.getItem('delir-language')).toBe('en');
  expect(stopAnalytics()).toBe(false);
});

it('protects funnel events with consent and sends only allowlisted context', async () => {
  const { startAnalytics, trackPilotEvent } = await import('./analytics');
  expect(trackPilotEvent('pilot_form_started', 'it')).toBe(false);
  saveConsent(true); startAnalytics(true);
  expect(trackPilotEvent('pilot_cta_clicked', 'en', 'hero')).toBe(true);
  expect(trackPilotEvent('generate_lead', 'it', 'private-free-text')).toBe(true);
  const events = (Reflect.get(window, 'dataLayer') as unknown[][]).filter(item => item[0] === 'event');
  expect(events.map(command => Array.from(command))).toEqual([
    ['event', 'pilot_cta_clicked', { send_to: 'G-TEST', language: 'en', form_name: 'pilot_application', section: 'hero', page_location: 'https://delir.it/?lang=en', page_referrer: '' }],
    ['event', 'generate_lead', { send_to: 'G-TEST', language: 'it', form_name: 'pilot_application', section: 'other', page_location: 'https://delir.it/pilot', page_referrer: '' }],
  ]);
  saveConsent(false);
  expect(trackPilotEvent('generate_lead', 'it')).toBe(false);
  expect(events).toHaveLength(2);
});

it('keeps waitlist signals separate from paid pilot leads', async () => {
  const { startAnalytics, trackInterestEvent } = await import('./analytics');
  expect(trackInterestEvent('interest_request_accepted', 'it')).toBe(false);
  saveConsent(true); startAnalytics(true);
  trackInterestEvent('interest_cta_clicked', 'en', 'hero');
  trackInterestEvent('interest_request_accepted', 'it', 'unsafe-free-text');
  const queue = (Reflect.get(window, 'dataLayer') as ArrayLike<unknown>[]).filter(item => item[0] === 'event');
  expect(queue.map(item => item[1])).toEqual(['interest_cta_clicked', 'interest_request_accepted']);
  expect(queue[0][2]).toMatchObject({ form_name: 'product_interest', section: 'hero', page_location: 'https://delir.it/?lang=en' });
  expect(queue[1][2]).toMatchObject({ form_name: 'product_interest', section: 'other', page_location: 'https://delir.it/waitlist' });
  expect(JSON.stringify(queue)).not.toContain('unsafe-free-text');
  saveConsent(false);
  expect(trackInterestEvent('interest_submit_attempt', 'it')).toBe(false);
});

it('counts product video plays only for known videos and only after consent', async () => {
  const { startAnalytics, trackVideoEvent } = await import('./analytics');
  expect(trackVideoEvent('video_play', 'simulation', 'it')).toBe(false);
  saveConsent(true); startAnalytics(true);
  expect(trackVideoEvent('video_play', 'simulation', 'en')).toBe(true);
  expect(trackVideoEvent('video_complete', 'discovery', 'it')).toBe(true);
  expect(trackVideoEvent('video_play', 'https://example.com/?email=x', 'it')).toBe(false);
  const queue = (Reflect.get(window, 'dataLayer') as ArrayLike<unknown>[]).filter(item => item[0] === 'event');
  expect(queue.map(item => item[1])).toEqual(['video_play', 'video_complete']);
  expect(queue[0][2]).toMatchObject({ video_id: 'simulation', section: 'caso', page_location: 'https://delir.it/?lang=en' });
  expect(JSON.stringify(queue)).not.toContain('example.com');
  saveConsent(false);
  expect(trackVideoEvent('video_play', 'results', 'it')).toBe(false);
});
