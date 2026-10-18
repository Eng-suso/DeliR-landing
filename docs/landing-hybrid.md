# DeliR — anteprima ibrida V1 + V2

18 ottobre 2026. Evoluzione della PR #20 dopo il confronto fra la landing attuale e il framework Figma.

## Aprire

- `/`: landing attuale, conservata per confronto.
- `/v2`: nuova anteprima ibrida, IT/EN, prerenderizzata e noindex.
- `/v2?studio=1`: indicazioni di produzione e collegamenti alle registrazioni già disponibili.

La promozione alla home è una decisione successiva. Questa revisione aggiorna l’anteprima e la PR, senza pubblicare una release.

## Composizione

V1 fornisce colori, Hanken Grotesk, superfici, navigazione, demo, spiegazione del problema, Dati e AI, condizioni del pilot, FAQ e footer. Dalla V2 riprendiamo i tre benefici immediatamente leggibili e le sezioni con visual alternati su desktop e prima del testo sotto 1024px.

La hero conserva il titolo e la prima frase del messaggio esistente, seguiti da tre output già presenti nel catalogo. L’opzione `compact` del componente Hero è usata solo nell’anteprima: la home continua a mostrare il paragrafo completo.

I tre benefici visibili sono evidenze, lacune e scenari. Le scene aggiuntive restano nei rispettivi explorer. Contesto e decisioni sono in un approfondimento nativo `details`; gli indirizzi delle scene aprono automaticamente l’approfondimento. Il confronto completo è anch’esso espandibile e mantiene fonti e collegamenti alle demo. I due riepiloghi early access/pilot non sono ripetuti nell’anteprima. C’è una sola CTA dopo i benefici, oltre a navigazione, hero, pilot e chiusura.

La sezione Dati e AI rimane nel percorso principale. Le condizioni commerciali del pilot non cambiano. La lista d’attesa resta primaria; chi ha un progetto reale può accedere al pilot.

## Video

Nessuna nuova registrazione obbligatoria. La hero e i tre benefici usano quattro demo esistenti, con altre scene consultabili. La hero dispone di registrazioni IT/EN; gli altri filmati conservano la UI originale, mentre testi, descrizioni e controlli sono localizzati.

I player esistenti caricano le sorgenti quando entrano nel viewport, rispettano riduzione del movimento e risparmio dati, offrono pausa e dialogo con controlli nativi. Gli approfondimenti chiusi non avviano i video. Non vengono richiesti asset pianificati sotto `/landing-v2/media/`.

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

## Evidenza locale

- Lint, TypeScript, validatore degli export opzionali e build: superati; 16 documenti IT/EN prerenderizzati.
- Vitest: 82 test superati in 13 file, copertura linee 99,29% sul perimetro configurato. Un primo avvio del worker Windows è andato in timeout; la suite completa ripetuta con threads/un worker è passata, senza cambiare la CI.
- Playwright: 19 test distinti superati in Chromium e Safari mobile; scansione axe duplicata su Safari saltata intenzionalmente. Coperti i sette viewport, tre benefici, ordine dei media, deep link, piano IT/EN e sorgenti video reali, menu/Escape, dialogo video, FAQ, regressioni home e prerender. La cattura a pagina intera superava il limite immagini di WebKit: il caso responsive è stato ripetuto con screenshot del viewport e del singolo beneficio, passando in entrambi i browser.
- Axe con piano, approfondimenti e confronto aperti a 375/1440px: nessuna violazione automatica nei criteri A/AA controllati.
- Screenshot in `test-results/`; nessuna richiesta a export opzionali mancanti. I video si basano sul materiale già presente, con gli stessi limiti di leggibilità del montaggio originale.
