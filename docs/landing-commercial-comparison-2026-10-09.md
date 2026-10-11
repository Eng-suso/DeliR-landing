# Commercial comparison matrix

Historical iteration: the user rejected the descriptive-cell approach. It was replaced by the scoped binary feature comparison described in [the current report](landing-feature-comparison-2026-10-09.md).

Date: 9 October 2026. Local implementation; no publication or deployment.

## Accepted direction and scope

The user rejected selectable narrative panels, requested a table that visitors can scan, then explicitly rejected N/D and asked for documented criteria with stronger buying relevance. The existing audience remains independent BPM/Operations consultants and small practices. The table now compares five purchase considerations: starting the engagement, reconstructing the process, supporting decisions, evaluating changes and what can be shown to the client.

Primary section CTA: explore the pilot. Secondary: inspect the complete demo workflow. Assumptions: visitors know at least one alternative; traffic source and conversion baseline are unavailable. Price, time-to-value, hours saved and ROI were requested from the user and are not currently established by repository evidence. No comparative financial claims were added.

## Implemented direction

- Headline: **Il valore si vede nell’incarico che consegni.**
- Intro: material, models, evidence, scenarios and delivery linked within an engagement.
- All six alternatives are visible simultaneously on desktop: ChatGPT/Claude, causaLens representing Causal AI, Celonis, SAP Signavio, Camunda and ProcessMind.
- Five rows use concise descriptions of documented workflows. No N/D, invented negatives, competitor rankings, universal superiority claims or feature scores.
- The navy DeliR column and the criterion column remain pinned during narrow-screen horizontal scrolling. Scroll buttons and a focusable scroll region support keyboard use.
- Every DeliR value links to a supplied demo chapter. Every competitor cell opens the evidence block for its criterion, with a per-product source mapping. Sources are not hidden behind hover.
- Italian and English; semantic table, column and row headers, native details disclosure and accessible names.

## Claim register and provenance

The complete cell-level mapping is `src/lib/comparisonContent.ts`: every alternative cell has typed source identifiers; each DeliR row has chapter anchors and recording IDs. The rendered disclosure preserves that mapping for visitors.

| Purchase consideration | DeliR statement | Supplied evidence |
| --- | --- | --- |
| Starting an engagement | Interviews and documents | fonti-e-affermazioni, memoria |
| Reconstructing the process | AS-IS with human review | review-as-is, as-is-corretto, evidenze-sul-processo |
| Supporting decisions | Sources on a BPMN activity | evidenze-sul-processo, process-owner |
| Evaluating change | AS-IS / TO-BE comparison | simulazione-as-is, simulazione-to-be, confronto |
| Delivery value | Model, sources and scenarios shown to the client | memoria, confronto |

DeliR statements are supported by supplied recordings and existing product copy. They are not an independent product-backend test or proof of client outcomes/export formats. Competitors were researched through official documentation, not tested in authenticated accounts. Causal inference, process simulation and execution-logic testing are different methods; descriptions acknowledge that distinction. Competitor cells describe supported paths and do not claim these are their only paths. ChatGPT and Claude are grouped; capabilities may differ by product/plan. Camunda BPMN Copilot is cited from its early-access documentation.

Official sources checked on the report date:

- [OpenAI data analysis](https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt), [Claude projects](https://support.claude.com/en/articles/9517075-what-are-projects), [Claude artifacts](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them).
- [causaLens causal inference](https://causalens.com/causal-ai/causal-inference-for-decision-making).
- [Celonis Process Management](https://www.celonis.com/platform/process-management), [Celonis simulation](https://www.celonis.com/blog/simulation-analysis-in-process-mining-definition-applications-and-techniques).
- [SAP Signavio Process Modeler](https://www.signavio.com/products/process-modeler/), [simulation tutorial](https://www.signavio.com/video/signavio-tutorial-videos/sap-signavio-process-manager-simulations/).
- [Camunda Web Modeler](https://docs.camunda.io/docs/components/modeler/web-modeler/), [BPMN Copilot](https://docs.camunda.io/docs/components/early-access/alpha/bpmn-copilot/), [review pipeline](https://docs.camunda.io/docs/components/modeler/web-modeler/process-applications/process-application-pipeline/), [process tests](https://docs.camunda.io/docs/components/hub/workspace/modeler/validation/test-your-process/).
- [ProcessMind starting paths](https://processmind.com/resources/docs/getting-started/start-with-process), [documentation and approvals](https://processmind.com/platform/process-documentation), [AI and scenarios](https://processmind.com/platform/ai-driven-process-management).

## Conversion diagnosis and next evidence

Page-CRO heuristic score: **57/100, low readiness**. This is editorial diagnosis, not analytics or a measured conversion prediction. Allocation: value clarity 19/25, goal focus 12/20, traffic match 3/15 (unknown traffic), trust 9/15 (demo and sources, no measured client results), friction 11/15, objections 3/10 (price and economic proof unresolved). The pilot currently says applications are not open. That existing state was preserved.

Quick improvement implemented: replace missing-feature labels with specific workflows and put every source one click from its claim. Expected behavior: readers can identify fit and inspect supporting evidence; measure source/demo/pilot engagement only when consent-aware measurement is authorized. No uplift or time-saving estimate is asserted.

Higher-impact evidence needed: same anonymized engagement, same output criteria, product/plan/version recorded for each participant. Measure onboarding/setup time, specialist hours, manual transfers, review corrections, usable outputs and total cost for that scope. Save artifacts and distinguish a failed test from an untested capability. Do not put unavailable metrics into the public comparison.

No A/B experiment is recommended until offer availability, baseline and financial proof are resolved. Headline options for editorial review: implemented delivery-value headline; “Dal materiale del cliente a una proposta sostenuta dalle prove” (emphasizes evidence); “Il tuo incarico: fonti, processo e scenari collegati” (explicit workflow). CTA options: implemented “Scopri il pilot”; “Valuta DeliR sul tuo incarico” (requires an available evaluation path); “Guarda il percorso completo” (lower commitment).

## Verification

TypeScript and production build passed. Final browser/accessibility results are recorded in `artifacts/qa/comparison-commercial-2026-10-09/verification.json` after testing. Browser tests validate the landing UI, evidence mapping, navigation, keyboard access, languages and narrow-screen layout; they do not validate competitor accounts or comparative product performance.
