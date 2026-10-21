import type Lenis from 'lenis';

type DocumentScroller = Pick<Lenis, 'resize' | 'scrollTo' | 'isStopped'>;
let controller: DocumentScroller | undefined;

export function registerDocumentScroll(instance: DocumentScroller) {
  controller = instance;
  return () => { if (controller === instance) controller = undefined; };
}

/** Anchor destinations are layout coordinates, already adjusted for sticky headers. */
export function scrollDocumentTo(top: number, smooth: boolean) {
  if (controller && !controller.isStopped) {
    controller.resize();
    controller.scrollTo(top, { immediate: !smooth, duration: .95 });
  // Touch keeps native gesture scrolling. Do not start a second, unowned
  // browser animation for links: WebKit can defer it across media/layout work.
  } else window.scrollTo({ top, behavior: 'instant' });
}
