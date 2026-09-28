# DeliR Landing Page — Agent Instructions

## Project

- Stack: React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Motion and GSAP.
- Product: DeliR enterprise landing page and waitlist experience.
- Primary commands: `npm run dev`, `npm run lint`, `npm run build`.
- Treat conversion, accessibility, privacy, security, performance and measurement as product requirements.

## Skill discovery

- Codex project skills live in `.agents/skills/<skill>/SKILL.md`.
- Before using a skill, read its complete `SKILL.md` and only the references required for the current task.
- Use the smallest set of skills that fully covers the request. Do not load every skill by default.
- Explicitly named skills must be used. For implicit activation, match the request against the routes below.
- When several skills apply, follow the order stated in the relevant workflow route.
- An audit or review request authorizes diagnosis and recommendations, not implementation, unless the user also asks for changes.

## Skill routing

| Skill | Activate when | Why / expected output |
| --- | --- | --- |
| `website-enterprise-delivery` | Planning, scoping, reviewing or delivering the website; requirements, NFRs, GDPR, risks, security baseline, release gates or handoff. | Provides the enterprise delivery frame and auditable exit criteria. Use it as the orchestrator, not as a substitute for specialist skills. |
| `ui-ux-pro-max` | Creating or substantially redesigning pages, sections, components, responsive layouts, visual hierarchy, typography, color or interaction patterns. | Produces a coherent UI/UX direction before implementation. Generate a design-system recommendation first, then apply the React stack guidance. |
| `tailwind-design-system` | Adding or changing shared Tailwind tokens, component variants, spacing, typography, color, breakpoints or reusable UI primitives. | Prevents one-off styling and keeps the interface scalable. Do not activate for a tiny isolated class change. |
| `web-design-guidelines` | Reviewing UI/UX quality, interaction behavior, semantics, forms or interface best practices. | Runs a focused code review and reports concrete file-level findings. Use after implementation or when the user explicitly asks for a UI review. |
| `vercel-react-best-practices` | Writing, reviewing or refactoring React components, routing, rendering, client logic or bundle behavior. | Applies React performance and maintainability guidance. Use for code changes, not for pure copy or strategy work. |
| `accessibility-compliance-accessibility-audit` | Accessibility audits, WCAG work, keyboard/focus behavior, contrast, semantics, ARIA or accessibility acceptance evidence. | Targets WCAG 2.2 AA and produces prioritized remediation and evidence. Always include before a public release involving UI changes. |
| `copywriting` | Writing or rewriting headlines, value propositions, benefit copy, CTA labels, objections, proof or other public-facing marketing text. | Produces clear, credible and conversion-oriented copy. Preserve factual accuracy; never invent customers, metrics or testimonials. |
| `page-cro` | Diagnosing or improving landing-page conversion, offer hierarchy, CTA strategy, trust, friction or experimentation hypotheses. | Produces prioritized, testable CRO recommendations. Use analytics evidence when available and avoid guaranteed uplift claims. |
| `form-cro` | Changing the waitlist, demo request, contact or lead-capture form. | Reduces friction while preserving lead quality, accessibility, privacy and downstream data needs. Pair with API security when submission becomes real. |
| `seo-audit` | Technical/on-page SEO reviews, metadata, canonical URLs, robots, sitemap, structured data, crawlability or ranking diagnosis. | Produces evidence-based SEO findings. Implement fixes only when requested. |
| `analytics-tracking` | Designing or changing events, conversions, consent-aware analytics, UTMs, attribution, dashboards or experiment measurement. | Creates a decision-ready measurement plan and validation procedure. Do not add trackers before privacy requirements are resolved. |
| `web-performance-optimization` | Core Web Vitals, Lighthouse, bundle size, asset loading, caching, animation cost or runtime performance work. | Establishes a measured baseline, performance budget and verified improvements. Never claim field CWV from lab data alone. |
| `api-security-best-practices` | Creating or modifying a real form endpoint, API, authentication, authorization, input validation, rate limiting or anti-abuse control. | Applies secure endpoint patterns and abuse protection. It is not needed for purely static visual changes. |
| `security-scanning-security-dependencies` | Dependency audits, npm advisories, supply-chain risk, SBOM, vulnerable packages or pre-release dependency gates. | Classifies findings and produces a safe remediation plan. Do not apply breaking upgrades without validating the application. |
| `playwright-skill` | Browser automation, screenshots, responsive checks, link/form flows, cross-browser validation or end-to-end regression testing. | Verifies user-visible behavior in a real browser. Prefer stable selectors and preserve test evidence. |
| `deployment-pipeline-design` | CI/CD, staging/production promotion, preview environments, security gates, rollback or release automation. | Defines a reliable delivery pipeline with explicit quality and approval gates. Do not activate for local-only development. |

## Workflow routes

### New page or major redesign

1. `website-enterprise-delivery` for scope and acceptance criteria.
2. `ui-ux-pro-max` for the visual and interaction direction.
3. `tailwind-design-system` when reusable tokens or primitives change.
4. `vercel-react-best-practices` during React implementation.
5. `accessibility-compliance-accessibility-audit` and `web-design-guidelines` for review.
6. `web-performance-optimization` and `playwright-skill` for measurable verification.

### Landing-page conversion work

1. `website-enterprise-delivery` for business objective and risk boundaries.
2. `page-cro` for diagnosis and prioritization.
3. `copywriting` for message changes.
4. `form-cro` when lead capture is involved.
5. `analytics-tracking` for events and experiment measurement.

### Form or backend activation

1. `form-cro` for fields, friction and lead quality.
2. `api-security-best-practices` for validation, rate limiting and abuse controls.
3. `analytics-tracking` for consent-aware submission events.
4. `playwright-skill` for success, validation, error and retry flows.

### Pre-release gate

1. `website-enterprise-delivery` for the release checklist and risk acceptance.
2. `security-scanning-security-dependencies` for dependency risk.
3. `accessibility-compliance-accessibility-audit` for WCAG evidence.
4. `web-performance-optimization` for budgets and Core Web Vitals lab checks.
5. `playwright-skill` for critical paths, responsive behavior and links.
6. `deployment-pipeline-design` for deployment, monitoring and rollback readiness.

## Quality rules

- After TypeScript or React changes, run `npm run lint` and `npm run build`.
- For user-visible changes, validate mobile and desktop behavior and keyboard access.
- Do not invent analytics results, user research, certifications, compliance status or security assurance.
- Never store secrets, credentials, raw client data or non-anonymized PII in the repository.
- Keep generated reports tied to repository evidence and clearly label assumptions.

