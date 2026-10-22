import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import WaitlistPage from './WaitlistPage';

vi.mock('../privacy/analytics', () => ({ trackInterestEvent: vi.fn(() => true), trackVideoEvent: vi.fn(() => true) }));
beforeEach(() => { localStorage.clear(); vi.stubEnv('VITE_WAITLIST_ENDPOINT', '/api/waitlist.php'); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });
function show(enabled = true) {
  render(<MemoryRouter><LanguageProvider><WaitlistPage captureEnabled={enabled} /></LanguageProvider></MemoryRouter>);
}
function fill() {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'demo@example.test' } });
  fireEvent.change(screen.getByLabelText('Tipo di attività'), { target: { value: 'independent' } });
}
it('does not collect fields when the destination is not ready', () => {
  vi.stubEnv('DEV', false);
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  show(false);
  expect(screen.queryByRole('form')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Scrivimi per entrare nella lista d’attesa' })).toHaveAttribute('href', expect.stringContaining('mailto:contact@delir.it'));
  expect(fetchMock).not.toHaveBeenCalled();
});
it('keeps unconfigured development intake closed too', () => {
  vi.stubEnv('DEV', true);
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  show(false);
  expect(screen.queryByRole('form')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Scrivimi per entrare nella lista d’attesa' })).toBeVisible();
  expect(screen.queryByRole('heading', { name: 'Sei nella lista d’attesa.' })).not.toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});
it('requires practice for qualification but does not require timing', () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  show();
  // Without the welcome email there is no reward to announce.
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Entra nella lista d’attesa' }));
  expect(screen.getByLabelText('Email')).toHaveFocus();
  expect(fetchMock).not.toHaveBeenCalled();
  expect(screen.getByLabelText(/Quando pensi che lo useresti/)).not.toBeRequired();
});
it('preserves failed requests and focuses receipt only after server acceptance', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('<html>fallback</html>', { status: 200, headers: { 'Content-Type': 'text/html' } }));
  show(); fill();
  fireEvent.click(screen.getByRole('button', { name: 'Entra nella lista d’attesa' }));
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('non è stata confermata'));
  expect(screen.getByLabelText('Email')).toHaveValue('demo@example.test');
  expect(screen.queryByRole('heading', { name: 'Sei nella lista d’attesa.' })).not.toBeInTheDocument();
  expect(document.querySelector('[data-product-video="walkthrough"]')).toBeNull();
  fetchMock.mockResolvedValue(Response.json({ accepted: true }, { status: 201 }));
  fireEvent.click(screen.getByRole('button', { name: 'Entra nella lista d’attesa' }));
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Sei nella lista d’attesa.' })).toHaveFocus());
  expect(screen.queryByRole('form')).not.toBeInTheDocument();
  // The demo is delivered by email only, never on the confirmation.
  expect(document.querySelector('[data-product-video]')).toBeNull();
});
it('announces the demo by email and points to the inbox when the welcome email is on', async () => {
  for (const [key, value] of Object.entries({ VITE_PRIVACY_NOTICE_READY: 'true', VITE_LEAD_CAPTURE_READY: 'true', VITE_PRIVACY_NOTICE_URL: '/privacy', VITE_WAITLIST_READY: 'true', VITE_WELCOME_MAIL_READY: 'true' })) vi.stubEnv(key, value);
  vi.resetModules();
  const { default: Page } = await import('./WaitlistPage');
  const { LanguageProvider: Provider } = await import('../i18n/LanguageContext');
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ accepted: true }, { status: 201 }));
  render(<MemoryRouter><Provider><Page captureEnabled /></Provider></MemoryRouter>);
  expect(screen.getByRole('complementary', { name: 'In regalo: la demo completa del prodotto, 5 minuti' })).toBeVisible();
  fill();
  fireEvent.click(screen.getByRole('button', { name: 'Iscriviti e ricevi la demo' }));
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Sei nella lista d’attesa.' })).toHaveFocus());
  expect(screen.getByText(/ti ho inviato una email di conferma con il link alla demo/)).toBeVisible();
  expect(document.querySelector('[data-product-video]')).toBeNull();
});
it('prevents multiple requests while the server response is pending', async () => {
  let resolve!: (response: Response) => void;
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise<Response>(done => { resolve = done; }));
  show(); fill();
  fireEvent.submit(screen.getByRole('form')); fireEvent.submit(screen.getByRole('form'));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Iscrizione in corso…' })).toBeDisabled();
  resolve(Response.json({ accepted: true }, { status: 201 }));
  await screen.findByRole('heading', { name: 'Sei nella lista d’attesa.' });
});
