import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { interestNoticeVersion, submitWaitlist, validateWaitlist, type WaitlistFields } from './waitlist';

const valid: WaitlistFields = { email: ' DEMO@EXAMPLE.TEST ', practice: 'independent', timing: '' };
beforeEach(() => vi.stubEnv('VITE_WAITLIST_ENDPOINT', '/api/waitlist.php'));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe('product-interest validation', () => {
  it('accepts a consultant without timing or personal-name fields', () => {
    expect(validateWaitlist(valid)).toEqual({});
  });
  it('requires a reachable email and a recognized practice', () => {
    expect(validateWaitlist({ email: '', practice: '', timing: '' })).toEqual({ email: 'email', practice: 'practice' });
    expect(validateWaitlist({ ...valid, email: 'demo@example' })).toHaveProperty('email');
    expect(validateWaitlist({ ...valid, email: 'x'.repeat(255) + '@example.test' })).toHaveProperty('email');
  });
  it('rejects arbitrary practice/timing strings', () => {
    expect(validateWaitlist({ ...valid, practice: 'administrator', timing: 'tomorrow' })).toEqual({ practice: 'practice', timing: 'timing' });
  });
});
describe('product-interest acknowledgement', () => {
  it('sends only the minimal fields and notice version', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"accepted":true}', { status: 201, headers: { 'Content-Type': 'application/json' } }));
    await submitWaitlist(valid);
    expect(fetchMock).toHaveBeenCalledWith('/api/waitlist.php', expect.objectContaining({
      method: 'POST', body: JSON.stringify({ email: 'demo@example.test', practice: 'independent', timing: '', source: 'delir-product-interest', noticeVersion: interestNoticeVersion }),
    }));
  });
  it.each([
    new Response('<html>SPA fallback</html>', { status: 200, headers: { 'Content-Type': 'text/html' } }),
    new Response('{"accepted":false}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    new Response('not-json', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    new Response('{"accepted":true}', { status: 503, headers: { 'Content-Type': 'application/json' } }),
  ])('does not accept an unconfirmed or failed response', async response => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response.clone());
    await expect(submitWaitlist(valid)).rejects.toThrow();
  });
  it('does not fall back to an unconfigured route', async () => {
    vi.stubEnv('VITE_WAITLIST_ENDPOINT', '');
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    await expect(submitWaitlist(valid)).rejects.toThrow('submission_unavailable');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
