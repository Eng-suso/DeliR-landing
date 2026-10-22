import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({ language: 'it' as 'it' | 'en' }));
const tracked = vi.hoisted(() => vi.fn(() => true));
vi.mock('../../i18n/LanguageContext', () => ({ useLanguage: () => ({ language: fixture.language }) }));
vi.mock('../../privacy/analytics', () => ({ trackVideoEvent: tracked }));
import ProductVideos from './ProductVideos';

beforeEach(() => {
  fixture.language = 'it';
  window.history.replaceState(null, '', '/');
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); tracked.mockClear(); });

describe('Product videos', () => {
  it('shows Problem and Agitate, four Solve steps and loads no video before a request', () => {
    const { container } = render(<ProductVideos />);
    expect(screen.getByRole('heading', { name: 'Le informazioni sono sparse' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'E intanto il processo si blocca' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      expect.stringContaining('Process Discovery'), expect.stringContaining('Evidenze e BPMN'),
      expect.stringContaining('Analisi e simulazione'), expect.stringContaining('Risultati e consegna'),
    ]);
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelectorAll('img[src^="/product-videos/"]')).toHaveLength(3);
  });

  it('plays the chosen step on request and counts the play once', () => {
    const { container } = render(<ProductVideos />);
    fireEvent.click(screen.getByRole('tab', { name: /Analisi e simulazione/ }));
    expect(screen.getByRole('tab', { name: /Analisi e simulazione/ })).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel');
    fireEvent.click(within(panel).getByRole('button', { name: /Riproduci: Analisi e simulazione/ }));
    const video = container.querySelector('[data-product-video="simulation"] video')!;
    expect(video.querySelector('source[type="video/mp4"]')).toHaveAttribute('src', '/product-videos/simulation.mp4');
    expect(video.querySelector('track')).toHaveAttribute('src', '/product-videos/simulation.it.vtt');
    fireEvent.play(video);
    fireEvent.play(video);
    fireEvent.ended(video);
    expect(tracked.mock.calls).toEqual([['video_play', 'simulation', 'it', 'home'], ['video_complete', 'simulation', 'it', 'home']]);
  });

  it('moves between steps with the arrow keys and opens a deep-linked step', () => {
    window.history.replaceState(null, '', '/#results');
    render(<ProductVideos />);
    expect(screen.getByRole('tab', { name: /Risultati e consegna/ })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(screen.getByRole('tab', { name: /Risultati e consegna/ }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /Process Discovery/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /Process Discovery/ })).toHaveFocus();
    act(() => { window.history.replaceState(null, '', '/#evidence'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(screen.getByRole('tab', { name: /Evidenze e BPMN/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps three sections and leaves the full walkthrough to the waitlist, in English too', () => {
    fixture.language = 'en';
    const { container } = render(<ProductVideos />);
    expect(container.querySelectorAll('.pv-section')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'Four steps, from interview to handover.' })).toBeInTheDocument();
    expect(container.querySelector('[data-product-video="walkthrough"]')).toBeNull();
    expect(screen.queryByRole('button', { name: /walkthrough/i })).toBeNull();
  });
});
