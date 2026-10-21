import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerDocumentScroll, scrollDocumentTo } from './documentScroll';

afterEach(() => vi.restoreAllMocks());

describe('document scroll ownership', () => {
  it('positions native anchors immediately without a controller-owned animation', () => {
    const native = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    scrollDocumentTo(140, true);
    scrollDocumentTo(40, false);
    expect(native.mock.calls).toEqual([[{ top: 140, behavior: 'instant' }], [{ top: 40, behavior: 'instant' }]]);
  });

  it('uses the current controller for smooth anchors and immediate history restoration', () => {
    const native = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const engine = { resize: vi.fn(), scrollTo: vi.fn(), isStopped: false };
    const release = registerDocumentScroll(engine);
    try {
      scrollDocumentTo(1200, true);
      scrollDocumentTo(300, false);
      expect(engine.resize).toHaveBeenCalledTimes(2);
      expect(engine.scrollTo).toHaveBeenNthCalledWith(1, 1200, { immediate: false, duration: .95 });
      expect(engine.scrollTo).toHaveBeenNthCalledWith(2, 300, { immediate: true, duration: .95 });
      expect(native).not.toHaveBeenCalled();
    } finally { release(); }
  });

  it('does not let an old route cleanup remove the next route controller', () => {
    const native = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const old = { resize: vi.fn(), scrollTo: vi.fn(), isStopped: false };
    const next = { resize: vi.fn(), scrollTo: vi.fn(), isStopped: false };
    const releaseOld = registerDocumentScroll(old);
    const releaseNext = registerDocumentScroll(next);
    try {
      releaseOld();
      scrollDocumentTo(900, true);
      expect(next.scrollTo).toHaveBeenCalledOnce();
      expect(old.scrollTo).not.toHaveBeenCalled();
      releaseNext();
      scrollDocumentTo(0, false);
      expect(native).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
    } finally { releaseNext(); }
  });

  it('does not send a request to a stopped controller while a native dialog owns scrolling', () => {
    const native = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const engine = { resize: vi.fn(), scrollTo: vi.fn(), isStopped: true };
    const release = registerDocumentScroll(engine);
    try {
      scrollDocumentTo(80, false);
      expect(engine.scrollTo).not.toHaveBeenCalled();
      expect(native).toHaveBeenCalledWith({ top: 80, behavior: 'instant' });
    } finally { release(); }
  });
});
