import { describe, expect, it, vi } from 'vitest';
vi.mock('./productClips', () => ({ productClips: { hero: { id: 'hero-reference' } } }));
import { getVideoSlot, referenceClip, videoAssetPath, videoSlots } from './landingV2Media';
import { pageMetadata } from './siteMetadata';

describe('V2 media catalog', () => {
  it('keeps the review route out of search in both languages', () => {
    for (const language of ['it', 'en'] as const) {
      const meta = pageMetadata('/v2', language);
      expect(meta.robots).toBe('noindex, follow');
      expect(meta.key).toBe('preview');
      expect(meta.canonical).toBe(`https://delir.it/v2${language === 'en' ? '?lang=en' : ''}`);
    }
  });
  it('keeps all unfinished scenes planned, with unique slot names', () => {
    expect(new Set(videoSlots.map(slot => slot.id)).size).toBe(7);
    expect(videoSlots.every(slot => slot.status === 'planned')).toBe(true);
  });
  it('rejects a missing slot instead of silently showing the wrong scene', () => {
    expect(() => getVideoSlot('unknown-slot')).toThrow('Unknown V2 video slot');
  });
  it('resolves the existing demonstration for the hero', () => {
    expect(referenceClip(getVideoSlot('hero'))).toEqual({ id: 'hero-reference' });
  });
  it('keeps language and device exports distinct', () => {
    const slot = getVideoSlot('hero');
    expect(videoAssetPath(slot, 'mobile', 'en', 'mp4')).toBe('/landing-v2/media/hero.mobile.en.mp4');
    expect(videoAssetPath(slot, 'desktop', 'it', 'vtt')).toBe('/landing-v2/media/hero.desktop.it.vtt');
  });
});
