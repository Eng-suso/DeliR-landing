# DeliR — anteprima ibrida V1 + V2

18–20 ottobre 2026. Evoluzione della PR #20 dopo il confronto fra la landing attuale e il framework Figma, con identità DeliR applicata alla V2 dopo la ricerca REA.

## Aprire

- `/`: landing attuale, conservata per confronto.
- `/v2`: nuova anteprima ibrida, IT/EN, prerenderizzata e noindex.
- `/v2?studio=1`: indicazioni di produzione e collegamenti alle registrazioni già disponibili.

La promozione alla home è una decisione successiva. Questa revisione aggiorna l’anteprima e la PR, senza pubblicare una release.

## Composizione

La V2 conserva blu DeliR, demo, spiegazione del problema, Dati e AI, condizioni del pilot, FAQ e footer. Usa Hanken Grotesk anche nel corpo, un canvas caldo, cornici chiare e un percorso a quattro nodi come firma visiva. I tre benefici sono immediatamente leggibili, con visual alternati su desktop e prima del testo sotto 1024px. Le regole visuali sono isolate in `landing-hybrid.css`; la home mantiene il suo layout.

L’ibrido usa lo stesso sfondo come superficie statica e scorrimento nativo: non monta i controller di movimento e reveal della V1. Il relativo comando di pausa è omesso perché lo sfondo non è animato. La V1 mantiene effetti e controlli precedenti.

La headline approvata è «Mappa. Analizza. Simula. Migliora.»; la subheadline è «Ricostruisci i processi del cliente, confronta le alternative e porta raccomandazioni sostenute da evidenze.». Sono condivise con la home. La V2 aggiunge i tre output e la cornice workspace alla demo. Il percorso sotto la hero collega Mappa/Evidenze, Analizza/Lacune, Simula/Scenari e Migliora/Review To-Be. Gli approfondimenti si aprono tramite gli anchor esistenti. Il logo e i link prodotto/pilot nel footer restano nella preview e conservano la lingua.

I tre benefici visibili sono evidenze, lacune e scenari. Le scene aggiuntive restano nei rispettivi explorer. Contesto e decisioni sono in un approfondimento nativo `details`; gli indirizzi delle scene aprono automaticamente l’approfondimento. Il confronto completo è anch’esso espandibile e mantiene fonti e collegamenti alle demo. I due riepiloghi early access/pilot non sono ripetuti nell’anteprima. C’è una sola CTA dopo i benefici, oltre a navigazione, hero, pilot e chiusura.

La sezione Dati e AI rimane nel percorso principale. Le condizioni commerciali del pilot non cambiano. La lista d’attesa resta primaria; chi ha un progetto reale può accedere al pilot.

## Video

Nessuna nuova registrazione obbligatoria. La hero e i tre benefici usano quattro demo esistenti, con altre scene consultabili. La hero dispone di registrazioni IT/EN; gli altri filmati conservano la UI originale, mentre testi, descrizioni e controlli sono localizzati.

Nell’ibrido i player caricano il video solo dopo un’azione esplicita, anche senza riduzione del movimento; il poster resta visibile prima del play. Offrono pausa e dialogo con controlli nativi. La V1 mantiene il comportamento precedente. Gli approfondimenti chiusi non avviano i video. Non vengono richiesti asset pianificati sotto `/landing-v2/media/`. Il layout fuori schermo usa il rendering differito già presente nella V1; i controlli geometrici materializzano le sezioni scorrendole prima delle misure.

Il registro a sette slot e il suo validatore restano infrastruttura opzionale per nuovi export. La guida `landing-v2-video-guide.md` e il registro `landing-v2-figma-alignment.md` descrivono la precedente esplorazione Figma; non rappresentano più la composizione attiva di `/v2`.

## Accettazione

- Tre benefici leggibili senza cambiare modulo; nessun video o testimonianza inventata.
- Mobile/tablet: media prima del testo nei benefici; hero con azione prima del video. Desktop: visual alternati.
- Nessun overflow a 320, 375, 414, 768, 834, 1024 e 1440px.
- Menu, Escape, approfondimenti, FAQ e dialogo video utilizzabili da tastiera.
- Scene di approfondimento e confronto raggiungibili da URL diretto.
- Piano consultabile in IT/EN con collegamenti a registrazioni esistenti.
- Lint, TypeScript, build, regressioni home/prerender, verifiche browser e axe prima di aggiornare la PR.

I risultati di conversione non sono ancora misurati. I controlli automatici non equivalgono a una certificazione WCAG o a una verifica completa con screen reader.

## Verifica dell'identità DeliR — 20 ottobre

- Lint, TypeScript e build passati; 82 test unitari/componenti passati.
- 21 test browser distinti passati tra Chromium e Safari mobile; axe duplicato su Safari saltato intenzionalmente. Coperti sette viewport, il nuovo percorso con Enter, gli anchor e la review espandibile, logo/footer nella V2 IT/EN, menu/Escape, video reali, FAQ, home e HTML senza JavaScript.
- Axe a 375/1440 px con studio e approfondimenti aperti: nessuna violazione A/AA automatica nei criteri controllati dopo correzione del contrasto delle note e sfondo esplicito delle schede del problema. Non equivale a una verifica completa con tecnologie assistive.
- Nessuna dipendenza, registrazione o font aggiunti. Nessun autoplay nella V2. La documentazione di ricerca e la matrice di applicazione sono in `DESIGN.md`.
- Lighthouse mobile locale, una misura sulla build finale: performance 91, accessibilità 100, best practices 100; LCP 2,80 s, CLS 0. Budget configurati passati. Il target LCP di 2,5 s non è raggiunto in questa misura. L'indicizzabilità è esclusa per il noindex intenzionale; non sono dati sul campo o risultati SEO/conversione.

## Evidenza locale precedente — 18–19 ottobre

- Lint, TypeScript, validatore degli export opzionali e build: superati; 16 documenti IT/EN prerenderizzati.
- Vitest: 82 test superati in 13 file, copertura linee 99,29% sul perimetro configurato. Un primo avvio del worker Windows è andato in timeout; la suite completa ripetuta con threads/un worker è passata, senza cambiare la CI.
- Playwright: 19 test distinti superati in Chromium e Safari mobile; scansione axe duplicata su Safari saltata intenzionalmente. Coperti i sette viewport, tre benefici, ordine dei media, deep link, piano IT/EN e sorgenti video reali, menu/Escape, dialogo video, FAQ, regressioni home e prerender. La cattura a pagina intera superava il limite immagini di WebKit: il caso responsive è stato ripetuto con screenshot del viewport e del singolo beneficio, passando in entrambi i browser.
- Axe con piano, approfondimenti e confronto aperti a 375/1440px: nessuna violazione automatica nei criteri A/AA controllati.
- Screenshot in `test-results/`; nessuna richiesta a export opzionali mancanti. I video si basano sul materiale già presente, con gli stessi limiti di leggibilità del montaggio originale.
- Ottimizzazione del 19 ottobre: video su richiesta, caricamento esplicito del poster quando il riquadro entra in vista (anche con i ritagli mobile Safari), sfondo statico e scorrimento nativo nell’ibrido. La misura Lighthouse mobile finale dà performance 91, accessibilità 100 e best practices 100, LCP 2,85s e CLS 0. Tutti i budget configurati passano. L’indicizzabilità è esclusa perché l’anteprima è intenzionalmente noindex. Sono dati lab locali di una misurazione, non Core Web Vitals sul campo; ripetere se cambiano filmati o servizi attivati.
- La prima misura dell’ibrido con autoplay e rendering completo dava performance 54 e circa 3,7MB trasferiti. Il passaggio ai video su richiesta ha portato il trasferimento iniziale a circa 222KB; la rimozione dei controller di movimento ha chiuso il controllo prestazioni. La V1 conserva autoplay e controller originali.
- Nell’ultima misura il Total Blocking Time è 175ms, rispetto ai circa 3.870ms della prima revisione. Il confronto resta diagnostica lab locale, non una garanzia sulle prestazioni dei dispositivi reali.
