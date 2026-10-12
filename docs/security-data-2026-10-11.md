# Security & Data — 2026-10-11

## Scope and message

Landing trust section immediately before the pilot: three plain-language points, the user-supplied reassurance and a contact CTA. Product demo proof is no longer mixed into the data section. The data FAQ and footer link to `/security-data`; both languages retain their locale on navigation.

The dedicated page distinguishes website privacy from client engagement data. It explains eight project topics: workspace access, hosting/location, retention, AI source use, providers/subprocessors, responsibilities/DPA, return/deletion and international transfers. These are points to document before real client data, not declarations of completed compliance or audited controls.

## Evidence boundaries

- IONOS Hosting Plus is confirmed for the landing only. Product/pilot hosting, countries, backups and remote access are not confirmed.
- Separate authenticated client workspaces are the product design principle supplied by the user. Actual isolation, roles and support access still require configuration evidence before pilot data.
- AI provider terms, training exclusions, retention and provider list are not verified; no such guarantees are invented.
- A product DPA is not published. Roles and Article 28 conditions depend on the actual processing relationship.
- Website/email/GA4 retention proposals do not establish retention for client sources, models, logs or backups.
- Contact remains email; no form or document upload is enabled. Analytics and privacy readiness gates are unchanged.

## Sources checked

- [EDPB: controller, processor and processing agreements](https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en): actual roles, Article 28 agreement, subprocessor authorisation, assistance, return/deletion and audit information.
- [EDPB: international transfers](https://www.edpb.europa.eu/sme/be-compliant/international-data-transfers_en): assess destinations and applicable transfer mechanism/safeguards.
- [GDPR official text](https://eur-lex.europa.eu/eli/reg/2016/679/oj): Articles 5, 28, 32 and 44–49. The direct English HTML fetch challenged automated browsing; primary EDPB guidance was readable.

Design: existing Hanken Grotesk and brand tokens; simple introduction, scope notice, eight semantic definition-list cards, contact and source links. No new remote fonts, invented certifications, badges or tracking scripts. Page is a lazy route, approximately 3.8 KB gzip of page-specific JavaScript in this build.

## Validation

Lint, TypeScript and production build passed. Browser and accessibility results are recorded below after completion. Automated checks do not establish full WCAG or GDPR conformity.

Browser verification completed: 37 passed and 23 intentionally skipped in the route/accessibility/responsive/production smoke suite across four browser projects. After making the new main region programmatically focusable, all 8 IT/EN navigation and skip-link regressions passed across Chromium, WebKit, mobile Chrome and mobile Safari. Additional visible-browser checks passed for IT/EN at 320, 390, 768 and 1440 px: no horizontal overflow, no automated axe A/AA violations, keyboard skip-link focus transferred to main. Desktop/mobile screenshots reviewed. Lint and build passed again after the focus correction. No screen reader audit or live deployment validation is claimed.
