# Motion and hierarchy follow-up — 20 October 2026

This follow-up addresses the gap between a stylesheet inventory and an actual interaction system. It does not certify either reference as universally smooth or copy its branded design.

## Controlled REA observations

Both scenarios used a fresh, owned headless Chrome profile, Chromium 155.0.8059.85, a 1440 × 900 viewport, light mode and `prefers-reduced-motion: no-preference`. REA navigated to the declared homepage, waited 1200 ms, pressed PageDown on `body`, waited 500 ms, pressed PageDown again, then waited 1200 ms. Each step retained DOM and URL; page errors were selected. Response bodies, header values, cookies, font binaries, images and logos were not exported. REA terminated its owned browser processes.

| Reference | Evidence | Observed state changes |
| --- | --- | --- |
| [Apple](https://www.apple.com/) | `ev_ba4f010fecf1cc1d90fd0da9ec4612835eec13bd750a949174801d742afd6e24` | All five declared actions completed. Between the first settled state and final settled state, `.subhead-left` changed from `matrix(1, 0, 0, 1, 33, 0)` to `matrix(1, 0, 0, 1, 0, 0)`, `.subhead-end` opacity changed 0 → 1 and `.subhead-start` 1 → 0. Main content contains distinct `theme-dark` feature units and gallery panels. |
| [Celonis](https://www.celonis.com/) | `ev_5787b2e3d6b0cf8f1fe2f8b544f5e85e7863d944a3985848b3f5a3974a344cea` | All five declared actions completed. `.home-hero.block.animate` gained `show`; the initial heading characters changed from `translate(0px, 180px)` to `translate(0px, 0px)`. Inline character delays increment by 0.02 s. Other characters remained translated in the last capture, so this is partial state coverage, not a complete animation sequence. |

These are observed DOM changes during a scroll-and-wait window. Time and scroll changed together: the capture cannot attribute each state change exclusively to scrolling. It did not record a frame timeline, measured easing curve, scroll position or rendered screenshots. It therefore does not establish frame rate, exact animation duration, visual smoothness, precise sticky behavior or the complete scroll journey. A `complete` REA scenario means its requested captures completed, not that the entire site was inspected. No page errors were retained in either bounded run.

## Existing stylesheet evidence, kept distinct from execution

### Additional fresh scenarios

The following captures used an owned Chrome process, normal motion and a 1440 × 1000 viewport. The [scenario ledger](motion-scenarios.json) retains parameters, completeness and DOM digests, without page scripts or response bodies.

| Reference | Evidence | Bounded observation |
| --- | --- | --- |
| beSharp | `ev_8a12f245529b7a2017fa2086c9089fb31b746f39af151d8af763f7369a81aeb2` | Wait 1800 ms, two PageDown actions with 700 ms waits. Carousel stage transforms change from x −1450/−936 to −1740/−1092 px, with inline `3s linear` transitions. This demonstrates moving carousel state during the window, not scroll-driven reveals or a recommendation to add a carousel. Body AOS declares duration 400 ms. |
| ProcessMind | `ev_1f6f08741b96939ab18bfbe0e0aeaefd375b9d4e9f51a105f2a9ece024840700` | Wait 1200 ms, PageDown, wait 800 ms. The next `.title.section-title[data-aos='fade-up']` gains `aos-animate`. Body AOS duration is 400 ms; one initial copy block declares delay 200 ms. |
| SAP Signavio | `ev_3316a77d670353a8734c0505395cc5af45d4f9e1ae6ab26ce5faade8e2a8c8ce` | Same short scenario as ProcessMind. No inline transform/opacity or AOS activation was found in the retained DOM. This does not prove that the site lacks animation, sticky behavior or CSS transitions. |

All requested actions/DOM captures completed in these three scenarios. Their narrower selection did not retain network events or screenshots. Timing, frame rate and perceived smoothness remain unmeasured.

The source inventories remain [apple-styles.json](apple-styles.json) and [celonis-styles.json](celonis-styles.json). Counts below are literal declarations in their previously collected stylesheets, including repeated rules, breakpoints, navigation and vendor UI. They are not rendered-use counts or frequency of animation execution.

| Reference | Declaration evidence | Design implication, inferred |
| --- | --- | --- |
| Apple | `.24s` appears 58 times, `.32s` 26 times; `cubic-bezier(.4,0,.6,1)` appears 78 times and its spaced equivalent 17 times. `transform .3s cubic-bezier(.25,.1,.3,1)` appears in five declarations. Only one non-none box-shadow declaration occurs in the inventory. | Short, consistent control feedback and restrained depth matter more than wrapping every content block in an elevated card. Do not transfer a control curve indiscriminately to large scroll entrances. |
| Celonis | The semantic tokens define focused quick/base/slow as .2/.3/.45 s and focused ease as `ease-in-out`; expressive ease is `ease-out`. Fifteen declarations use the focused-base background transition. Radius references use medium 28 times, small 11 times and large four times. | Motion and radius are assigned by purpose rather than selected independently for every component. Small radii remain useful for actual controls without turning every section into a dashboard tile. |

Existing 1440 px computed snapshots reinforce distinct color roles: Apple has neutral light/dark regions and blue links/actions; Celonis has dark surfaces, light typography and a sparse bright action accent. These counts include navigation/footer/vendor UI and do not represent pixel area. Copy the role separation, not Apple blue, Celonis green, their typefaces, slogans, layouts or assets.

## DeliR implementation direction

The following are original design choices for DeliR, informed by the observations above. They are not measurements of the reference sites.

1. Give the page a visible narrative rhythm: a generous, quiet hero; a dark process/problem chapter; a spacious, light product chapter; a clear closing offer. Use full section backgrounds and typography to create the hierarchy. Avoid an uninterrupted stack of rounded containers.
2. Keep DeliR's own ink and blue. Assign ink to authority and reading, neutral surfaces to breathing room, and blue to the primary action and one important term or active state. Reserve any secondary warm hue for a meaning such as an assumption or gap. A decorative border, title, badge, button and video frame should not all compete in the same accent color.
3. Show the real application at a large, legible scale. Use one necessary screen boundary, modest radius and at most one restrained shadow. Remove a wrapper when it merely repeats the video's own frame. Use open editorial text beside the demonstration instead of another enclosing card.
4. Use one entrance vocabulary: opacity plus 18–28 px vertical movement over roughly 550–650 ms, a decelerating curve and 70–100 ms between related blocks. Trigger once when the section enters view; preserve the page's document flow. Reveals should explain the reading order, not make every paragraph animate independently.
5. Keep controls faster: roughly 200–240 ms for hover/background/underline and 150–200 ms for a small disclosure or modal entrance. Use transform/opacity for visible movement. Do not animate section height, large shadows or continuously blur the whole screen.
6. Keep native scrolling and smooth anchor navigation. A compact section indicator may update the reader's current chapter. A sticky product stage is an optional desktop pattern, not an inferred requirement from these captures; use it only if the product story remains clear and keyboard/mobile access stays direct.
7. With reduced motion, show content immediately, remove entrance transforms and smooth scrolling, and retain every control and reading path. With JavaScript unavailable, leave semantic text and product posters readable. Do not preload all videos to create the impression of motion.

Acceptance should include the hero-to-product transition under normal motion, reduced-motion static content, anchor/keyboard behavior, mobile layout and measured runtime cost. Search visibility and AI citation depend on accessible, credible content and technical indexing in addition to this visual work; no animation treatment guarantees either outcome.
