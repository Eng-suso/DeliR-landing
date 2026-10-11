# DeliR landing — competitive and UX review

Review date: 1 October 2026. Scope: official product pages and the local DeliR landing. Competitor claims below describe their own public positioning; they are not DeliR claims.

| Competitor | Public communication pattern | Implication for DeliR |
| --- | --- | --- |
| [SAP Signavio](https://www.signavio.com/products/process-transformation-suite/) | Suite promise first, then distinct product capabilities, customer evidence and a product tour. | Name each DeliR capability and show a concrete product view. Avoid presenting a single generic workflow as the entire platform. |
| [Celonis](https://www.celonis.com/platform) | One platform promise, a clear explanation of its layers, then use cases and integrations. | Explain the relationship between sources, review, model and scenario as an operating system for the engagement. |
| [Camunda](https://camunda.com/platform/) | A platform architecture connects design, orchestration and operations with a clear visual model. | Make the system structure visible and keep interface imagery large enough to inspect. DeliR's scope is analysis and decision support, not Camunda-style orchestration. |
| [ProcessMind](https://processmind.com/product) | A full-loop overview followed by distinct feature areas, product tour and a direct trial offer. | Show discrete DeliR product areas. Use the guided pilot as the current offer; do not imply self-service trial access. |

## Diagnosis

The previous DeliR landing used a narrow content column at large desktop widths, generic problem cards and a four-step scrollytelling block. The screenshots were too small relative to the viewport. The message described a consultant journey but did not make the product boundaries clear. These findings also match the four in-browser comments supplied by Sohayb.

## Direction implemented

- A wider, product-led hero with a concise DeliR proposition and a real screen showing the BPMN-to-evidence relationship.
- An explicit source → review → process → scenario chain to explain the core difference without invented proof.
- Separate large product chapters for Workspace, Process Discovery, Process Intelligence, Process Mining and Simulation & Delivery. The product visuals use synthetic demo data.
- Subtle, interruptible scroll entry motion. Desktop fine-pointer devices use Lenis; touch devices and reduced-motion settings retain native scrolling.
- Direct access to each complete product screenshot for small screens.

## Evidence boundaries

The screenshots in `artifacts/landing-media/images/` are product views with synthetic demo content. `artifacts/landing-media/vision/` depicts future direction. Management Systems and Company Memory remain labeled as product vision in FAQ copy and must not be described as pilot capabilities. No customer logos, outcome metrics or security certifications are claimed.

## Remaining conversion dependencies

The pilot and waitlist cannot collect contact data until a publishable privacy notice and a confirmed email/CRM destination exist. DeliR has no incorporated legal entity to list as a company. The current pages communicate that submissions are not yet open.
