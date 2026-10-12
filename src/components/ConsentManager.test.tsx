import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { readConsent } from '../privacy/settings';
import { startAnalytics } from '../privacy/analytics';
import ConsentManager from './ConsentManager';

// Enabled analytics are a local fixture; production keeps its release gate closed.
vi.mock('../privacy/settings', async importOriginal => ({ ...await importOriginal<typeof import('../privacy/settings')>(), analyticsAvailable: true }));
vi.mock('../privacy/analytics', () => ({ startAnalytics: vi.fn(), stopAnalytics: vi.fn(() => false), trackPage: vi.fn() }));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', ''); } },
    close: { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open'); } },
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); Reflect.deleteProperty(HTMLDialogElement.prototype, 'close'); });
function showBanner() {
  render(<MemoryRouter initialEntries={['/?lang=it']}><LanguageProvider><ConsentManager /></LanguageProvider></MemoryRouter>);
}

it('keeps tracking off before choice and gives accept and reject equal styling', () => {
  showBanner();
  expect(startAnalytics).not.toHaveBeenCalled();
  expect(readConsent()).toBeNull();
  const reject = screen.getByRole('button', { name: 'Rifiuta analytics' });
  expect(reject).toHaveFocus();
  expect(reject.className).toBe(screen.getByRole('button', { name: 'Accetta analytics' }).className);
  fireEvent.click(screen.getByRole('button', { name: 'Personalizza' }));
  expect(screen.getByRole('checkbox', { name: /Analytics/ })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: /Memorie necessarie/ })).toBeDisabled();
});

it('saves a refusal without starting analytics', () => {
  showBanner();
  fireEvent.click(screen.getByRole('button', { name: 'Rifiuta analytics' }));
  expect(readConsent()?.analytics).toBe(false);
  expect(startAnalytics).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('starts only after an explicit acceptance', () => {
  showBanner();
  fireEvent.click(screen.getByRole('button', { name: 'Accetta analytics' }));
  expect(readConsent()?.analytics).toBe(true);
  expect(startAnalytics).toHaveBeenCalledWith(true);
});

it('saves granular choices and allows withdrawal through footer preferences', () => {
  showBanner();
  fireEvent.click(screen.getByRole('button', { name: 'Personalizza' }));
  fireEvent.click(screen.getByRole('checkbox', { name: /Analytics/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Salva preferenze' }));
  expect(readConsent()?.analytics).toBe(true);
  fireEvent(window, new Event('delir:cookie-preferences'));
  fireEvent.click(screen.getByRole('button', { name: 'Personalizza' }));
  expect(screen.getByRole('checkbox', { name: /Analytics/ })).toBeChecked();
  fireEvent.click(screen.getByRole('checkbox', { name: /Analytics/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Salva preferenze' }));
  expect(readConsent()?.analytics).toBe(false);
});

it('closing the banner stores refusal rather than implicit acceptance', () => {
  showBanner();
  fireEvent.click(screen.getByRole('button', { name: 'Chiudi senza accettare analytics' }));
  expect(readConsent()?.analytics).toBe(false);
  expect(startAnalytics).not.toHaveBeenCalled();
});
