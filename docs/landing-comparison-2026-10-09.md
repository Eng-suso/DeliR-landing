# DeliR comparison section

Historical report: this selectable-card design was superseded by the commercial comparison matrix. See [the current matrix report](landing-commercial-comparison-2026-10-09.md).

Date: 9 October 2026.

## Copy brief and user direction

The user requested a dedicated DeliR comparison against causal-analysis tools, ChatGPT/Claude and process-software competitors. The user confirmed that “causal tools” means Causal AI, then corrected the proposed brief to request a more commercial comparison. The implemented brief incorporates that direction:

- Goal: explain why a BPM/Operations consultant would choose DeliR for an engagement.
- Audience: independent consultants and small practices, consistent with the existing homepage.
- Value: connect sources, human review, BPMN and scenarios in the engagement workflow.
- Primary action: view the relevant DeliR product chapter; secondary action: explore the guided pilot.
- Assumption: the visitor recognizes at least one alternative. Traffic source and conversion baseline are unknown.

## Implemented copy and layout

Eyebrow: **DeliR e le alternative**.

Headline: **Porta al cliente una raccomandazione che puoi spiegare.**

Intro: “Scegli lo strumento in base al lavoro da portare a termine. DeliR è pensato per il consulente che deve collegare ciò che sa, il processo che verifica e la proposta che presenta.”

Six buttons select ChatGPT/Claude, Causal AI, Celonis, SAP Signavio, Camunda or ProcessMind. Each comparison pairs the alternative’s declared focus and suitable use case with a highlighted DeliR panel: an engagement benefit, two concrete outcomes and a link to the relevant supplied demo chapter. Sources are available in an expandable disclosure. Italian and English are implemented in `src/lib/comparisonContent.ts` and `src/components/Comparison.tsx`.

The section follows the product chapters and has its own `#confronto` anchor and navigation-menu item. It uses the existing navy/blue tokens, typography and button conventions. The design-system search suggested an authority-led enterprise layout; no unsupported trust badges, results or customer logos were added.

## Headline and CTA options

| Headline | Reason |
| --- | --- |
| **Porta al cliente una raccomandazione che puoi spiegare.** — implemented | Leads with the consultant’s client-facing outcome and accountability. |
| Dalle fonti alla raccomandazione, nello stesso incarico. | Makes the product workflow immediately explicit; less emphasis on the client outcome. |
| Il tuo processo. Le evidenze dietro ogni scelta. | Highlights evidence traceability; narrower than the full engagement proposition. |

| Primary CTA | Reason |
| --- | --- |
| **Guarda DeliR in azione** — implemented | Opens the corresponding product chapter so visitors can inspect the claim. |
| Esplora il caso dimostrativo | Emphasizes evidence and invites a fuller product walkthrough. |
| Segui il percorso dalle fonti al processo | More specific to discovery; less suitable for the simulation comparison. |

These are editorial options, not tested conversion winners. Any future experiment should isolate the headline or CTA rather than change the whole comparison at once.

## Claim boundaries and source mapping

This is a comparison of use cases and positioning. It does not establish feature exclusivity, missing capabilities, pricing superiority or performance rankings. DeliR statements refer to the existing positioning and user-supplied demo recordings, not an independent audit of the product backend.

| Alternative | Declared focus used in the section | Official source checked |
| --- | --- | --- |
| ChatGPT | File/data analysis, tables/charts and code-backed analysis | [OpenAI Help](https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt) |
| Claude | Projects with documents, instructions, knowledge and conversation context | [Claude Help](https://support.claude.com/en/articles/9517075-what-are-projects) |
| Causal AI, exemplified by causaLens | Causal models and intervention-effect estimation, with dedicated assumptions | [causaLens causal inference](https://causalens.com/causal-ai/causal-inference-for-decision-making) |
| Celonis | Process data and business knowledge; analysis, design, operations and scenarios | [Celonis platform](https://www.celonis.com/platform) |
| SAP Signavio | Transformation suite including mining, modeling, simulation and governance | [SAP Signavio suite](https://www.signavio.com/products/process-transformation-suite/) |
| Camunda | Orchestration of people, systems and AI agents into executable processes | [Camunda platform](https://camunda.com/platform/) |
| ProcessMind | Modeling, documentation, architecture, mining, simulation and AI context | [ProcessMind](https://processmind.com/) |

The Causal AI panel distinguishes process simulation from causal-effect estimation. The Camunda panel distinguishes analysis of a proposed process from execution orchestration. ProcessMind’s consultant offerings and the competitors’ overlapping capabilities are acknowledged. No “competitor only does X” claims or fabricated superiority checkmarks are used.

## Verification

TypeScript, ESLint and production build passed. The landing chunk is 60.82KB (18.60KB gzip); no images, dependencies, trackers or network calls were added by the comparison component.

The initial headed Chromium check at a 320px window found that the existing global `body` minimum width of 320px exceeded the document’s usable width when a classic Windows scrollbar was present. Removing that minimum allows the content to use the available width. Narrow checks include the pilot and update routes because this base rule is shared.

Final browser and visual evidence is stored locally in `artifacts/qa/comparison-2026-10-09/`. Automated accessibility evidence is partial and does not establish WCAG certification or a full screen-reader audit.

- Headed production-browser verification passed in Chromium and WebKit with desktop and Pixel 7/iPhone 14 mobile profiles. Each profile covered all six alternatives, Italian/English, keyboard selection, a single pressed button, source disclosure, the menu anchor, live selection status and navigation to the matching product chapter. No page runtime errors were recorded.
- Axe found no automatic WCAG A/AA violations in the six comparison states and in a full-homepage scan.
- Responsive checks passed at 320, 390, 820, 1024 and 1440px. `/pilot` and `/waitlist` also fit the narrow headed Chromium viewport after the shared base-width fix.
- Screenshots: [desktop comparison](../artifacts/qa/comparison-2026-10-09/desktop-comparison.png) and [mobile comparison](../artifacts/qa/comparison-2026-10-09/mobile-comparison.png). The machine-readable summary is `verification.json` in the same directory.
- Focused review against the current [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): semantic buttons and links, visible focus, `aria-pressed`, selection status, disclosure, contrast, anchor offset and layout checked. No unresolved findings in the new comparison component.
