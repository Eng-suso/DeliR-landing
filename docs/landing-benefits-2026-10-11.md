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

## Verifica

- Lint, typecheck e build passati.
- Suite coinvolte: 59 test passati, 33 esclusi dai filtri già previsti per browser; Chromium, WebKit, Chrome mobile e Safari mobile. Coperti media, link diretti, dialog, tastiera, movimento ridotto, menu, viewport da 320 px a desktop e scansioni axe.
- Dopo la selezione definitiva dei poster: controllo dei cinque blocchi IT/EN su Chromium desktop e mobile, con immagini caricate, assenza di overflow, axe e nessuna richiesta video prima dell’avvio volontario.
- Revisione visiva dei blocchi e controllo del codice rispetto alle Web Interface Guidelines. Questi controlli non attestano conformità WCAG completa o un aumento delle conversioni.
- Baseline mobile locale prima della modifica, mediana di tre run: performance 96/100, LCP 2,27 s, CLS 0.
- Misure finali sulla home, mediana di tre run per dispositivo: mobile performance 95/100, LCP 2,29 s, CLS 0; desktop performance 100/100, LCP 0,61 s, CLS 0. Accessibilità, best practices e SEO 100/100 su entrambi; tutti i budget configurati passano. Le variazioni rispetto alla baseline non dimostrano un effetto sulla conversione o sui Core Web Vitals reali.
- Report locali in `lighthouse-report/benefits-mobile` e `lighthouse-report/benefits-desktop`.
