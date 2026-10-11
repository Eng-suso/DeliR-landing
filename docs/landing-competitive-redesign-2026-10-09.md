# DeliR — competitor-informed UI/UX update

Date: 9 October 2026. Scope: public marketing pages, current landing implementation, local browser verification. This is a design benchmark, not an exhaustive market map or evidence of conversion uplift.

## Sources and observations

Official pages were read and their desktop heroes inspected in a real browser. Some remote visuals load progressively; no claim about their load speed is made.

| Reference | Observed pattern | Application to DeliR |
| --- | --- | --- |
| [Apple](https://www.apple.com/) | Centered short messages, large product imagery, distinct primary and secondary actions, generous spacing. | Light centered hero, two clear actions, large inspectable product screen. |
| [Camunda](https://camunda.com/) | Centered platform promise, strong CTA, then product views and customer evidence. | Keep the offer obvious and show the actual BPMN/evidence interface. |
| [SAP Signavio](https://www.signavio.com/) | Product and solution navigation, primary demo action, capabilities grouped into a broader suite. | Keep five DeliR capabilities separate and directly navigable. |
| [Celonis](https://www.celonis.com/) | Large editorial typography, platform explanation, solution groups and customer stories. | Strong headline hierarchy and one continuous engagement context. |
| [ProcessMind](https://processmind.com/) | Product screen in the hero, modeling/mining/simulation narrative, role-oriented sections. | Product screen first, then the source/review/model/scenario relationship. |
| [ARIS](https://aris.com/) | Explicit choice of interest and routes to platform/solutions. | Let visitors choose a product chapter through a visible index. |
| [Bizagi](https://www.bizagi.com/en) | Spacious hero, separate learning/demo actions and product/platform paths. | Clear visual separation between exploring DeliR and reading pilot terms. |
| [UiPath process intelligence](https://www.uipath.com/product/maestro/process-intelligence) | Centered proposition, explicit learning actions, explanation of process capabilities. | Maintain distinct capability labels and direct links to demonstration screens. |

These products overlap different parts of DeliR's scope; inclusion does not imply identical capabilities. Apple is a visual reference. Their outcome metrics, testimonials, logos and certifications are not evidence for DeliR.

## Implemented decisions

- Retain the existing Italian/English proposition, pilot offer, demo labels and product screenshots.
- Replace the dark split hero with a light centered composition, blue emphasis, rounded actions and a larger product frame.
- Use a consistent 1360px landing container, balanced headings, neutral surfaces and restrained borders. Keep the installed local Hanken Grotesk font.
- Present the existing source → review → process → scenario chain in a responsive grid.
- Add a five-link product index, sticky on desktop and fully visible in a mobile grid. Use real anchors that can be bookmarked and shared.
- Reduce chapter height and spacing while preserving all five screens, full-screen inspection and reduced-motion support.
- Close mobile navigation with Escape and return focus to the menu trigger.
- Restore section anchors after the lazy-loaded landing mounts.
- Correct the final CTA heading's text color on its dark background.

## Acceptance criteria and evidence boundaries

Validate lint, TypeScript and production build; keyboard index navigation, direct-link reload, modal Escape/focus restoration, mobile menu, responsive layouts and automated accessibility. Measure lab performance separately from field data.

No new dependencies, analytics collection, form endpoint, customer proof or public deployment are part of this update. Pilot/waitlist availability follows the existing application readiness settings.

Validation results and screenshots: see `landing-redesign-qa-2026-10-09.md`.
