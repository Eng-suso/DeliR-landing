import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { consentKey, readConsent, saveConsent } from './settings';

beforeEach(() => localStorage.clear());
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe('consent storage', () => {
  it.each([true, false])('retains both acceptance and rejection for six calendar months (%s)', analytics => {
    const now = new Date('2026-10-11T10:00:00Z').getTime();
    const record = saveConsent(analytics, now);
    expect(readConsent(now)).toEqual(record);
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + 6);
    expect(record.expiresAt).toBe(expiry.getTime());
    expect(readConsent(record.expiresAt)).toBeNull();
  });
  it.each(['null', '{}', 'not-json', 'true', JSON.stringify({ version: 1, analytics: 'yes', savedAt: 1, expiresAt: 2 })])('fails closed for malformed storage (%s)', value => {
    localStorage.setItem(consentKey, value);
    expect(readConsent()).toBeNull();
  });
  it('rejects outdated versions, future choices and excessive lifetime', () => {
    const now = Date.now();
    for (const record of [
      { version: 2, analytics: true, savedAt: now, expiresAt: now + 10000 },
      { version: 1, analytics: true, savedAt: now + 1000, expiresAt: now + 10000 },
      { version: 1, analytics: true, savedAt: now, expiresAt: now + 186 * 86400000 },
    ]) {
      localStorage.setItem(consentKey, JSON.stringify(record));
      expect(readConsent(now)).toBeNull();
    }
  });
  it('survives unavailable storage and does not treat it as permission', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(readConsent()).toBeNull();
    expect(saveConsent(true).analytics).toBe(true);
    expect(readConsent()).toBeNull();
  });
  it.each([
    ['false', 'true', 'G-TEST', false], ['true', 'false', 'G-TEST', false],
    ['true', 'true', '', false], ['true', 'true', 'BAD', false], ['true', 'true', 'G-TEST', true],
  ])('requires both gates and a valid ID (%s/%s/%s)', async (privacy, analytics, id, enabled) => {
    vi.resetModules();
    vi.stubEnv('VITE_PRIVACY_NOTICE_READY', privacy);
    vi.stubEnv('VITE_ANALYTICS_READY', analytics);
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', id);
    expect((await import('./settings')).analyticsAvailable).toBe(enabled);
  });
});
