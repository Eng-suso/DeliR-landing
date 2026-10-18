import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fixture = vi.hoisted(() => ({ status: 'planned', mobile: false, language: 'it', devices: ['desktop', 'mobile'] }));
vi.mock('../../i18n/LanguageContext', () => ({ useLanguage: () => ({ language: fixture.language }) }));
vi.mock('../../lib/landingV2Media', () => ({
  getVideoSlot: () => ({ id: 'hero', status: fixture.status, devices: fixture.devices, seconds: { min: 20, max: 25 }, desktop: { width: 1600, height: 1000 }, mobile: { width: 1200, height: 900 }, shots: { it: ['Apri il progetto'], en: ['Open the project'] } }),
  referenceClip: () => ({ title: { it: 'Demo', en: 'Demo' }, description: { it: 'Processo e fonti', en: 'Process and sources' }, poster: '/reference.webp', posterSrcSet: '' }),
  videoAssetPath: (_slot: unknown, device: string, language: string, extension: string) => `/landing-v2/media/hero.${device}.${language}.${extension}`,
}));
import VideoSlotV2 from './VideoSlotV2';

beforeEach(() => {
  fixture.status = 'planned';
  fixture.mobile = false;
  fixture.language = 'it';
  fixture.devices = ['desktop', 'mobile'];
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: fixture.mobile, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('V2 media readiness', () => {
  it('renders only an existing still for planned footage, without a dead play button', () => {
    const { container } = render(<VideoSlotV2 id="hero" />);
    expect(container.querySelector('video')).toBeNull();
    expect(screen.queryByRole('button', { name: /Riproduci/ })).toBeNull();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/reference.webp');
    expect(screen.queryByText('Apri il progetto')).toBeNull();
  });
  it('shows the shot list only in studio', () => {
    render(<VideoSlotV2 id="hero" studio />);
    expect(screen.getByText('Apri il progetto')).toBeVisible();
    expect(screen.getByText('/landing-v2/media/hero.desktop.it.mp4')).toBeVisible();
  });
  it('waits for explicit play, then mounts native controls for the selected language and device', () => {
    fixture.status = 'ready'; fixture.mobile = true; fixture.language = 'en';
    const { container } = render(<VideoSlotV2 id="hero" />);
    expect(container.querySelector('video')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Play: Demo' }));
    const video = container.querySelector('video')!;
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video).not.toHaveAttribute('autoplay');
    expect(video.querySelector('source')).toHaveAttribute('src', '/landing-v2/media/hero.mobile.en.mp4');
    expect(video.querySelector('track')).toHaveAttribute('srclang', 'en');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
  });
  it('retains the poster and accessible fallback when playback fails', () => {
    fixture.status = 'ready';
    const { container } = render(<VideoSlotV2 id="hero" />);
    fireEvent.click(screen.getByRole('button', { name: 'Riproduci: Demo' }));
    fireEvent.error(container.querySelector('video')!);
    expect(screen.getByRole('status')).toHaveTextContent('Video non disponibile');
    expect(screen.getByRole('link', { name: 'Apri immagine' })).toHaveAttribute('href', '/landing-v2/media/hero.desktop.it.webp');
  });
  it('uses the desktop export for a desktop-only scene opened in mobile studio', () => {
    fixture.status = 'ready'; fixture.mobile = true; fixture.devices = ['desktop'];
    const { container } = render(<VideoSlotV2 id="hero" studio />);
    expect(screen.getByText(/Solo desktop nel layout Figma/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Riproduci: Demo' }));
    expect(container.querySelector('video source')).toHaveAttribute('src', '/landing-v2/media/hero.desktop.it.mp4');
    expect(container.querySelector('picture source')).toBeNull();
  });
});
