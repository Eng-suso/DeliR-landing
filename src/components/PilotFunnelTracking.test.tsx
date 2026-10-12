import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { trackPilotEvent } from '../privacy/analytics';
import PilotFunnelTracking from './PilotFunnelTracking';

vi.mock('../privacy/analytics', () => ({ trackPilotEvent: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); localStorage.clear(); });

function Menu() {
  const [open, setOpen] = useState(true);
  return <><PilotFunnelTracking /><header>{open ? <div><a data-pilot-section="navigation" href="/pilot#application" onClick={() => setOpen(false)}>Pilot</a></div> : null}</header></>;
}

it('retains navigation attribution when React removes the mobile menu during the click', () => {
  render(<MemoryRouter><LanguageProvider><Menu /></LanguageProvider></MemoryRouter>);
  // Cancel navigation at window, after the document listener has seen the click.
  window.addEventListener('click', event => event.preventDefault(), { once: true });
  fireEvent.click(screen.getByRole('link', { name: 'Pilot' }));
  expect(screen.queryByRole('link', { name: 'Pilot' })).not.toBeInTheDocument();
  expect(trackPilotEvent).toHaveBeenCalledExactlyOnceWith('pilot_cta_clicked', 'it', 'navigation');
});
