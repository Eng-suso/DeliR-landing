import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { projectContactHref } from './publicOffer';
import { useFragment } from './useFragment';

afterEach(() => { window.history.replaceState(null, '', '/'); vi.restoreAllMocks(); });

describe('shared scene navigation', () => {
  it('reads direct links and responds to fragment changes and browser history', () => {
    window.history.replaceState(null, '', '/#scene-review-as-is');
    const { result, unmount } = renderHook(useFragment);
    expect(result.current).toBe('scene-review-as-is');
    act(() => { window.history.replaceState(null, '', '/#product-04'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
    expect(result.current).toBe('product-04');
    act(() => { window.history.replaceState(null, '', '/#comparison-evidence-review'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(result.current).toBe('comparison-evidence-review');
    const remove = vi.spyOn(window, 'removeEventListener');
    unmount();
    expect(remove).toHaveBeenCalledWith('hashchange', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('popstate', expect.any(Function));
  });
  it('provides a stable empty snapshot during server rendering', () => {
    function Fragment() { return <span>{useFragment()}</span>; }
    expect(renderToString(<Fragment />)).toBe('<span></span>');
  });
});

describe('contact drafts', () => {
  it.each(['it', 'en'] as const)('creates a valid %s email draft without client data', language => {
    const url = new URL(projectContactHref(language));
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('contact@delir.it');
    expect(url.searchParams.get('subject')).toMatch(/pilot/);
    expect(url.searchParams.get('body')).toContain('\n\n');
    expect(url.searchParams.get('body')).toMatch(/senza nomi di clienti|without client names/);
  });
});
