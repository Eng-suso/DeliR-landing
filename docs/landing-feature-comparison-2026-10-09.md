# Binary feature comparison

Date: 9 October 2026. This report supersedes the selectable-card and descriptive purchase-criteria iterations. Local preview only.

## User direction

The user explicitly wants an immediately scannable feature matrix with checkmarks and crosses, no N/D or narrative descriptions in cells, with documented claims. They cannot provide product accounts: this is a promotional landing. The primary audience and goal remain BPM/Operations consultants and small practices evaluating DeliR. Primary CTA: explore the pilot; secondary: view the complete product demonstration.

## Implemented scope

Three rows compare native reference workflows: dedicated BPMN canvas, in-product BPMN review and quantitative operating-scenario comparison. DeliR has a highlighted navy column. Desktop displays all alternatives; narrow screens pin the row headings and DeliR while alternatives scroll. Cell text is only Sì/No or Yes/No, plus SVG check/cross. Every competitor cell opens criteria and source mapping. Each DeliR check links to its supporting demo chapter.

Headline: **Modella. Verifica. Confronta gli scenari.** The headline makes the included capabilities immediately explicit. Editorial alternatives, not experimentally validated winners: “Dal modello agli scenari, nello stesso incarico” emphasizes continuity; “Un processo verificato. Scenari da discutere con il cliente” emphasizes the client output. CTA options remain “Scopri il pilot” (implemented), “Guarda il percorso completo” (secondary), and “Valuta DeliR sul tuo incarico” (requires an available evaluation offer).

## Claim limits that must remain visible

This is a **scoped documentary assessment**, not a hands-on product benchmark. Checkmarks indicate inclusion in the compared native workflow. Crosses indicate that the defined feature requires a different workflow, tool or custom implementation within this assessment. They do not establish absence in all configurations or technical impossibility. Native reference scope is visible in the column sublabels, legend and criteria disclosure:

- ChatGPT/Claude: standard chat, analysis and artifacts. Code-built editors or simulators are excluded. They can produce code and interactive applications; the matrix does not deny this.
- causaLens: the causal-modeling workflow described in the cited causal-inference material. It does not assess the entire current digital-worker platform.
- Camunda: Web Modeler and its token/execution validation workflow. Token/logic testing differs from the statistical operating-scenario comparison defined by the third row. It does not assess every Camunda extension or integration.
- Celonis, SAP Signavio and ProcessMind receive positive marks for their documented overlapping modeling, review and simulation capabilities. The table cannot establish DeliR’s universal superiority over them.
- DeliR: user-supplied demonstration footage. Positive marks do not prove backend behavior, general availability, export formats, measured performance, prices or real-client outcomes.

These scope judgments are inferences from the documented workflow definitions. They must not be described as direct competitor test results. Candidate differentiators such as interview-citation traceability and structured decision gates were excluded from binary competitor rows because the competitor-absence claim was not established. Those DeliR capabilities remain demonstrated elsewhere on the landing.

## Cell-level evidence

`src/lib/comparisonContent.ts` contains the row definitions, included booleans, explanatory assessment text, source IDs and DeliR recording IDs. The disclosure renders every product’s source references by row. Sources and dates are inherited from the [official-source register](landing-commercial-comparison-2026-10-09.md). Additional research checked [Camunda token simulation](https://docs.camunda.io/docs/components/modeler/web-modeler/validation/token-simulation/) and [task testing](https://camunda.com/blog/2026/03/getting-fast-feedback-with-camunda-task-tester/) to distinguish logical execution validation from quantitative scenario comparison.

## Verification

TypeScript, ESLint and production build passed. Browser evidence is in `artifacts/qa/comparison-features-2026-10-09/`. Final custom Playwright coverage: Chromium and WebKit desktop/mobile profiles, Italian/English, three DeliR video links, three row-specific source disclosures, keyboard activation, the pilot anchor, table semantics and widths 320/390/640/820/1024/1440. Automated axe coverage includes the expanded comparison. This tests UI behavior and evidence-link mapping, not competitor products. No new dependency, analytics tracker or form endpoint was added.

All four final browser profiles passed with no page runtime errors. Axe reported zero automatic violations for the expanded comparison under the selected WCAG A/AA tags; this is partial coverage, not certification. A mobile source-link navigation issue was repaired by explicitly focusing and scrolling to the evidence block after opening the disclosure. Every binary row contains seven cells; checks assert 14 positive marks and seven negative marks across the three rows, matching the scoped data. Final screenshots: `desktop-matrix.png` and `mobile-matrix.png`; machine summary: `verification.json`. Landing bundle: 63.65KB, 19.32KB gzip. No new Lighthouse run was performed.

## Commercial proof still needed

Price, setup time, hours saved, delivery format and ROI remain unestablished. No numerical claims or artificial feature scores were added. The user’s no-account constraint removes direct testing from the current task. The [CRO diagnosis](landing-commercial-comparison-2026-10-09.md) remains an editorial assessment of missing financial evidence and pilot availability, not measured conversion results.
