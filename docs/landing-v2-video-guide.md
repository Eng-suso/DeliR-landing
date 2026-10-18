# DeliR — struttura Figma V2 e produzione video

Riferimento: [ThrillX, B2B / General Landing Page V2](https://www.figma.com/design/Rf0YJB4UQpWiOsuhuMFesX/Public-Landing-Page---ThrillX?node-id=0-1).

## Aprire e confrontare

Esegui `npm ci`, poi `npm run dev -- --host 127.0.0.1`. Apri l’indirizzo stampato dal terminale seguito da:

- `/`: sito attuale.
- `/v2`: scheletro completo nella struttura scelta.
- `/v2?studio=1`: stesso sito con piano video, durate, inquadrature e file attesi.
- `/v2?studio=1&lang=en`: versione inglese del piano.

La toolbar permette di passare fra sito attuale, anteprima e piano. Ridimensionare la finestra cambia realmente il layout. La matrice desktop è visibile da 1024px; sotto questa soglia il confronto mostra sei differenziatori, su due colonne per tablet e una per telefono. I blocchi affiancati diventano verticali sotto 1024px. Il dettaglio delle composizioni e delle misure lette dal riferimento è in `docs/landing-v2-figma-alignment.md`. La pagina V2 è disponibile anche nella build, prerenderizzata in IT/EN e `noindex`, fuori dalla sitemap. Non è un’area privata: non inserire informazioni riservate nel piano.

## Decisione visiva e adattamento

Riutilizziamo React 19, Vite, Tailwind 4, Hanken Grotesk, colori `brand-*`, CTA, FAQ e contenuti del sito aggiornato. Il footer riprende gli stessi collegamenti in una composizione compatta. Il catalogo `src/content/landingCopy.ts` è condiviso con la home: lo spostamento dei testi non ne cambia il contenuto. La raccomandazione UI generata è stata adattata al brand esistente, senza aggiungere font o dipendenze.

| Figma B2B V2 | Adattamento DeliR |
| --- | --- |
| Hero scura, testo + visual | Hero con testi attuali, lista d’attesa primaria e pilot secondario |
| Fascia credibilità | Percorso documenti → evidenze → As-Is → To-Be, senza loghi inventati |
| Problema + visual | Problema attuale e spazio video dedicato |
| Prima prova | Demo As-Is su desktop; un media e due immagini demo di supporto su mobile |
| Tre benefici alternati | Evidenze, lacune e scenari; visual prima del testo su mobile |
| Seconda prova | Review To-Be del caso dimostrativo |
| Confronto | Matrice esistente su desktop; sei differenziatori collegati ai criteri su mobile |
| Come funziona | Tre passaggi del pilot e condizioni esistenti |
| FAQ, CTA, footer | FAQ e testi condivisi, composizione V2; visual finale solo mobile |

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

Il piano esatto per slot è il registro `src/content/landingV2Media.json`, mostrato direttamente nell’anteprima. `npm run media:v2 -- --plan` elenca tutti i file attesi. Le dimensioni di export sono specifiche di produzione: il visual hero desktop riprende il rapporto 637:530 letto nel Figma; gli altri rapporti sono stimati dalla composizione visiva e sono documentati come tali.

## Desktop e mobile

| Slot | Export desktop | Export mobile |
| --- | --- | --- |
| `hero` | 1274 × 1060 | 1472 × 856 |
| `problem` | 1274 × 800 | Non richiesto: visual omesso nel layout mobile |
| `proof-as-is`, `proof-decision` | 2606 × 640 | 1472 × 1256 |
| Tre `benefit-*` | 1200 × 1200 | 1472 × 1136 |

- Le prove desktop sono una fascia larga: monta un dettaglio orizzontale leggibile. Sul mobile puoi riprendere la stessa azione con il dettaglio aperto, senza comprimere l’intero desktop.
- I benefici desktop usano un visual quadrato; quelli mobile un riquadro più largo. Inquadra attività e pannello pertinenti al messaggio.
- Per `problem` basta il desktop anche quando lo slot diventa `ready`: il piano mobile usa la variante desktop, senza richiedere file inesistenti.
- Due lingue: registra la UI in italiano e inglese; non affidare la comprensione a testi minuscoli nel filmato.
- Mantieni cursore e interfaccia stabili; niente barre del browser, notifiche o dati reali. Mostra esplicitamente che valori, persone e azienda sono dimostrativi.
- MP4 H.264, pixel format yuv420p, fast start, 24–30 fps, senza traccia audio. WebM VP9 come alternativa.
- Budget per file video: desktop 5 MB, mobile 3 MB. Poster WebP: massimo 200 KB. Il validatore controlla presenza e dimensione dei file; risoluzione, codec, bitrate e qualità vanno verificati nell’editor o con un ispettore media.
- Poster: stesso rapporto del video, frame leggibile che anticipa l’azione. Il player conserva lo spazio per evitare salti di layout.
- VTT: descrivi l’azione e il risultato nei rispettivi intervalli; la descrizione testuale esistente resta disponibile. Se aggiungi audio, prepara sottotitoli fedeli e riesamina l’accessibilità prima dell’attivazione.

## Inserire un video

1. Esporta le combinazioni dispositivo/lingua elencate dal piano, con MP4, WebM, poster WebP e VTT per ciascuna. Per `problem` sono richiesti solo desktop IT/EN.
2. Copia i 16 file per slot (8 per `problem`) in `public/landing-v2/media/`. Esempio: `hero.mobile.it.mp4`, `hero.mobile.it.webp`, `hero.mobile.it.webm`, `hero.mobile.it.vtt`.
3. Nel registro cambia solo quello slot da `planned` a `ready`.
4. Esegui `npm run media:v2`, `npm run lint` e `npm run build`. Un asset mancante in uno slot `ready` blocca il build.
5. Controlla `/v2` e `/v2?lang=en` su telefono e desktop, inclusi play, pausa, sottotitoli ed errore di caricamento.

Non è necessario modificare JSX per ogni nuovo filmato. I file `planned` non vengono richiesti; vengono mostrate le immagini demo esistenti. I file `ready` partono su richiesta con controlli nativi, senza autoplay né download video iniziale. Il breakpoint e la lingua selezionano la variante; cambiandoli il player si reinizializza e resta sotto controllo dell’utente.

## Per completare la landing

Registrare le scene, verificarne leggibilità soprattutto su mobile, rivedere i testi nelle nuove posizioni e decidere quando promuovere la V2 alla home. Questa PR prepara l’anteprima, non cambia la pagina `/` né pubblica una release.

## Verifica locale — 18 ottobre 2026

- `npm run lint`, `npm run typecheck`, `npm run build`: superati.
- `npm run test:coverage -- --pool=threads --maxWorkers=1`: 82 test superati, copertura linee 99,29% sul perimetro configurato. Su questo host Windows il pool predefinito aveva timeout all’avvio; nessuna modifica alla configurazione CI.
- Playwright su `landing-v2`, `hero-layout` e `prerender`, Chromium e Safari mobile: 17 superati; una scansione axe duplicata su Safari saltata intenzionalmente. Verificati layout da 320 a 1440px, menu, attivazione da tastiera, FAQ, lingua, piano video, prerender e assenza di richieste a video pianificati. Gli screenshot vengono salvati in `test-results/`.
- Axe su V2 in modalità studio, 375 e 1440px: nessuna violazione automatica dei criteri A/AA controllati. Non è una certificazione WCAG né una verifica completa con screen reader.
- Lighthouse mobile locale della revisione responsive, una misurazione: performance 94, accessibilità 100, best practices 100; LCP 2,76 s, CLS 0. La verifica di indicizzabilità è esclusa perché la pagina è intenzionalmente `noindex`. Sono dati lab con immagini statiche; ripetere con i filmati definitivi e raccogliere dati reali dopo il rilascio.
- Il player `ready` è verificato con fixture nei test componenti; i sette video definitivi sono ancora da registrare. Nessuna verifica PHP locale: runtime PHP non disponibile su questo host.
