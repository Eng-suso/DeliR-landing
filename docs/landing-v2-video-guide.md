# DeliR — struttura Figma V2 e produzione video

Riferimento: [ThrillX, B2B / General Landing Page V2](https://www.figma.com/design/Rf0YJB4UQpWiOsuhuMFesX/Public-Landing-Page---ThrillX?node-id=0-1).

## Aprire e confrontare

Esegui `npm ci`, poi `npm run dev -- --host 127.0.0.1`. Apri l’indirizzo stampato dal terminale seguito da:

- `/`: sito attuale.
- `/v2`: scheletro completo nella struttura scelta.
- `/v2?studio=1`: stesso sito con piano video, durate, inquadrature e file attesi.
- `/v2?studio=1&lang=en`: versione inglese del piano.

La toolbar permette di passare fra sito attuale, anteprima e piano. Ridimensionare la finestra cambia realmente il layout. La tabella desktop diventa una scheda per criterio sotto 768px; i blocchi affiancati diventano verticali sotto 1024px. La pagina V2 è disponibile anche nella build, prerenderizzata in IT/EN e `noindex`, fuori dalla sitemap. Non è un’area privata: non inserire informazioni riservate nel piano.

## Decisione visiva e adattamento

Riutilizziamo React 19, Vite, Tailwind 4, Hanken Grotesk, colori `brand-*`, CTA, FAQ, footer e contenuti del sito aggiornato. Il catalogo `src/content/landingCopy.ts` è condiviso con la home: lo spostamento dei testi non ne cambia il contenuto. La raccomandazione UI generata è stata adattata al brand esistente, senza aggiungere font o dipendenze.

| Figma B2B V2 | Adattamento DeliR |
| --- | --- |
| Hero scura, testo + visual | Hero con testi attuali, lista d’attesa primaria e pilot secondario |
| Fascia credibilità | Percorso documenti → evidenze → As-Is → To-Be, senza loghi inventati |
| Problema + visual | Problema attuale e spazio video dedicato |
| Prima prova | Demo As-Is, identificata come dimostrativa |
| Tre benefici alternati | Evidenze, lacune e scenari; testo prima del visual su mobile |
| Seconda prova | Review To-Be del caso dimostrativo |
| Confronto | Matrice esistente e collegamenti ai criteri; schede su mobile |
| Come funziona | Tre passaggi del pilot e condizioni esistenti |
| FAQ, CTA, footer | Componenti attuali riutilizzati |

Questa è una base per lavorare su struttura e filmati, non un’affermazione di equivalenza pixel per pixel. Mancano registrazioni definitive e valutazione finale dei testi nelle nuove posizioni. Le prove demo non sono testimonianze o risultati cliente. Le valutazioni competitor sono quelle del catalogo esistente, non una nuova verifica comparativa.

## Cosa registrare

Usa lo stesso caso fittizio di acquisti indiretti per tutte le scene. Ogni filmato deve mostrare un’azione comprensibile e il suo risultato osservabile.

| Slot | Durata | Sequenza |
| --- | --- | --- |
| `hero` | 20–25 s | Progetto → attività e fonte → confronto As-Is / To-Be |
| `problem` | 10–15 s | Documenti/interviste → fonti diverse sullo stesso passaggio → punto da ricostruire |
| `proof-as-is` | 15–20 s | As-Is → attività con evidenza → punto aperto in review |
| `benefit-evidence` | 10–15 s | Attività BPMN → pannello evidenze → fonte leggibile |
| `benefit-gaps` | 10–15 s | Lacuna → soglia non dichiarata → domanda in review |
| `benefit-scenarios` | 15–20 s | As-Is e To-Be → parametri/assunzioni → indicatori demo |
| `proof-decision` | 15–20 s | Modifica proposta → motivazione/evidenza → review |

Il piano esatto per slot è il registro `src/content/landingV2Media.json`, mostrato direttamente nell’anteprima. `npm run media:v2 -- --plan` elenca tutti i file attesi. Le dimensioni sono specifiche di produzione proposte per il sito, non misure estratte dal Figma.

## Desktop e mobile

- Desktop: 1600 × 1000, 16:10. Inquadra il processo e il pannello pertinente.
- Mobile: 1200 × 900, 4:3. Registra o monta un dettaglio dedicato: un’attività, il pannello o un indicatore per volta. Non comprimere l’intero desktop nel telefono.
- Due lingue: registra la UI in italiano e inglese; non affidare la comprensione a testi minuscoli nel filmato.
- Mantieni cursore e interfaccia stabili; niente barre del browser, notifiche o dati reali. Mostra esplicitamente che valori, persone e azienda sono dimostrativi.
- MP4 H.264, pixel format yuv420p, fast start, 24–30 fps, senza traccia audio. WebM VP9 come alternativa.
- Budget per file video: desktop 5 MB, mobile 3 MB. Poster WebP: massimo 200 KB. Il validatore controlla presenza e dimensione dei file; risoluzione, codec, bitrate e qualità vanno verificati nell’editor o con un ispettore media.
- Poster: stesso rapporto del video, frame leggibile che anticipa l’azione. Il player conserva lo spazio per evitare salti di layout.
- VTT: descrivi l’azione e il risultato nei rispettivi intervalli; la descrizione testuale esistente resta disponibile. Se aggiungi audio, prepara sottotitoli fedeli e riesamina l’accessibilità prima dell’attivazione.

## Inserire un video

1. Esporta le quattro combinazioni dispositivo/lingua, con MP4, WebM, poster WebP e VTT per ciascuna.
2. Copia i 16 file in `public/landing-v2/media/`. Esempio: `hero.mobile.it.mp4`, `hero.mobile.it.webp`, `hero.mobile.it.webm`, `hero.mobile.it.vtt`.
3. Nel registro cambia solo quello slot da `planned` a `ready`.
4. Esegui `npm run media:v2`, `npm run lint` e `npm run build`. Un asset mancante in uno slot `ready` blocca il build.
5. Controlla `/v2` e `/v2?lang=en` su telefono e desktop, inclusi play, pausa, sottotitoli ed errore di caricamento.

Non è necessario modificare JSX per ogni nuovo filmato. I file `planned` non vengono richiesti; vengono mostrate le immagini demo esistenti. I file `ready` partono su richiesta con controlli nativi, senza autoplay né download video iniziale. Il breakpoint e la lingua selezionano la variante; cambiandoli il player si reinizializza e resta sotto controllo dell’utente.

## Per completare la landing

Registrare le scene, verificarne leggibilità soprattutto su mobile, rivedere i testi nelle nuove posizioni e decidere quando promuovere la V2 alla home. Questa PR prepara l’anteprima, non cambia la pagina `/` né pubblica una release.

## Verifica locale — 18 ottobre 2026

- `npm run lint`, `npm run typecheck`, `npm run build`: superati.
- `npm run test:coverage -- --pool=threads --maxWorkers=1`: 81 test superati, copertura linee 99,29% sul perimetro configurato. Su questo host Windows il pool predefinito aveva timeout all’avvio; nessuna modifica alla configurazione CI.
- Playwright su `landing-v2`, `hero-layout` e `prerender`, Chromium e Safari mobile: 17 superati; una scansione axe duplicata su Safari saltata intenzionalmente. Verificati layout da 375 a 1440px, menu, attivazione da tastiera, FAQ, lingua, piano video, prerender e assenza di richieste a video pianificati. Gli screenshot vengono salvati in `test-results/`.
- Axe su V2 in modalità studio, 375 e 1440px: nessuna violazione automatica dei criteri A/AA controllati. Non è una certificazione WCAG né una verifica completa con screen reader.
- Lighthouse mobile locale, una misurazione: performance 91, accessibilità 100, best practices 100; LCP 2,92 s, CLS 0. La verifica di indicizzabilità è esclusa perché la pagina è intenzionalmente `noindex`. Sono dati lab della base con immagini statiche; ripetere con i filmati definitivi e raccogliere dati reali dopo il rilascio.
- Il player `ready` è verificato con fixture nei test componenti; i sette video definitivi sono ancora da registrare. Nessuna verifica PHP locale: runtime PHP non disponibile su questo host.
