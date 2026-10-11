# DeliR landing — supplied product films

Date: 9 October 2026. This implementation follows the user’s request to rebuild the landing with the supplied archive and the [earlier competitor review](landing-competitive-redesign-2026-10-09.md).

## Scope and result

Rebuilt the homepage around real product recordings: a centered hero, dark method section, five chapters with full-width product films, selectable scenes, audience cards, guided-pilot panel, FAQ and closing CTA. Existing Italian/English positioning and actual application availability remain the business source of truth. Demo figures are not customer results.

The UI/UX design-system search recommended product-demo storytelling and visible product detail. The implementation keeps DeliR’s local Hanken font, white/navy surfaces and restrained blue controls. Glass effects and an unrelated font palette were rejected for readability and brand continuity. Reusable styling lives in `src/index.css`; the scene catalog lives in `src/lib/productClips.ts`.

## Source and preservation

User-supplied archive: `delir-clip-landing.zip`.

SHA-256: `6DCD60A428E618DBE5A09974CEFCE35EFB46196ADE031637EC8817077A4E4D31`.

The archive contains 51 media files: 17 JPG posters, 17 silent H.264 MP4 recordings and 17 WebM alternatives. It contains no project brief or executable code. Media content was treated as source material, not agent instructions. The clips identify the company and people as fictional demonstration data.

- Supplied JPGs are preserved in `artifacts/landing-media/images/`; Vite emits WebP posters of approximately 45–98KB each.
- Original MP4/WebM files are preserved in `public/product-clips/` without re-encoding.
- 34 additional WebVTT text alternatives describe each silent recording in Italian and English. Visible descriptions also accompany every film.
- Full-resolution recordings remain available in the native video dialog, with standard playback controls.

| Chapter | Recording IDs |
| --- | --- |
| Hero | hero-loop |
| Workspace | fonti-e-affermazioni, memoria |
| Process Discovery | chat-discovery, passaggio-nascosto, lacuna-aperta |
| Process Intelligence | evidenze-sul-processo, review-as-is, as-is-corretto, process-owner |
| Process Mining | heatmap-collo-di-bottiglia, event-log |
| Simulation & Delivery | ipotesi-to-be, review-to-be, simulazione-as-is, simulazione-to-be, confronto |

The heatmap and event-log descriptions explicitly identify the demonstration run. They do not establish production mining accuracy or measured business improvements. The project-context recording is distinct from the future Company Memory direction described in the FAQ.

## Playback and accessibility acceptance

- Desktop loops play silently only when at least 20% of the frame is visible, the page is active and reduced motion/Save-Data do not prohibit ambient playback.
- Mobile, reduced-motion and Save-Data visitors initially see a poster. Explicit Play opts into the recording.
- Off-screen frames have no mounted video sources. Pausing persists when returning to a previously viewed clip.
- A failed recording leaves the poster, description and a status message.
- Scene selectors are semantic buttons with `aria-pressed`, visible keyboard focus and at least 44px touch targets.
- Full-video dialogs support native focus containment, Escape, focus restoration, captions and standard video controls.
- Chapter anchors remain shareable and offset from desktop sticky navigation.
- FAQ uses semantic buttons and hidden panels, with no height animation or Motion dependency in the homepage component.

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build`: passed.
- Existing unit tests: 10 passed.
- Focused production-browser suite: 48 passed, 36 intentional profile skips, zero failures. Profiles: Chromium, WebKit, Pixel 7 and iPhone 14 emulation.
- Additional visual capture run: 2 passed.
- Covered manual playback, persisted pause, off-screen unloading, desktop autoplay, live reduced-motion changes, all 17 scene selectors and 68 video/caption asset routes, English dialogs, video-request failures, anchor reload, keyboard controls, mobile navigation, FAQ and critical route navigation.
- Axe WCAG A/AA scans: no automatic violations on `/`, `/pilot`, `/waitlist` and the selected English video dialog. An initial scene-number contrast finding was corrected before the final run. This is partial automated evidence, not a compliance certification or a full assistive-technology audit.
- Responsive matrix: 320, 390, 820, 1280 and 1440px, with no horizontal overflow. Desktop/mobile screenshots were visually inspected.
- Focused review against the current [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): media text alternatives, pause controls, reduced motion, semantic actions, dialog focus, image dimensions, deferred sources, anchor offsets and contrast checked. The previous FAQ height animation was removed.

## Performance and visual evidence

Final local lab measurements and screenshots are stored in `artifacts/qa/landing-films-2026-10-09/`. The landing JS chunk is 44.69KB (13.99KB gzip). No dependency was added. Media loads per selected, visible scene rather than downloading all recordings up front.

One Lighthouse run per form factor against the final local production build at `http://127.0.0.1:4174/`:

| Metric | Desktop | Mobile |
| --- | --- | --- |
| Performance | 99 | 93 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 712ms | 2834ms |
| CLS | 0.00021 | 0 |
| Total blocking time | 0ms | 55ms |

These are local lab observations, not field Core Web Vitals or a controlled before/after comparison. Mobile LCP is above the general 2.5s good threshold and below this repository’s 4s mobile lab warning budget. Both JSON reports contain no report runtime error. Both Windows CLI processes exited with `EPERM` during temporary Chrome-profile cleanup after writing the reports; the CLI exit codes are not recorded as passing release gates.

Visual evidence: [desktop hero](../artifacts/qa/landing-films-2026-10-09/desktop-hero.png), [mobile hero](../artifacts/qa/landing-films-2026-10-09/mobile-hero.png), and [product scene selector](../artifacts/qa/landing-films-2026-10-09/intelligence-chapter.png). QA artifacts follow the existing local Git-ignore policy.

The current local preview is available at `http://localhost:3000/`. No deployment was performed. Pilot and update-signup activation still depends on the existing capture/privacy readiness requirements; the redesign does not activate those channels.
