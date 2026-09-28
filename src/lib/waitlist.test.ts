import { describe, expect, it, vi } from 'vitest';
import { submitWaitlist, validateWaitlist, type WaitlistFields } from './waitlist';

const validFields: WaitlistFields = {
  firstName: ' Jane ',
  lastName: ' Doe ',
  email: ' JANE@COMPANY.COM ',
  role: ' Operations Lead ',
};

describe('validateWaitlist', () => {
  it('accepts a complete, valid submission', () => {
    expect(validateWaitlist(validFields)).toEqual({});
  });

  it('reports every required field', () => {
    expect(validateWaitlist({ firstName: ' ', lastName: '', email: '', role: '' })).toEqual({
      firstName: 'Enter your first name.',
      lastName: 'Enter your last name.',
      email: 'Enter your work email.',
      role: 'Enter your role or job title.',
    });
  });

  it('rejects malformed email addresses', () => {
    expect(validateWaitlist({ ...validFields, email: 'jane@company' }).email).toBe(
      'Enter a valid email address.',
    );
  });
});

describe('submitWaitlist', () => {
  it('posts normalized data to the configured endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 201 }));

    await submitWaitlist(validFields);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/waitlist',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@company.com',
          role: 'Operations Lead',
          source: 'delir-landing',
        }),
      }),
    );
    fetchMock.mockRestore();
  });

  it('surfaces an unsuccessful response', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

    await expect(submitWaitlist(validFields)).rejects.toThrow('We could not complete your request');
    fetchMock.mockRestore();
  });
});
