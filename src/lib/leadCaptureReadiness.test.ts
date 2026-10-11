import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

it.each([
  ['false', 'https://example.test/privacy', '/api/pilot', '/api/waitlist', false, false],
  ['true', '', '/api/pilot', '/api/waitlist', false, false],
  ['true', '//example.test/privacy', '/api/pilot', '/api/waitlist', false, false],
  ['true', 'http://example.test/privacy', '/api/pilot', '/api/waitlist', false, false],
  ['true', 'https://example.test/privacy', '/api/pilot', '/api/waitlist', true, true],
  ['true', '/privacy', '', '/api/waitlist', false, true],
  ['true', '/privacy', '/api/pilot', '', true, false],
  ['true', '/privacy', '', '', false, false],
] as const)('gates forms by readiness, privacy and a destination (%s, %s)', async (ready, privacy, pilot, waitlist, expectedPilot, expectedWaitlist) => {
  vi.resetModules();
  vi.stubEnv('VITE_PRIVACY_NOTICE_READY', 'true');
  vi.stubEnv('VITE_LEAD_CAPTURE_READY', ready);
  vi.stubEnv('VITE_PRIVACY_NOTICE_URL', privacy);
  vi.stubEnv('VITE_PILOT_ENDPOINT', pilot);
  vi.stubEnv('VITE_WAITLIST_ENDPOINT', waitlist);
  const result = await import('./leadCaptureReadiness');
  expect(result.pilotCaptureReady).toBe(expectedPilot);
  expect(result.waitlistCaptureReady).toBe(expectedWaitlist);
});

it('keeps intake closed when the notice is not ready despite endpoint and capture flags', async () => {
  vi.resetModules();
  vi.stubEnv('VITE_PRIVACY_NOTICE_READY', 'false');
  vi.stubEnv('VITE_LEAD_CAPTURE_READY', 'true');
  vi.stubEnv('VITE_PRIVACY_NOTICE_URL', '/privacy');
  vi.stubEnv('VITE_PILOT_ENDPOINT', '/api/pilot.php');
  vi.stubEnv('VITE_WAITLIST_ENDPOINT', '/api/waitlist');
  const result = await import('./leadCaptureReadiness');
  expect(result.pilotCaptureReady).toBe(false);
  expect(result.waitlistCaptureReady).toBe(false);
});
