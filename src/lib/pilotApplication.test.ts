import { describe, expect, it, vi } from 'vitest';
import { submitPilotApplication, validatePilotApplication, type PilotApplicationFields } from './pilotApplication';

const validFields: PilotApplicationFields = {
  name: ' Jane Doe ',
  email: ' JANE@COMPANY.COM ',
  practice: 'independent',
  timing: 'active',
  projectBrief: ' Review the indirect procurement approval process. ',
};

describe('validatePilotApplication', () => {
  it('accepts a complete application', () => {
    expect(validatePilotApplication(validFields)).toEqual({});
  });

  it('reports every required field', () => {
    expect(validatePilotApplication({ name: '', email: '', practice: '', timing: '', projectBrief: '' })).toEqual({
      name: 'required', email: 'required', practice: 'required', timing: 'required', projectBrief: 'required',
    });
  });

  it('rejects malformed email addresses and underspecified briefs', () => {
    const errors = validatePilotApplication({ ...validFields, email: 'jane@company', projectBrief: 'Procurement' });
    expect(errors.email).toBe('invalid');
    expect(errors.projectBrief).toBe('short');
  });
});

describe('submitPilotApplication', () => {
  it('posts normalized data to the pilot endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 201 }));
    await submitPilotApplication(validFields);
    expect(fetchMock).toHaveBeenCalledWith('/api/pilot', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@company.com',
        practice: 'independent',
        timing: 'active',
        projectBrief: 'Review the indirect procurement approval process.',
        source: 'delir-pilot-application',
      }),
    }));
    fetchMock.mockRestore();
  });

  it('surfaces an unsuccessful response', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));
    await expect(submitPilotApplication(validFields)).rejects.toThrow('submission_failed');
    fetchMock.mockRestore();
  });
});
