# DeliR — consolidamento delle PR, 13 ottobre 2026

Il titolare ha chiesto di integrare le PR aperte per ripartire da una base comune. La #12 (hero e superfici) è stata integrata in `main` con merge commit `76f3066`, preservando la storia necessaria alla #13.

## Modifiche riunite

Questo branch incorpora i commit originali delle PR seguenti tramite merge, senza riscriverne la storia:

| PR | Risultato |
| --- | --- |
| [#13](https://github.com/Eng-suso/DeliR-landing/pull/13) | Waitlist primaria e pilot separato, UI IT/EN, endpoint PHP disabilitato fino alla verifica IONOS, privacy ed eventi dedicati |
| [#2](https://github.com/Eng-suso/DeliR-landing/pull/2) | Aggiornamento delle GitHub Actions fissate per SHA |
| [#3](https://github.com/Eng-suso/DeliR-landing/pull/3) | React/React DOM 19.3.0, Lenis 1.3.26, Playwright 1.64.0, TypeScript ESLint 8.71.1 |
| [#7](https://github.com/Eng-suso/DeliR-landing/pull/7) | Lucide React 1.54.0; conflitti del manifest/lockfile risolti preservando gli aggiornamenti della #3 |
| [#4](https://github.com/Eng-suso/DeliR-landing/pull/4) | Migrazione Vitest corretta aggiornando anche `@vitest/coverage-v8`; entrambe le versioni nel lockfile sono 5.0.4 |

Il consolidamento deve essere integrato con **merge commit**: la presenza dei commit delle PR originali in `main` permette a GitHub di riconoscerne l'integrazione. Non usare squash o rebase per questa PR.

## Due migrazioni ancora bloccate

- [#5, ESLint 10](https://github.com/Eng-suso/DeliR-landing/pull/5): il pacchetto attuale `eslint-plugin-jsx-a11y@6.10.2` supporta ESLint fino alla v9. La versione latest del plugin verificata nel registro npm il 13 ottobre resta 6.10.2. È stato mantenuto ESLint 9.39.5 e il controllo di accessibilità.
- [#6, TypeScript 7](https://github.com/Eng-suso/DeliR-landing/pull/6): anche `typescript-eslint@8.71.2` (latest verificata nel registro npm il 13 ottobre) richiede TypeScript `>=4.8.4 <6.1.0`. È stato mantenuto TypeScript 5.8.3.

Queste PR non sono incluse. Restano bozze con etichetta `blocked`. Non sono stati usati `--force` o `--legacy-peer-deps`, né disabilitati i controlli di qualità o accessibilità.

## Da dove ripartire dopo l'integrazione

1. Usare `main` consolidato come base per il prossimo sviluppo. Verificare la CI sul commit integrato.
2. Preservare e valutare separatamente il lavoro ancora locale nel checkout originale: `Problem.tsx`, `ProcessBridge.tsx`, `ScrollExperience.tsx`, `SmoothScroll.tsx` e `docs/site-audit-2026-10-12.md`. Queste modifiche non sono incluse nel consolidamento.
3. Per aprire la waitlist: installare il backend privato IONOS e lo schema, verificare configurazione/privacy e una scrittura reale; solo dopo attivare i due switch frontend/backend. La build distribuibile mantiene `VITE_WAITLIST_READY=false`. La fixture abilitata in CI usa risposte simulate e non prova l'installazione IONOS.
4. Riprendere #5 e #6 quando lo stack supporta le major richieste, con installazione pulita e controlli completi.

## Verifica e limiti

La PR di consolidamento esegue il quality gate sul risultato combinato: installazione pulita, audit npm, typecheck, lint, coverage, PHP/MariaDB, build, browser desktop/mobile, fixture waitlist e Lighthouse. Consultare il run dello SHA finale per i risultati effettivi: questo elenco descrive i controlli richiesti, non anticipa il loro esito.

Nessun deploy IONOS o attivazione della raccolta waitlist è incluso. Le variabili che abilitano i deploy Cloudflare risultavano assenti durante la verifica. Il checkout originale e le sue modifiche locali sono preservati.
