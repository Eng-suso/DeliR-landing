# DeliR Landing Page

Marketing site and lead capture (waitlist, pilot application) for DeliR.

Latest delivery evidence: [GitHub readiness, 11 October 2026](docs/github-readiness-2026-10-11.md).

Current infrastructure decisions: [IONOS and delir.it](docs/infrastructure-decisions-2026-10-11.md). SEO audience, query hypotheses and Search Console activation: [SEO and Search Console](docs/seo-search-console-2026-10-11.md).

Stack: React 19, TypeScript, Vite, Tailwind CSS 4, React Router. The production target is IONOS Hosting Plus at `https://delir.it`, with the domain connected to `/public`. The existing deployment tooling targets Cloudflare Workers Static Assets and has not yet been adapted to IONOS.

## Setup

Requires Node 22.19 or newer (see `.nvmrc`).

```bash
npm ci
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
```

Before browser or Lighthouse checks, install the test browsers once:

```bash
npx playwright install chromium webkit
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run quality` | Typecheck, lint, unit tests with coverage, build, e2e |
| `npm run test:e2e` | Playwright (Chromium, WebKit, mobile) against `vite preview` |
| `npm run test:lighthouse` | Lighthouse lab budgets, desktop (`lighthouserc.json`) |
| `npm run test:lighthouse:mobile` | Lighthouse lab budgets, mobile (`lighthouserc.mobile.json`) |
| `npm run cf:preview` | Build and serve through the Cloudflare runtime locally (`wrangler dev`) |
| `npm run cf:deploy:staging` | Build and deploy the staging Worker (`delir-landing-staging`) |
| `npm run cf:deploy` | Build and deploy production (`wrangler login` first) |

## Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `VITE_LEAD_CAPTURE_READY` | `false` | Set to `true` only after validating the intake service and publishing the privacy notice. |
| `VITE_PRIVACY_NOTICE_URL` | empty | Absolute HTTPS or same-origin path to the published notice. |
| `VITE_WAITLIST_ENDPOINT` | empty | Public route to a server-side waitlist handler. |
| `VITE_WAITLIST_READY` | `false` | Independent switch for the waitlist; the pilot gate alone does not open it. |
| `VITE_PILOT_ENDPOINT` | empty | Public route to a server-side pilot handler. |

A cross-origin endpoint must also be allowed in the `connect-src` directive of `public/_headers`, otherwise the CSP blocks submissions.

The waitlist route shows an honest availability page and usable email contact until its independent switch, notice URL and endpoint are set. The pilot retains its existing preview/active behavior. The IONOS PHP libraries, public entrypoints and schema live in `server/ionos` and `public/api`; they require private server installation and are not executed by Vite or Cloudflare Static Assets. Never put a CRM token or private webhook in a `VITE_*` variable. Verify server-side validation, rate limiting, persistence and error handling before opening intake.

Waitlist requests qualify interest with email, practice type and optional timing. They are distinct from paid-pilot applications. See [waitlist, early access and pilot](docs/product-interest-2026-10-12.md) for the conversion hierarchy, aggregate counts, deduplication and IONOS activation.

## Privacy and analytics

`/privacy` contains the IT/EN notice for the IONOS-only configuration confirmed on 12 October 2026. Gmail forwarding is disabled according to the owner. On the owner’s request, the release build now enables pilot submission to `/api/pilot.php`; the private IONOS backend must also be enabled and the real write verified after upload. GA4 and waitlist remain closed. The enterprise consent panel offers equal accept/reject actions, optional analytics off by default, granular preferences and withdrawal from the footer. Before enabling GA4, update the notice for Google processing, verify provider terms and actual property settings, and validate consent in production. See `docs/pilot-and-consent-activation-2026-10-12.md` for activation and rollback.

See [privacy and GA4 review](docs/privacy-ga4-review-2026-10-11.md) for official sources, the processing inventory, retention proposals, technical tests and remaining release conditions. The tag uses Basic Consent Mode and loads only after an affirmative, valid stored analytics choice. Revocation clears the managed GA cookies and reloads the document to stop the loaded tag. Google Ads remains denied. This implementation does not itself establish GDPR compliance.

## Hosting

- `wrangler.jsonc` serves `dist/` with `not_found_handling: "single-page-application"`, so deep links and refreshes on client routes return `index.html`.
- `public/_headers` sets security headers (CSP, HSTS, framing, referrer, permissions) and long-lived caching for hashed files under `/assets/`. Update the CSP when adding third-party origins.
- `public/robots.txt`, `public/sitemap.xml`, canonical/hreflang links and Open Graph URLs use the confirmed production domain `https://delir.it`.
- Screenshot imports stay PNG in `artifacts/`; `vite-imagetools` emits WebP at build time.

## Delivery pipeline

`.github/workflows/quality.yml`:

1. **quality** (every PR and push to `main`): full dependency audit including development tooling, typecheck, lint, unit tests, build, Playwright, Lighthouse desktop and mobile. The tested `dist/` is kept as an artifact and is what gets deployed.
2. **preview** (same-repo PRs, opt-in): set repository variable `ENABLE_CLOUDFLARE_PREVIEWS=true` to enable `wrangler versions upload`; its preview URL is in the job summary. Both Cloudflare secrets are required; otherwise this job skips the upload.
3. **deploy-staging** (push to `main`, opt-in): set repository variable `ENABLE_CLOUDFLARE_DEPLOYMENTS=true` to deploy `delir-landing-staging`.
4. **deploy-production** (after staging): deploys `delir-landing`. Add required reviewers to the `production` environment in GitHub to approve each release manually.

Required repository secrets for enabled Cloudflare jobs: `CLOUDFLARE_API_TOKEN` (template "Edit Cloudflare Workers") and `CLOUDFLARE_ACCOUNT_ID`. Without them PR previews are skipped and explicitly enabled deploy jobs fail loudly. Uploading code or opening a PR does not enable public deployments.

The Lighthouse runner (`scripts/lighthouse.mjs`) uses the installed Playwright Chromium, a fresh local production preview and three runs per route. It writes JSON/HTML evidence and evaluates the median against the configured error/warning budgets. Routes listed in `ci.collect.noindexRoutes` skip only the indexability audit; `/waitlist` deliberately uses `noindex`, which the browser smoke asserts. All other SEO checks still run. These are lab checks, not field Core Web Vitals. The older Lighthouse CI package was replaced because it retained unpatched transitive dependencies. Vitest 4.1.11 removes the vulnerable mock/worker tooling; a temporary `sharp` override selects patched 0.35.5 for both image generation and Cloudflare tooling. Remove the override once all parents require that version themselves.

Dependabot (`.github/dependabot.yml`) opens weekly PRs for npm and GitHub Actions; actions are pinned to commit SHAs.

## Rollback

- Dashboard: Workers & Pages → `delir-landing` → Deployments → pick a previous version → Rollback.
- CLI: `npx wrangler deployments list`, then `npx wrangler rollback <version-id>` (add `--env staging` for staging).

A rollback only swaps the static build; there is no data migration to undo.
