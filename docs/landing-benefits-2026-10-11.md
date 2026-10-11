# DeliR — Benefici dopo il pain

La sezione soluzione segue il PAS confermato dall’utente. Quattro benefici sono leggibili scorrendo la pagina, con testo e una registrazione del prodotto per ogni beneficio. Il confronto degli scenari chiude il percorso prima della matrice dei prodotti. Copy in italiano e inglese; hero e sezione pain conservate.

| Beneficio | Clip iniziale | Scene correlate |
| --- | --- | --- |
| Risalire alle evidenze | `evidenze-sul-processo` | Fonti, review As-Is, modello corretto, process owner |
| Individuare lacune | `lacuna-aperta` | Chat di discovery, passaggio nascosto |
| Conservare il contesto dell’incarico | `memoria` | Panoramica del progetto |
| Spiegare le modifiche proposte | `review-to-be` | Ipotesi To-Be |
| Confrontare gli scenari | `confronto` | Simulazioni As-Is/To-Be, heatmap, event log |

Le 17 scene, inclusa la hero, restano disponibili. Ogni scena appartiene a un solo blocco, così i link diretti hanno un target univoco. Le ancore delle scene usate dalla matrice sono conservate; il link al percorso completo torna all’inizio della sezione soluzione.

## Media e limiti delle promesse

- Poster delle evidenze: fotogramma a 6 secondi della registrazione originale, con pannello fonti visibile (`evidenze-fonti-frame.jpg`).
- Poster della review: fotogramma a 27 secondi della registrazione originale, con problema, fonte e proposta To-Be visibili (`review-proposta-frame.jpg`).
- Poster generati in WebP responsive dalla pipeline esistente. Registrazioni e dati della demo identificati come dimostrativi.
- Riproduzione desktop solo in vista; mobile, movimento ridotto e Save-Data richiedono avvio volontario. Anteprima, descrizione, pausa e apertura del video completo restano disponibili.
- Le evidenze sostengono review e discussione delle proposte. La sezione non presenta la demo come verifica di una tracciabilità storica completa o di un beneficio esclusivo rispetto ai concorrenti. Le simulazioni dipendono dai parametri del caso.

## Criteri nella sezione confronto

Su indicazione dell’utente, i quattro benefici restano nella soluzione. La sezione successiva introduce i sei criteri proposti come supporto alla scelta del workflow, prima della matrice esistente. Ogni criterio ha un’etichetta sintetica, una breve descrizione e un link alla demo in IT/EN, evitando di ripetere le headline dei benefici.

| Criterio | Destinazione |
| --- | --- |
| Evidence traceability | Evidenze sul processo |
| Gap detection | Lacuna aperta |
| Source reconciliation | Passaggio nascosto: prospettive diverse dalle interviste |
| Engagement memory | Memoria |
| Decision provenance | Review To-Be: evidenze e motivazione della proposta |
| Context continuity | Inizio del percorso completo |

Il copy evita garanzie su ogni passaggio, sull’assenza futura di lacune o sulla conservazione indefinita della fiducia. La riconciliazione richiede review con il process owner; la motivazione della proposta non viene presentata come registro storico completo. Non sono stati aggiunti giudizi sui concorrenti: la matrice mantiene criteri, fonti, data e limiti del confronto già documentati.

## Verifica dei quattro benefici

- Lint, typecheck e build passati.
- Suite coinvolte: 59 test passati, 33 esclusi dai filtri già previsti per browser; Chromium, WebKit, Chrome mobile e Safari mobile. Coperti media, link diretti, dialog, tastiera, movimento ridotto, menu, viewport da 320 px a desktop e scansioni axe.
- Dopo la selezione definitiva dei poster: controllo dei cinque blocchi IT/EN su Chromium desktop e mobile, con immagini caricate, assenza di overflow, axe e nessuna richiesta video prima dell’avvio volontario.
- Revisione visiva dei blocchi e controllo del codice rispetto alle Web Interface Guidelines. Questi controlli non attestano conformità WCAG completa o un aumento delle conversioni.
- Baseline mobile locale prima della modifica, mediana di tre run: performance 96/100, LCP 2,27 s, CLS 0.
- Misure finali sulla home, mediana di tre run per dispositivo: mobile performance 95/100, LCP 2,29 s, CLS 0; desktop performance 100/100, LCP 0,61 s, CLS 0. Accessibilità, best practices e SEO 100/100 su entrambi; tutti i budget configurati passano. Le variazioni rispetto alla baseline non dimostrano un effetto sulla conversione o sui Core Web Vitals reali.
- Report locali in `lighthouse-report/benefits-mobile` e `lighthouse-report/benefits-desktop`.

## Verifica della sezione confronto

- Lint, typecheck e build passati dopo le modifiche React.
- Griglia IT/EN verificata su Chromium a 320, 390, 820 e 1440 px: sei criteri visibili, nessun overflow della pagina o delle card e scansioni axe A/AA senza violazioni rilevate.
- Revisione visiva delle versioni desktop e mobile. I sei criteri riutilizzano le scene esistenti senza aggiungere immagini, video o dipendenze.
- Test di navigazione da tastiera in entrambe le lingue: ogni link porta al target in vista e seleziona la scena corrispondente; il criterio di continuità torna all’inizio del percorso.
- Suite coinvolte dopo il confronto: 50 test passati e 18 esclusi dai filtri per browser su Chromium, WebKit, Chrome mobile e Safari mobile.
- La pipeline precedente segnalava un’aspettativa obsoleta nel test del cambio lingua: mancava lo spazio tra le due frasi della headline inglese. Corretto il test senza cambiare il prodotto; tutti i 12 test della suite waitlist passano sui quattro browser.
- Lighthouse mobile dopo il confronto, mediana di tre run: performance 84/100, LCP 2,25 s, CLS 0; accessibilità, best practices e SEO 100/100. Tutti i budget configurati passano. Il punteggio performance è inferiore al precedente 95/100; il benchmark CPU nei nuovi run è 648,5–856, contro 510,5–2245,5 nella serie precedente. Le condizioni locali variabili non consentono di attribuire il cambiamento alla sezione. Report in `lighthouse-report/comparison-mobile`; non sono dati sul campo.

## Bridge tra hero e pain

Il bridge dopo la hero e prima del pain spiega in una frase come documenti, interviste, evidenze e decisioni restano nello stesso contesto. Dopo l’audit CRO e l’autorizzazione dell’utente, la V2 è stata accorciata per evitare di ripetere il pain e il beneficio già espressi nella hero. Una sequenza statica e ordinata mostra documenti/interviste → evidenze → As-Is → To-Be → miglioramento continuo. Il bridge non aggiunge promesse numeriche, media o tracker.

Lint, typecheck e build passati. Controllo browser IT/EN su Chromium a 320, 768 e 1440 px e WebKit a 390 px: ordine hero/bridge/pain corretto, cinque fasi leggibili, assenza di overflow, axe A/AA senza violazioni rilevate e CTA demo funzionante da tastiera. Revisione visiva desktop e mobile completata. I controlli non costituiscono una certificazione WCAG o una misura dell’impatto sulle conversioni.

## Correzioni dopo l’audit CRO

Su autorizzazione dell’utente, la subheadline della hero è tradotta in italiano e la headline inglese è allineata alla stessa categoria e promessa. Il bridge spiega solo il meccanismo; i sei criteri mantengono nomi, descrizioni brevi e prove, senza ripetere sei headline di beneficio. I quattro benefici e tutte le scene restano disponibili.

Il pilot descrive un esempio di perimetro sugli acquisti indiretti: fonti e partecipanti alla verifica, modello BPMN As-Is con evidenze e punti aperti, ipotesi To-Be, confronto degli scenari e consegna concordata. Attività, durata, formati, criteri di accettazione e importi restano da concordare prima della firma. La FAQ sugli output è coerente con l’offerta. La sezione fiducia rimanda al confronto nella demo anche dalla pagina pilot, conservando la lingua scelta. Non vengono aggiunti risultati di clienti o metriche di risparmio.

La prima suite locale ha rilevato su Safari un disallineamento temporaneo dopo il reload: contenuto inglese con attributo `html lang` ancora italiano. L’attributo ora viene aggiornato prima della visualizzazione del contenuto; la persistenza della preferenza resta separata. Dopo la correzione, lint, typecheck e build passano e tutti i 20 test mirati su quattro browser passano. Nella suite precedente: 61 passati, un errore poi corretto e 18 esclusi dai filtri per browser.

Ipotesi da validare: meno ripetizioni facilitano la comprensione del percorso e output più concreti aiutano a valutare il pilot. La metrica primaria sarà il numero di richieste qualificate rispetto ai visitatori idonei, quando la misurazione potrà essere attivata; i clic sulle CTA saranno un indicatore intermedio. Non vengono attivati tracker o raccolta dati e non si deduce un aumento delle conversioni dalle modifiche.

Verifica finale della build corretta: dieci combinazioni IT/EN su Chromium a 320, 390, 768 e 1440 px e WebKit a 390 px. Controllati hero localizzata, quattro benefici, sei criteri, assenza di overflow e scansioni axe A/AA delle sezioni modificate. Il link dalla pagina pilot alla scena di confronto conserva la lingua in IT/EN su Chromium desktop e WebKit mobile. Revisione visiva di hero, criteri e pilot completata. Nessuna violazione automatica rilevata; non è un audit completo con tecnologie assistive.

## Data section and dedicated page

The current trust section now uses the user-supplied three-point copy immediately before the pilot: separate client workspaces, AI context and rules before real data. The demo proof block previously described above was removed from this section so it answers the data objection directly. Its details link, the data FAQ and footer lead to `/security-data`, translated in IT/EN. Evidence limits and validation for the new page are recorded in `docs/security-data-2026-10-11.md`.

## Replacement comparison matrix — 2026-10-11

The product owner supplied a new seven-row matrix: DeliR, Visio, Bizagi, Miro, ChatGPT / Claude, PRIME BPM and LucidFlow. Row order and all 49 yes/no cells are preserved exactly; English labels express the same criteria. Previous competitor columns and partial ratings were removed. Stable evidence IDs are retained and the new BPMN-workflow row links to the As-Is review demo.

Desktop at 1024 px and wider uses a fixed-layout, full-width semantic table. Below 1024 px the same data becomes seven capability cards: DeliR highlighted, with all six alternatives visible in each card. Tablet has two cards per row; phones have one. No sideways scrolling, clipping, carousel, drag gesture or scroll-arrow controls are used. Every rating retains an accessible name and links to the demo or product context; keyboard focus on the opened source criterion is preserved.

Official Microsoft, Bizagi, Miro, PRIME BPM and LucidFlow pages were checked to replace the old product-context links. These pages describe product features and do not independently prove every supplied yes/no rating. In particular, LucidFlow's public FAQ describes document-to-BPMN and financial/transformation analysis; its quantitative simulation rating remains the owner's supplied assessment. The visible methodology continues to label the entire matrix as DeliR's assessment of the specified workflow, with plans/integrations outside the comparison scope. No account-based competitive test is claimed.

Local lint, TypeScript and production build passed. Additional visible-browser checks in IT/EN at 320, 390, 768, 1024 and 1440 px verified all 49 supplied ratings, each cell inside the viewport width, no horizontal scroll region, no automated axe A/AA violations in the comparison and keyboard source-panel focus. Responsive and cross-browser regression results are recorded below after completion.

The first cross-browser matrix regression run passed 35 tests and found one Safari mobile source-panel reopening failure. A diagnostic tap trace identified Safari hit testing the section instead of its rating link after off-screen content skipping. Rendering the comparison normally removes that failure; other sections retain their deferred rendering. The details summary also uses one explicit state transition. Lint and build passed after the correction; affected cross-browser regression results follow.

After the Safari rendering correction, all 16 focused regressions passed across Chromium, WebKit, mobile Chrome and mobile Safari, including reopening shared evidence and keeping all products in the available width. Desktop header and mobile-card screenshots were reviewed. These are local checks, not live production or field performance results.

## Pilot control and risk reversals — 2026-10-11

The owner replaced the pilot offer with “Bring one project. Keep full control.” and three public terms: know scope and price before starting; pay only when each milestone is delivered; stop anytime with no long-term commitment. These terms are now shared between the hero and pilot section through `pilotRiskReversals` in `src/lib/publicOffer.ts`, in Italian and English.

The three example steps are Define the project, Understand and improve, and Review and decide. The first enquiry needs only the project, objective and timing, not client documents. CTA: “Discuss your pilot” / “Parliamo del tuo pilot”. The payment FAQ uses the new delivery-based terms. This replaces the previous initial payment at signing; old payment wording in earlier report entries is historical. No cancellation fee, refund guarantee or treatment of partial milestones was added. No payment system or lead capture was activated.

Lint, TypeScript and production build passed. Responsive, keyboard, accessibility and route checks are recorded below after completion.

Pilot offer verification: 9 focused tests passed across Chromium, WebKit, mobile Chrome and mobile Safari; 3 production-smoke duplicates were intentionally skipped. Additional IT/EN checks at 320, 390, 768 and 1440 px passed for matching hero/pilot terms, three project steps, email CTA keyboard focus, no overflow, no automated axe A/AA violations in the changed sections, and consistent terms on the standalone pilot page. Desktop/mobile visuals reviewed. These checks do not verify contractual execution or live payments.

## One complete table on every device — supersedes the card layout

The owner rejected the mobile/tablet cards. The current comparison is one semantic table on every screen, with all eight columns and seven rows displayed together. Desktop uses a wider section and larger labels; tablet retains horizontal product names; below 640 px only product headers rotate vertically so full names remain readable without abbreviations. Row labels wrap normally. No cards, clipped columns or horizontal scroll region remain.

DeliR's opaque black rating backgrounds were removed. White checks sit on the blue column with a soft radial aura and a light drop shadow. Accessible rating names, keyboard focus and the source/demo links remain. On narrow screens each rating target was checked to remain at least 24 px wide and 48 px tall; this is a dense-table compromise relative to the preferred 44 px width.

Lint, TypeScript and production build passed. IT/EN at 320, 390, 768, 1024 and 1440 px: all 49 supplied values preserved, every cell within the viewport width, no horizontal scroll region, no automated axe A/AA violations in the comparison, keyboard source-panel focus passed. Desktop and phone table screenshots reviewed. Final cross-browser regressions follow below.

All 8 final responsive/source-panel regressions passed across Chromium, WebKit, mobile Chrome and mobile Safari. The complete table stays visible in each browser, and shared evidence can be reopened after closing the details panel.

## Unified pilot CTA and closing section — 2026-10-11

The primary label is now shared across the hero, mid-page comparison, pilot invitation and final section: “Test DeliR on Your Project” / “Testa DeliR sul tuo progetto”. All four links use the same localized project-enquiry email action. This supersedes earlier Discuss/Parliamo labels. The closing section uses the owner’s Ready when you are / Bring your next client project copy, with clear scope, deliverables, milestones and price before commitment, followed by the compact three-term summary. Italian content is fully translated. Existing full risk reversals in the hero and pilot remain. No self-service access, payment or data collection was activated.

Lint, TypeScript and production build passed. Nine focused regressions passed across Chromium, WebKit, mobile Chrome and mobile Safari; three duplicate production-smoke cases were intentionally skipped. Visible-browser checks in IT/EN at 320, 390, 768 and 1440 px confirmed all four labels and destinations, closing copy, keyboard focus, buttons within the viewport, no horizontal overflow and no automated axe A/AA violations in the hero, pilot and final sections. Final-section desktop and phone screenshots reviewed. These are local checks, not evidence of conversion uplift.

## Engagement journey FAQ — 2026-10-11

The owner’s ten questions replace the earlier buying FAQ in this order: discovery, discovery intelligence, As-Is, evidence, analysis, redesign, simulation, decision, continuous improvement and memory. Italian questions are preserved verbatim; English questions and both sets of answers are localized. A small phase label precedes each question. The existing single-open accordion remains keyboard operable, with expanded state and associated regions. The Security & Data link now sits below the entire FAQ rather than depending on an item index.

Answers reflect the demonstrated discovery/evidence/scenario workflow. They preserve human review, distinguish missing information from confirmed facts, qualify simulation outcomes by parameters and assumptions, and avoid promising automatic implementation/monitoring or guaranteed six-month/unlimited retention. Scope, payment and first-contact terms remain in the pilot section.

Lint, TypeScript and production build passed. All four existing chapter/FAQ interaction regressions passed across Chromium, WebKit, mobile Chrome and mobile Safari. Additional visible-browser checks in IT/EN at 320, 390, 768 and 1440 px exercised all ten panels with Enter and Space, verified only one open panel, localized Security & Data destinations, no horizontal overflow and no automated axe A/AA violations in the FAQ. Desktop/mobile screenshots reviewed. No live conversion or compliance claim is derived from these checks.
