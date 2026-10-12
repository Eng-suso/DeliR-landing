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

  it.each(['josé@example.com', 'jane@exämple.com'])('rejects unsupported non-ASCII email %s with field guidance', email => {
    expect(validatePilotApplication({ ...validFields, email }).email).toBe('invalid');
  });

  it('reports every required field', () => {
    expect(validatePilotApplication({ name: '', email: '', practice: '', timing: '', projectBrief: '' })).toEqual({
      name: 'required', email: 'required', practice: 'required', timing: 'required', projectBrief: 'required',
    });
  });

  it('rejects oversized and unsupported values', () => {
    expect(validatePilotApplication({ ...validFields, name: 'x'.repeat(101), email: 'x'.repeat(255), practice: 'unsupported' as PilotApplicationFields['practice'], timing: 'unsupported' as PilotApplicationFields['timing'], projectBrief: 'x'.repeat(601) })).toEqual({ name: 'long', email: 'invalid', practice: 'required', timing: 'required', projectBrief: 'long' });
  });

  it('rejects malformed email addresses and underspecified briefs', () => {
    const errors = validatePilotApplication({ ...validFields, email: 'jane@company', projectBrief: 'Procurement' });
    expect(errors.email).toBe('invalid');
    expect(errors.projectBrief).toBe('short');
  });
});

describe('submitPilotApplication', () => {
  it('posts normalized data to the pilot endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ accepted: true }, { status: 201 }));
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

  it.each([new Response('<html>fallback</html>', { status: 200 }), Response.json({ accepted: false }), Response.json({})])('rejects an unacknowledged response', async response => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    await expect(submitPilotApplication(validFields)).rejects.toThrow('submission_failed');
    fetchMock.mockRestore();
  });

  it('surfaces an unsuccessful response', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));
    await expect(submitPilotApplication(validFields)).rejects.toThrow('submission_failed');
    fetchMock.mockRestore();
  });
});
