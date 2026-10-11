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

Su indicazione dell’utente, i quattro benefici restano nella soluzione. La sezione successiva introduce i sei criteri proposti come supporto alla scelta del workflow, prima della matrice esistente. Ogni criterio ha headline, descrizione e link alla demo in IT/EN.

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
