export type WaitlistFields = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type WaitlistErrors = Partial<Record<keyof WaitlistFields, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function validateWaitlist(fields: WaitlistFields): WaitlistErrors {
  const errors: WaitlistErrors = {};

  if (!fields.firstName.trim()) errors.firstName = 'Enter your first name.';
  if (!fields.lastName.trim()) errors.lastName = 'Enter your last name.';
  if (!fields.email.trim()) {
    errors.email = 'Enter your work email.';
  } else if (!emailPattern.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!fields.role.trim()) errors.role = 'Enter your role or job title.';

  return errors;
}

export async function submitWaitlist(
  fields: WaitlistFields,
  signal?: AbortSignal,
): Promise<void> {
  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT || '/api/waitlist';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      email: fields.email.trim().toLowerCase(),
      role: fields.role.trim(),
      source: 'delir-landing',
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error('We could not complete your request. Please try again.');
  }
}
