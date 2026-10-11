export type PilotApplicationFields = {
  name: string;
  email: string;
  practice: '' | 'independent' | 'boutique';
  timing: '' | 'active' | 'next-90-days';
  projectBrief: string;
};

export type PilotApplicationErrors = Partial<Record<keyof PilotApplicationFields, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function validatePilotApplication(fields: PilotApplicationFields): PilotApplicationErrors {
  const errors: PilotApplicationErrors = {};
  if (!fields.name.trim()) errors.name = 'required';
  if (!fields.email.trim()) errors.email = 'required';
  else if (!emailPattern.test(fields.email.trim())) errors.email = 'invalid';
  if (!fields.practice) errors.practice = 'required';
  if (!fields.timing) errors.timing = 'required';

  const briefLength = fields.projectBrief.trim().length;
  if (!briefLength) errors.projectBrief = 'required';
  else if (briefLength < 20) errors.projectBrief = 'short';
  else if (briefLength > 600) errors.projectBrief = 'long';
  return errors;
}

export async function submitPilotApplication(fields: PilotApplicationFields, signal?: AbortSignal): Promise<void> {
  const endpoint = import.meta.env.VITE_PILOT_ENDPOINT || '/api/pilot';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: fields.name.trim(),
      email: fields.email.trim().toLowerCase(),
      practice: fields.practice,
      timing: fields.timing,
      projectBrief: fields.projectBrief.trim(),
      source: 'delir-pilot-application',
    }),
    signal,
  });
  if (!response.ok) throw new Error('submission_failed');
}
