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
  trackPage('/unknown/private-value', 'it', true);
  const queue = Reflect.get(window, 'dataLayer') as unknown[][];
  expect(queue[0]).toEqual(['consent', 'default', expect.objectContaining({ analytics_storage: 'denied', ad_user_data: 'denied' })]);
  expect(queue[1]).toEqual(['consent', 'update', expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'denied', ad_personalization: 'denied' })]);
  expect(queue[3]).toEqual(['config', 'G-TEST', expect.objectContaining({ send_page_view: false, cookie_update: false, allow_google_signals: false, page_referrer: '' })]);
  const events = queue.filter(item => item[0] === 'event');
  expect(events).toHaveLength(2);
  expect(events[1][2]).toMatchObject({ page_location: 'https://delir.it/pilot?lang=en', page_referrer: '' });
  saveConsent(false);
  trackPage('/waitlist', 'it', true);
  expect(queue.filter(item => item[0] === 'event')).toHaveLength(2);
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
