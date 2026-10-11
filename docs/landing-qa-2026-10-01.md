# DeliR landing — local QA evidence

Date: 1 October 2026. Target: local production build at `http://127.0.0.1:4173/`; visual checks also ran against the Vite dev server at `http://localhost:3000/`.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`: passed. Unit tests: 10/10.
- Full Playwright suite before the final image-expansion control: 39 passed, 25 intentionally skipped, 0 failed, across Chromium, WebKit, mobile Chrome and mobile Safari.
- Focused Playwright regression after the image-expansion control: 13 passed, 11 intentionally skipped, 0 failed. This includes opening the full product image in a new tab on each browser profile.
- Responsive inspection at 320, 390, 820, 1440 and 2095 px: no horizontal overflow, all five product images loaded after scrolling, no uncaught page errors.
- Desktop scroll test: Lenis active on fine-pointer desktop; five distinct product screens appear as their chapters enter view. Touch and reduced-motion settings use native scrolling.
- Axe automated WCAG A/AA scan: no detected violations on landing, pilot or waitlist. This is not a substitute for a full assistive-technology audit.

## Lab performance

One local Lighthouse run per form factor produced reports. Desktop: Performance 100, Accessibility 96, Best Practices 100, SEO 100; LCP 655 ms, CLS 0. Mobile: Performance 93, Accessibility 100, Best Practices 100, SEO 100; LCP 2823 ms, CLS 0. These are lab results from this machine, not field Core Web Vitals. Lighthouse wrote the JSON reports but its Windows launcher exited with `EPERM` during temporary-profile cleanup; the generated metric payloads were readable.

## Visual evidence

- [Desktop hero](../artifacts/qa/landing-review-2026-10-01/desktop-hero.png)
- [Tablet hero](../artifacts/qa/landing-review-2026-10-01/tablet-hero.png)
- [Mobile hero](../artifacts/qa/landing-review-2026-10-01/mobile-hero.png)
- [Mobile product chapter](../artifacts/qa/landing-review-2026-10-01/mobile-product.png)

## Open dependency

Pilot and waitlist intentionally remain closed to submissions until a privacy notice and a confirmed email/CRM destination are available.
