import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import WaitlistPage from './WaitlistPage';

vi.mock('../privacy/analytics', () => ({ trackInterestEvent: vi.fn(() => true) }));
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
it('lets the local preview validate without sending or claiming a signup', () => {
  vi.stubEnv('DEV', true);
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  show(false);
  expect(screen.getByRole('form')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'informativa privacy' })).toHaveAttribute('href', '/privacy');
  fireEvent.click(screen.getByRole('button', { name: 'Verifica i dati' }));
  expect(screen.getByLabelText('Email')).toHaveFocus();
  fill();
  fireEvent.click(screen.getByRole('button', { name: 'Verifica i dati' }));
  expect(screen.getByRole('status')).toHaveTextContent('non vengono inviati né salvati');
  expect(screen.queryByRole('heading', { name: 'Sei nella lista d’attesa.' })).not.toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});
it('requires practice for qualification but does not require timing', () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  show(); fireEvent.click(screen.getByRole('button', { name: 'Entra nella lista d’attesa' }));
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
  fetchMock.mockResolvedValue(Response.json({ accepted: true }, { status: 201 }));
  fireEvent.click(screen.getByRole('button', { name: 'Entra nella lista d’attesa' }));
  expect(await screen.findByRole('heading', { name: 'Sei nella lista d’attesa.' })).toHaveFocus();
  expect(screen.queryByRole('form')).not.toBeInTheDocument();
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
