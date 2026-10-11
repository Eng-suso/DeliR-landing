# DeliR — verifica prima del caricamento su GitHub

Data: 11 ottobre 2026. Repository: [Eng-suso/DeliR-landing](https://github.com/Eng-suso/DeliR-landing).

## Perimetro e correzioni

Verificata la landing presente in questo repository: home, pilot, aggiornamenti, lingua, navigazione, media, build e pipeline. Il repository esisteva già, ma la versione locale includeva un commit e numerose modifiche non ancora pubblicate. La consegna avviene su un branch `codex/` con PR verso `main`.

- Audit iniziale: 27 segnalazioni nelle dipendenze di sviluppo. Aggiornati Vitest e coverage a 4.1.11, Wrangler a 4.149.0 e source-map-js a 1.2.2; selezionato sharp 0.35.5 tramite override. Il vecchio Lighthouse CI tratteneva dipendenze senza patch: sostituito con Lighthouse 13.5.0 e un runner locale che conserva route, tre misure per route, soglie e report JSON/HTML.
- Il runtime Cloudflare bloccava un font incorporato nel CSS con `font-src 'self'`. Il build ora emette i font come asset della stessa origine, senza ampliare la CSP. Aggiunto un test di regressione che applica la CSP di produzione e verifica font e riproduzione video.
- `/waitlist` resta intenzionalmente `noindex`. Lighthouse esclude soltanto la verifica di indicizzabilità su questa route; gli altri controlli SEO rimangono attivi. Un test browser verifica il metadato `noindex, follow`.
- Lint esclude gli artefatti generati; `npm run clean` funziona anche su Windows.
- CI verifica anche le dipendenze di sviluppo. Preview e deploy Cloudflare richiedono variabili di opt-in esplicite; la pubblicazione del codice e la PR non attivano il sito pubblico. Aggiunti template PR e aggiornamenti Dependabot.

## Evidenze locali

- TypeScript, lint e build di produzione: passati.
- Unit test: 22 passati. Copertura della logica inclusa: 97,72% linee, 98,27% statement, 100% funzioni, 95,91% branch. I cataloghi statici sono verificati nei test browser.
- Suite Playwright completa: 72 passati, 36 esclusioni previste per profilo, zero fallimenti. Chromium, WebKit, Pixel 7 e iPhone 14 emulati. Dopo la correzione dei font, i due smoke test finali sono passati.
- Axe: nessuna violazione automatica WCAG A/AA sulle tre route principali e sul dialogo video inglese. Verificati skip link, selettori scene, Escape, ritorno del focus, menu mobile e movimento ridotto. Non è una certificazione WCAG o una verifica completa con tecnologie assistive.
- Runtime Cloudflare locale, desktop 1440 × 900 e mobile 390 × 844: header CSP, nosniff e referrer policy presenti; cache immutable sugli asset; navigazione e video funzionanti; nessun overflow, errore JavaScript, richiesta esterna o violazione CSP nei percorsi osservati. Route interne `/v2` e `/enterprise-readiness` escluse dal build pubblico.
- Wrangler deploy in modalità dry-run: passato; nessun deploy remoto eseguito.
- `npm audit` completo e produzione: zero vulnerabilità note rilevate. Gitleaks 8.30.1, archivio verificato mediante checksum: nessun segreto rilevato nella cronologia locale, nel diff da pubblicare o nella build. Sono controlli automatici, non un'attestazione di sicurezza completa.

## Performance di laboratorio

Le misure Lighthouse sono locali e riportano la mediana di tre esecuzioni per route. Non sono Core Web Vitals di utenti reali. La prima verifica ha rilevato il disallineamento SEO della waitlist. Durante la revisione del runner è stata corretta anche l'applicazione del preset desktop all'API Node; il runner verifica ora il form factor effettivo del report prima di accettarlo.

| Route | Profilo | Performance | Accessibilità | Best practice | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Desktop | 100 | 100 | 100 | 100 | 577 ms | 0 |
| `/pilot` | Desktop | 100 | 100 | 100 | 100 | 536 ms | 0 |
| `/waitlist` | Desktop | 100 | 100 | 100 | 100* | 480 ms | 0 |
| `/` | Mobile | 96 | 100 | 100 | 100 | 2258 ms | 0 |
| `/pilot` | Mobile | 96 | 100 | 100 | 100 | 2252 ms | 0 |
| `/waitlist` | Mobile | 98 | 100 | 100 | 100* | 1889 ms | 0 |

\* Per la waitlist la sola verifica di indicizzabilità è esclusa, come descritto sopra.

Le verifiche finali desktop e mobile rispettano tutte le soglie configurate, incluse quelle di avviso. Tutti i report hanno il form factor atteso e nessun errore di raccolta Lighthouse.

Report e screenshot locali: `artifacts/qa/github-readiness-2026-10-11/`, `lighthouse-report/` e `test-results/`. Restano esclusi da Git; la pipeline allega i report rigenerati alle esecuzioni GitHub Actions.

## Prima di aprire la raccolta dati o pubblicare il sito

La raccolta automatica non è attiva: servono endpoint reali, informativa pubblicata e verifica della consegna e delle protezioni server. Il pilot offre il contatto email già approvato. Il dominio `https://delir.ai` nei metadati deve essere confermato al momento del deploy. I metadati delle route sono aggiornati dal client; le anteprime senza JavaScript ricevono il documento italiano iniziale. Non sono stati verificati TLS o header di una produzione remota.

Questi punti sono separati dal caricamento del codice su GitHub e sono esplicitamente documentati per il futuro rilascio.
