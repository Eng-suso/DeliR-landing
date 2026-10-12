import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import PilotPage from './PilotPage';
import { trackPilotEvent } from '../privacy/analytics';

vi.mock('../privacy/analytics', () => ({ trackPilotEvent: vi.fn(() => true) }));

vi.mock('../components/FragmentNavigation', () => ({ default: () => null }));
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() })));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function showForm(enabled: boolean) {
  render(<MemoryRouter initialEntries={['/pilot?lang=it']}><LanguageProvider><PilotPage captureEnabled={enabled} /></LanguageProvider></MemoryRouter>);
}
function fillForm() {
  fireEvent.change(screen.getByLabelText('Nome e cognome'), { target: { value: 'Demo User' } });
  fireEvent.change(screen.getByLabelText('Email di lavoro'), { target: { value: 'demo@example.test' } });
  fireEvent.change(screen.getByLabelText('Tipo di attività'), { target: { value: 'independent' } });
  fireEvent.change(screen.getByLabelText('Tempistica dell’incarico'), { target: { value: 'active' } });
  fireEvent.change(screen.getByLabelText('Processo o problema da analizzare'), { target: { value: 'Review a fictional procurement approval process.' } });
}

describe('pilot submission states', () => {
  it('allows preview validation but never sends data while capture is closed', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    showForm(false); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Verifica i dati' }));
    expect(screen.getByRole('alert')).toHaveTextContent('La richiesta non è stata trasmessa.');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText('Candidatura ricevuta.')).not.toBeInTheDocument();
  });
  it('shows receipt only after explicit server acceptance', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ accepted: true }, { status: 201 }));
    showForm(true); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Richiedi la valutazione del progetto' }));
    expect(await screen.findByRole('heading', { name: 'Candidatura ricevuta.' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Candidatura ricevuta.' })).toHaveFocus();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });
  it('preserves the draft after a failed submission and permits retry', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 503 }));
    showForm(true); fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Richiedi la valutazione del progetto' }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Riprova.'));
    expect(screen.getByLabelText('Nome e cognome')).toHaveValue('Demo User');
    fetchMock.mockResolvedValue(Response.json({ accepted: true }, { status: 201 }));
    fireEvent.click(screen.getByRole('button', { name: 'Richiedi la valutazione del progetto' }));
    expect(await screen.findByRole('heading', { name: 'Candidatura ricevuta.' })).toBeVisible();
  });
});

it('tracks one form start and counts a lead only after server acceptance on retry', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 503 }))
    .mockResolvedValueOnce(Response.json({ accepted: true }, { status: 201 }));
  showForm(true);
  fireEvent.click(screen.getByRole('button', { name: 'Richiedi la valutazione del progetto' }));
  expect(trackPilotEvent).not.toHaveBeenCalled();
  fillForm();
  fireEvent.click(screen.getByRole('button', { name: 'Richiedi la valutazione del progetto' }));
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Riprova.'));
  expect(vi.mocked(trackPilotEvent).mock.calls.map(([event]) => event)).toEqual(['pilot_form_started', 'pilot_submit_attempt', 'pilot_submit_failed']);
  expect(screen.getByLabelText('Email di lavoro')).toHaveValue('demo@example.test');
  fireEvent.click(screen.getByRole('button', { name: 'Richiedi la valutazione del progetto' }));
  expect(await screen.findByRole('heading', { name: 'Candidatura ricevuta.' })).toBeVisible();
  expect(vi.mocked(trackPilotEvent).mock.calls.map(([event]) => event)).toEqual(['pilot_form_started', 'pilot_submit_attempt', 'pilot_submit_failed', 'pilot_submit_attempt', 'generate_lead']);
  expect(vi.mocked(trackPilotEvent).mock.calls.every(call => call.length === 2 && call[1] === 'it')).toBe(true);
});
