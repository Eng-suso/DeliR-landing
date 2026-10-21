# Reversible V2 component motion — 21 October 2026

## Requested behavior and reference evidence

The user requested component entrances/exits while scrolling down and back up, and supplied a screenshot showing overlapping text at the bottom of the navy problem section. Follow-up instructions explicitly request Lenis, continuous video playback and production deployment. The user confirmed V2 should replace the homepage. Work stays on PR20, preserving approved copy, DeliR's palette/type and real IONOS lead capture.

A new REA scenario inspected [ProcessMind](https://processmind.com/) in an owned Chrome process at 1440×900 with normal motion, empty storage and no authenticated state. After settling, it used three PageDown actions and two PageUp actions, with bounded settling intervals. DOM/URL snapshots were captured after each step and a final viewport screenshot was retained. No page-error events were retained. Evidence: `ev_70949b9a34998294bced89f86fac010a28dff3f21c99ceccc61b72f0a70ced17`; exported outside the repository to the task's `pr20-reversible-motion/evidence.json`. The REA session was closed after export.

The DOM contained 44 `data-aos` nodes. Body defaults were duration 400ms, easing `ease`, delay 0. Active `aos-animate` counts rose from 3 to 10 on the sampled downward path and fell to 6 after returning upward. Four sampled feature nodes gained and subsequently lost the class. This supports reversible activation on those observed components; it does not establish behavior for every element, exact frame timing or global AOS initialization settings. No competitor assets, fonts or code were copied.

## DeliR implementation

The UI/UX design-system recommendation was generated before implementation and React effect-cleanup guidance was applied. Generic horizontal-track, bento-grid and replacement-font recommendations do not fit this task. DeliR retains its own editorial reading path and identity.

- One IntersectionObserver observes semantic components: hero copy/actions/media, workflow links, problem introduction/rows/conclusion, chapter copy/media, trust/pilot groups, FAQ rows and final action. Nested candidate groups are filtered so transforms do not compound.
- Elements enter with opacity and a 28px vertical movement, and reset above/below the reading band when they leave. The observer stays attached, so returning in either direction replays the reveal. DeliR's original settings are 560ms on entry, 320ms on exit and `cubic-bezier(.22,1,.36,1)`; these are implementation choices, not measured ProcessMind timings.
- The reading band starts 24px below the current header and ends up to 80px above the viewport bottom. Threshold zero supports components taller than the viewport. Resize rebuilds the observer without clearing active states.
- Content in the first viewport starts readable. Observer state is added only after JavaScript starts; the prerender is never hidden. Reduced motion, Save-Data and unavailable IntersectionObserver leave static readable content.
- Focused components and ancestors of an open native video dialog are immediately opaque and untransformed, without a transition. Keyboard controls remain in the document. No `aria-hidden`, `inert` or pointer blocking is added for a visual exit.
- Only semantic children receive transforms; outer section/article anchor geometry and sticky navigation remain stable. No per-component scroll listener, permanent `will-change`, new dependency or media binary is added.
- Removing the problem introduction's sticky positioning fixes its collision with the caption in the second grid row. The introduction now leaves with the rest of its content.

## Verification

Verification results are recorded after the final build/browser checks. Tests exercise computed opacity during a transition, settled transforms, both exit directions, repeated entrances, the reported problem/caption geometry, keyboard focus, reduced motion, Save-Data and no-JavaScript readability. Existing layout, anchors, history, disclosures and automatic accessibility checks remain applicable. Lab results do not establish field CWV, frame rate or conversion uplift.

## Lenis, video and production follow-up

The installed Lenis 1.3.26 implementation was inspected alongside its [official documentation](https://github.com/darkroomengineering/lenis). V2 uses the existing dependency with autoRaf, smooth wheel, 0.95s duration and native touch. One registry connects layout-based fragment destinations to that same instance with automatic anchor handling disabled, avoiding two competing movements. Keyboard/pointer interruption stops pending inertia; native dialogs stop the controller and resume it on close. Reduced motion, Save-Data, route changes and unmount clean up the instance and listeners. The shared V1 component's default behavior remains available in source.

V2 videos now start muted/in-line and loop after entering view. Visited films remain mounted and retain their playhead across viewport edges, rather than being destroyed/recreated by the old 20% threshold. Unvisited films stay unloaded. A bounded resume attempt handles an unexpected pause while the film remains visible; explicit user pause, a hidden page, reduced motion and Save-Data retain their controls/policies. Browser autoplay restrictions can still require the explicit play button.

The root route and prerender now render V2 directly, with its approved long subheadline and normal indexable homepage metadata. `/v2` remains a noindex compatibility/review route. Root logo/footer links stay on the root. Public `.env.production` values enable the verified IONOS waitlist and pilot endpoints in an ordinary production build; no credential is stored there. The owner's earlier confirmation covers backend installation and real-write verification. Local development settings expose the same form, while PHP execution remains on IONOS. The release pipeline verifies its empty-object rejection before publishing active frontend HTML and retains rollback behavior. No synthetic lead is written to production by the visual checks.
