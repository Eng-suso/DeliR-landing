import type Lenis from 'lenis';

let controller: Lenis | undefined;

export function registerDocumentScroll(instance: Lenis) {
  controller = instance;
  return () => { if (controller === instance) controller = undefined; };
}

/** Anchor destinations are layout coordinates, already adjusted for sticky headers. */
export function scrollDocumentTo(top: number, smooth: boolean) {
  if (controller && !controller.isStopped) {
    controller.resize();
    controller.scrollTo(top, { immediate: !smooth, duration: .95 });
  } else window.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' });
}
