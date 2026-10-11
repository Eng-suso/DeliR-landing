# DeliR landing redesign — QA evidence

Date: 9 October 2026. Research and implementation rationale: `landing-competitive-redesign-2026-10-09.md`.

This report describes the first screenshot-based iteration. The subsequent rebuild using the supplied 17 recordings is documented in [landing-product-films-2026-10-09.md](landing-product-films-2026-10-09.md).

## Verification

- TypeScript, ESLint and production build passed.
- Focused Playwright suite: 36 passed, 24 intentional device/browser skips, zero failures. Profiles: Chromium, WebKit, mobile Chrome and mobile Safari.
- Covered pilot navigation, mobile menu after scrolling, Escape and focus restoration, product dialogs, FAQ, five distinct screenshots, keyboard product-index activation and chapter-anchor reload.
- Responsive matrix: 320, 390, 820, 1280 and 1440px; no horizontal overflow detected. Manual visual inspection also covered the current desktop browser and a 390px mobile viewport.
- Italian and English hero inspected in the browser; restored Italian afterward.
- Axe WCAG A/AA automated scans found no violations on `/`, `/pilot` and `/waitlist`. This is partial automated evidence, not a full assistive-technology audit or compliance certification.
- Focused code review against the current [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): semantic links/actions, heading structure, alt text, explicit image dimensions, lazy loading, focus controls, anchor offset and reduced-motion handling checked. No unresolved findings in the changed landing components.

## Local lab performance

One Lighthouse run per form factor against the final local production build at `http://127.0.0.1:4174/`:

| Metric | Desktop | Mobile |
| --- | --- | --- |
| Performance | 99 | 89 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 709ms | 3113ms |
| CLS | 0.00025 | 0 |
| Total blocking time | 0ms | 14ms |

These are lab observations, not field Core Web Vitals or a measured improvement against an equivalent baseline. Mobile LCP remains above the general 2.5s good threshold; it is below this repository's current 4s mobile lab warning budget. The prior review's measurements used a different version/run and are not a controlled comparison.

The Lighthouse JSON files were generated with no report runtime error. The Windows CLI exited with `EPERM` while cleaning temporary Chrome profiles after generating each report; therefore the CLI commands themselves are not recorded as passing release gates.

The build uses the existing WebP pipeline: product screenshots are 43–62KB each. The landing chunk is 35.90KB (11.26KB gzip); no dependencies were added.

## Saved visual evidence

- [Desktop hero](../artifacts/qa/landing-redesign-2026-10-09/desktop-hero.png)
- [Mobile hero](../artifacts/qa/landing-redesign-2026-10-09/mobile-hero.png)
- [Tablet hero](../artifacts/qa/landing-redesign-2026-10-09/tablet-hero.png)
- Local Lighthouse JSON: `artifacts/qa/landing-redesign-2026-10-09/desktop.report.json` and `mobile.report.json`.

QA artifacts remain locally ignored by Git under the project's existing artifact policy. No public deployment was performed.
