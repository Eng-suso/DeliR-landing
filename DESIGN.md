# DeliR — ricerca degli stili e direzione di design

Ricerca e applicazione del **20 ottobre 2026**, branch `codex/figma-v2-framework`. La direzione DeliR è applicata all'anteprima **`/v2` nella PR #20**. La home mantiene il suo layout; headline e subheadline approvate rimangono invariate. Nessun merge o rilascio è stato eseguito.

## Direzione consigliata

Una landing chiara per consulenti BPM e Operations: spazio, tipografia leggibile, demo reali e raccomandazioni sostenute da evidenze. Conservare il blu e l'identità DeliR. Prendere dai riferimenti le regole di composizione, senza riprodurre la loro identità.

| Riferimento analizzato | Principio utile per DeliR | Applicazione proposta |
| --- | --- | --- |
| [Apple](https://www.apple.com/) | Poche priorità visive, grandi superfici, prodotto protagonista | Un messaggio e una demo per sezione; CTA principale riconoscibile; spazio fra i passaggi. |
| [SAP Signavio](https://www.signavio.com/) | Gerarchia enterprise e spiegazione del percorso | Titoli espliciti, passaggi comprensibili, rassicurazioni su metodo e dati. |
| [beSharp](https://www.besharp.it/) | Tipografia decisa e voce riconoscibile | Una headline incisiva; contrasto e ritmo senza aggiungere famiglie decorative o video di repertorio. |
| [ProcessMind](https://processmind.com/) | Benefici, demo e progressione del prodotto | Mostrare il lavoro del consulente dal materiale iniziale agli scenari e alla raccomandazione. |
| [Celonis](https://www.celonis.com/) | Scala tipografica, contrasto e collegamento fra prodotto e risultato | Gerarchia forte e prove vicine alle affermazioni; risultati cliente solo quando verificati. |

Questa sintesi è una scelta progettuale, non una conclusione misurata su conversioni o posizionamento dei concorrenti. La raccomandazione della skill `ui-ux-pro-max` converge su gerarchia semplice, tre benefici e una CTA primaria. Le sue proposte generiche di nuovi font/palette non sostituiscono l'identità già presente nel repository.

## Cosa è stato misurato

**Risorse caricate:** REA MCP `capture_browser_scenario`, Chrome in profilo temporaneo, storage vuoto, `en-US`, schema colore light, motion normale, viewport desktop **1440 × 1000** e mobile **390 × 844**. Per ogni homepage: caricamento, attesa di 2,5 secondi, tasto End e attesa di 1,5 secondi. Nessun login o invio di form. REA era già collegato; nessuna configurazione MCP è stata cambiata.

**Lettura CSS:** ogni URL stylesheet osservato è stato richiesto separatamente via HTTP con user agent Chrome e analizzato con PostCSS. Sono inclusi gli eventuali `@import` individuati e gli style tag inline della rilevazione desktop. HTTP, dimensione e SHA-256 identificano questa seconda lettura; non dimostrano identità byte per byte con la precedente transazione REA. Tutte le 39 risorse stylesheet osservate sono state lette con successo, senza errori di parsing. I fogli di widget esterni sono inclusi e riconoscibili dall'URL.

**Stili applicati:** lettura DOM/computed style attraverso il browser con `cua_repl`, a 1440 e 390 px, in una sessione distinta da REA. Lo snapshot ProcessMind ha tema **dark** (`html.dark`); gli altri rispecchiano lo stato iniziale osservato. Geolocalizzazione, banner paese, cookie e animazioni possono influire sui conteggi. Le frequenze DOM non vanno considerate una fotografia dello stesso istante della cattura di rete.

### Come leggere le frequenze

- **D / M:** numero di elementi nel layout desktop/mobile con quel valore calcolato. Per font, peso, dimensione, interlinea, tracking e colore del testo si contano soltanto gli elementi che possiedono un nodo di testo diretto non vuoto. Un titolo diviso in più span può contare più volte.
- Per sfondi, ombre e motion si contano gli elementi con rettangolo di layout, `display` diverso da none e `visibility` diversa da hidden. Non è una misura dei pixel visibili: include contenuto sotto la piega, frammenti ritagliati e interfacce cookie. Esclude pseudo-elementi, canvas e contenuto interno agli iframe.
- **CSS:** occorrenze della dichiarazione nel corpus letto, una per dichiarazione. Un selettore raggruppato conta una volta; media query, regole hover e utility non utilizzate rimangono comprese. I valori `var(...)` restano espressioni, senza fingere di risolvere la cascade di ogni breakpoint.
- I raggi DOM riportati sono quelli dell'angolo superiore sinistro; i file JSON includono tutte le proprietà di raggio dichiarate nei CSS. Le ombre multilivello sono conservate intere.
- I pesi computed non provano quale file o sintesi abbia disegnato ciascun glifo. Le famiglie `Gotham-Ultra`, per esempio, non autorizzano a dedurre un peso numerico dal nome. ProcessMind ha anche testo computed a 300 pur dichiarando face principali a 400/500/600/700.
- I tempi CSS possono essere durate **o ritardi**, anche multipli. I valori computed di transition/animation sono separati nei JSON. Non sono state ricostruite timeline JavaScript, GSAP, video o tutti gli stati hover/menu.
- Le tabelle seguenti mostrano i valori principali; i JSON collegati contengono **tutti i valori e conteggi raccolti**, font face, variabili, font shorthand, line-height, letter-spacing, sorgenti e alcuni selettori di riscontro.

### Limiti di completezza

Il censimento riguarda queste cinque homepage e gli scenari dichiarati, non tutti gli URL o gli stati possibili dei siti. REA classifica gli scenari Apple, beSharp e ProcessMind come completi entro la finestra; Signavio e Celonis come **incompleti nella sezione events**, senza omissioni di budget dichiarate. Tutti gli URL CSS/font individuati in tali scenari hanno una risposta 200 osservata. Questo non dimostra che non possano caricarsi altre risorse dopo la finestra o dopo interazioni diverse. L'inventario mantiene le limitazioni e gli Evidence ID originali.

Nessun file font, logo, fotografia, video, marchio grafico o intero stylesheet dei riferimenti è aggiunto al progetto. I nomi dei marchi/font e gli URL sono riportati per attribuzione e analisi. Le metriche sono descrittive; non attestano licenze di riutilizzo. Non sono stati letti o copiati i binari dei font: famiglia e pesi derivano dai CSS e dagli stili calcolati.

## Specifica proposta per DeliR

Questi sono token e regole di progetto, non valori attribuiti ai concorrenti. I valori esistenti citati sono in `src/index.css` e `src/styles/premium-landing.css`; l'applicazione specifica per V2 è isolata in `src/styles/landing-hybrid.css`. Le scale qui indicate sono obiettivi di design; i valori implementati esatti sono nel CSS.

### Tipografia e colore

| Ruolo | Specifica proposta | Origine |
| --- | --- | --- |
| Titoli | Hanken Grotesk Variable, peso 500 per hero e capitoli, 600 per azioni | Font già presente nel progetto. Nessun font scaricato dai riferimenti. |
| Testo | Hanken Grotesk Variable anche per il corpo nella V2, pesi 400/600 | Unifica il linguaggio tipografico usando il font già presente. La home mantiene lo stack di sistema. Nessun download di SF Pro o Gotham. |
| H1 | Circa 37–84 px sotto 1024px; 42–64 px desktop, line-height 1,02–1,04 | Scala fluida: quattro verbi su due righe con il visual affiancato su desktop. |
| H2 | 38–72 px, line-height 1,04, tracking −0,055em | Capitoli distinti da titoli interni delle demo (32–48 px). |
| Corpo | 16 px mobile, 18 px desktop, line-height 1,55–1,7; colonna fino a circa 65 caratteri | Leggibilità e scansione. |
| Label/nota | 12–14 px, line-height almeno 1,4; nessuna informazione indispensabile soltanto in piccolo | Target di progetto, non valore ricavato dalle frequenze dei footer concorrenti. |
| Inchiostro | `#101E2B`, titoli condivisi `#071126`, testo secondario `#4D5C68` | Token V2 di lettura, accanto all'ink esistente nei componenti condivisi. |
| CTA e accento | `#004580`, hover `#003764` | Blu DeliR esistente. |
| Fondi | Carta `#FBFAF7`; prodotto bianco `#FFFFFF`; piano demo e dati `#EAF0F3`; capitoli scuri `#0C283B` | Alternanza per ruolo: apertura, dimostrazione, rassicurazione, chiusura. |
| Bordi | `#CCD5D9`; bordo dello schermo `#E0E6E9` | Separazione editoriale; non sostituiscono focus e stato selezionato. |

La headline resta **«Mappa. Analizza. Simula. Migliora.»**, con audience e subheadline approvate. Il title SEO rimane descrittivo della categoria e del destinatario. La brevità della headline non impone di rendere vaghi metadata, sottotitoli o sezioni.

### Spazio, superfici e motion

| Regola proposta | Valore/uso |
| --- | --- |
| Griglia | Hero: headline, subheadline e CTA a sinistra, visual a destra da 1024px; sotto questa soglia il visual segue le azioni. Benefici alternati desktop, media prima del testo sotto 1024px. |
| Spaziatura | Scala 4/8/12/16/24/32/48/64/96 px; capitoli 72–136 px, chiusura 88–160 px. |
| CTA | Conservare la forma a pillola esistente, target almeno 44 × 44 px, una priorità visiva primaria. |
| Superfici | Nessuna cornice workspace, card per fase o riquadro per output; bordo singolo e raggio 4 px sullo schermo reale. Scene come tab sottolineate, percorso come indice aperto. |
| Ombra | Solo demo hero: `0 12px 36px -24px rgb(12 40 59 / 24%)`. Benefici e output senza ombra. |
| Microinterazioni | 220 ms colore/frecce, 240 ms indicatore di capitolo; aperture piccole 180 ms. |
| Ingressi | 620 ms, translateY 24 px + opacità; hero testuale solo movimento 20 px, ritardi 70/140 ms, copy dei benefici 80 ms. Un IntersectionObserver, nessun loop di scroll. HTML visibile senza JS. |
| Easing | `cubic-bezier(.22, 1, .36, 1)` già nel tema studio; `ease` per feedback semplici. |
| Motion continuo | Non aggiungere marquee, scroll forzato o video automatici soltanto perché presenti nei riferimenti. Rispettare reduced motion e controlli di riproduzione. |

La nuova [verifica REA del comportamento](docs/design-research/motion-followup.md) distingue cambi di stato osservati, dichiarazioni CSS e scelte DeliR. La barra dei tre capitoli segue la lettura, resta sotto la navigazione e usa sottolineatura più `aria-current`. Gli anchor attivati dall'utente scorrono in modo nativo e fluido; URL diretti e preferenza reduced motion restano immediati.

### Struttura e prove

Conservare la direzione ibrida già presente in `/v2`: hero e demo, tre benefici principali, metodo/evidenze, fiducia sui dati, pilot e FAQ. Gli approfondimenti possono restare progressivi, ma destinatario, funzionamento, risultati consegnabili e limiti devono essere spiegati in HTML leggibile.

Le registrazioni DeliR fanno vedere input, modello, alternative e decisioni. Accanto alle demo esplicitare cosa è osservato, cosa è simulato e cosa deve validare il consulente. Le prove sociali dei riferimenti non appartengono a DeliR: non trasferire loghi clienti, percentuali, riconoscimenti o testimonianze.

## Google e citazioni in ChatGPT

Il design sostiene la leggibilità; ranking e citazioni richiedono anche accesso tecnico, contenuto utile e prove originali. Non sono garantiti.

1. **Pubblicazione corretta:** la preview `/v2` è intenzionalmente `noindex`, anche nell'header PHP. Non va indicizzata durante la ricerca. Al rilascio portare il design sulla URL canonica e verificare HTML iniziale IT/EN, 200/404, canonical, hreflang, sitemap e crawl sul deployment effettivo.
2. **Contenuti originali:** preparare esempi As-Is/To-Be, spiegazione delle assunzioni di simulazione, metodo, limiti e confronti datati con fonti primarie. Rendere disponibili le informazioni essenziali anche senza riprodurre il video. Autore e prove devono essere reali.
3. **Accesso ai crawler:** verificare Googlebot e OAI-SearchBot anche a livello CDN/WAF. `OAI-SearchBot` e `GPTBot` riguardano rispettivamente ricerca e potenziale training e si controllano separatamente. Questa ricerca non cambia tali politiche.
4. **Misurazione:** usare Search Console, i report AI disponibili e i referral ChatGPT, insieme alle conversioni pertinenti. Non scambiare un controllo manuale su qualche prompt per una misura complessiva della citabilità.

Google non richiede un file AI, `llms.txt` o uno schema speciale per accedere alle funzioni AI. Anche per ChatGPT l'accessibilità non garantisce che una pagina venga selezionata o citata. Fonti: [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [requisiti tecnici Google](https://developers.google.com/search/docs/essentials/technical), [crawler OpenAI](https://developers.openai.com/api/docs/bots), [FAQ publisher OpenAI](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq).

Il [piano SEO con evidenze del repository](docs/design-research/seo-visibility.md) distingue quanto già esiste dalle verifiche ancora necessarie. Include anche il rischio di portabilità fra il routing Apache/PHP e il fallback SPA del Worker: la presenza del prerender nella build non prova che qualsiasi hosting lo serva correttamente.

## Applicazione nella PR #20

| Punto di forza adattato | Comportamento DeliR implementato | File |
| --- | --- | --- |
| Gerarchia e prodotto protagonista | Hanken per titoli e corpo; blocco testuale a sinistra e demo a destra, senza chrome aggiunto. Subheadline precedente ripristinata in IT/EN nella V2. Riproduzione su richiesta. | `src/components/Hero.tsx`, `src/styles/landing-hybrid.css` |
| Un percorso comprensibile | Quattro passaggi collegati alle sezioni e alla review To-Be. L'ultimo apre l'approfondimento necessario; non è una tab decorativa o un'interfaccia finta. | `src/components/v2/HybridProcessPath.tsx`, `src/content/hybridExperience.ts` |
| Prove e risultato del lavoro vicini | Tre benefici aperti, demo grandi, tab sottolineate, output tipografico, barra capitoli che segue la lettura. | `src/components/v2/HybridJourney.tsx` |
| Identità coerente | Carta calda, bianco prodotto, piano grigio azzurro e capitoli navy; blu per azioni, ultima riga hero e selezioni. Nessun asset dei riferimenti. | `src/styles/landing-hybrid.css` |
| Ritmo e movimento | Ingressi una volta, stessa curva e piccoli ritardi; anchor fluidi, nessuna inerzia artificiale; reduced motion e fallback senza JS. | `src/components/v2/V2Motion.tsx`, `src/components/FragmentNavigation.tsx` |
| Navigazione prevedibile | Logo e link prodotto/pilot del footer restano nella V2 e conservano la lingua; barra di confronto separata dalla navigazione prodotto. | `src/pages/LandingV2Page.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx` |
| Accessibilità e performance | Anchor reali, focus visibile, ordine coerente, note più contrastate sul blu, reduced motion e nessun nuovo runtime o font. | `e2e/landing-hybrid.spec.ts`, CSS isolato V2 |

Verifiche del 20 ottobre: 82 test unitari/componenti passati; regressioni home/HTML iniziale passate. I 13 casi V2 passano tra Chromium e Safari mobile, con un axe duplicato su Safari saltato intenzionalmente: sette viewport, capitoli, anchor, tastiera, video reali e cambio della preferenza reduced motion. Axe a 375/1440 px con contenuti espansi non rileva violazioni A/AA automatiche nei criteri controllati. Non è una certificazione WCAG né una verifica completa con screen reader. La verifica prestazioni di questa revisione è registrata in `docs/landing-hybrid.md`. Il piano SEO rimane una proposta, senza modifica a robots o promozione della preview.

## Evidenze misurate per riferimento

Le sezioni sotto sono osservazioni. Non sono una specifica da copiare integralmente.

### Quadro delle risorse

| Sito | CSS di rete unici | URL font richiesti | Dichiarazioni CSS lette | Face dichiarate | Elementi testo D / M |
| --- | ---: | ---: | ---: | ---: | ---: |
| Apple | 10 | 9 | 10440 | 81 | 343 / 276 |
| SAP Signavio | 1 | 2 | 5900 | 4 | 135 / 129 |
| beSharp | 8 | 17 | 16717 | 24 | 152 / 139 |
| ProcessMind | 1 | 4 | 6085 | 16 | 251 / 246 |
| Celonis | 19 | 1 | 4195 | 4 | 208 / 207 |

Sono **39 URL stylesheet** e **33 URL font** osservati complessivamente, deduplicati per sito fra desktop/mobile. Apple richiede una variante bold diversa fra desktop e mobile: gli otto URL per singolo viewport diventano nove nell’unione. Le face dichiarate non equivalgono a file caricati: includono fallback locali, icone e pesi non richiesti. L’inventario completo è in [resource-inventory.json](docs/design-research/resource-inventory.json).

### Apple

Pagina: [https://www.apple.com/](https://www.apple.com/). Dati completi: [apple-styles.json](docs/design-research/apple-styles.json).

La titolazione principale delle unità prodotto usa anche H2 a 56 px desktop; un H1 tecnico nella pagina non va assunto come headline della hero. Gli stack SF Pro e gli icon font sono riferimenti osservati, non font da acquisire per DeliR. Il footer esteso spiega il numero elevato di testi a 12 px.

**Font face dichiarate nei CSS**

| Famiglia | Pesi dichiarati | Face |
| --- | --- | ---: |
| "Apple Legacy Chevron" | 100, 200, 300, 400, 500, 600, 700, 800, 900 | 9 |
| "Apple Icons 100" | non specificato | 1 |
| "Apple Icons 200" | non specificato | 1 |
| "Apple Icons 300" | non specificato | 1 |
| "Apple Icons 400" | non specificato | 1 |
| "Apple Icons 500" | non specificato | 1 |
| "Apple Icons 600" | non specificato | 1 |
| "Apple Icons 700" | non specificato | 1 |
| "Apple Icons 800" | non specificato | 1 |
| "Apple Icons 900" | non specificato | 1 |
| 'SF Pro Display' | 100, 200, 300, 400, 500, 600, 700, 800, 900 | 18 |
| 'SF Pro Text' | 100, 200, 300, 400, 500, 600, 700, 800, 900 | 18 |
| 'SF Pro Icons' | 100, 200, 300, 400, 500, 600, 700, 800, 900 | 9 |
| "Apple Legacy Icons" | 100, 200, 300, 400, 500, 600, 700, 800, 900 | 9 |
| "Apple Legacy Icons 100" | non specificato | 1 |
| "Apple Legacy Icons 200" | non specificato | 1 |
| "Apple Legacy Icons 300" | non specificato | 1 |
| "Apple Legacy Icons 400" | non specificato | 1 |
| "Apple Legacy Icons 500" | non specificato | 1 |
| "Apple Legacy Icons 600" | non specificato | 1 |
| "Apple Legacy Icons 700" | non specificato | 1 |
| "Apple Legacy Icons 800" | non specificato | 1 |
| "Apple Legacy Icons 900" | non specificato | 1 |

**Famiglie applicate — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Apple Legacy Chevron", "Helvetica Neue", Helvetica, Arial, sans-serif | 230 | 166 |
| "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif | 69 | 74 |
| "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif | 41 | 33 |
| "SF Pro Text", "Myriad Set Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Icons", "Apple Legacy Icons", "Helvetica Neue", Helvetica, Arial, sans-serif | 3 | 3 |

**Pesi applicati — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 400 | 304 | 235 |
| 600 | 32 | 34 |
| 700 | 7 | 7 |

**Dimensioni del testo — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 12px | 242 | 185 |
| 14px | 30 | 28 |
| 17px | 26 | 26 |
| 21px | 25 | 0 |
| 28px | 6 | 11 |
| 40px | 6 | 0 |
| 56px | 3 | 0 |
| 10px | 2 | 2 |
| 19px | 1 | 13 |
| 25.5px | 1 | 1 |
| 34px | 1 | 1 |
| 32px | 0 | 9 |

**Colori del testo principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| rgba(0, 0, 0, 0.56) | 112 | 112 |
| rgba(0, 0, 0, 0.72) | 103 | 39 |
| #F5F5F7 | 32 | 32 |
| #000000 | 19 | 19 |
| #1D1D1F | 18 | 15 |
| #0066CC | 16 | 16 |

Altri 5 valori nel JSON completo.

**Sfondi principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #F5F5F7 | 26 | 37 |
| #000000 | 23 | 23 |
| #0071E3 | 9 | 9 |
| #FAFAFC | 2 | 2 |
| #9FC6F4 | 1 | 1 |
| #C69851 | 1 | 1 |
| #F4F8FB | 1 | 1 |
| #1D1D1F | 1 | 1 |

Altri 7 valori nel JSON completo.

**Raggi non nulli, angolo superiore sinistro — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 980px | 34 | 34 |
| 8px | 4 | 4 |
| 11px | 1 | 1 |
| 50% | 1 | 1 |
| 999px | 1 | 1 |

**Ombre dichiarate principali — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| 3px 5px 30px rgba(0,0,0,.22) | 1 |

**Durate delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 0.4s | 18 | 18 |
| 0.32s | 15 | 15 |
| 0.24s | 12 | 12 |
| 0.25s | 7 | 7 |
| 0.3s | 2 | 13 |
| 0.24s, 0.24s | 2 | 5 |
| 0.1s | 2 | 2 |
| 1s, 1s, 1s, 1s, 1s | 2 | 2 |
| 0.32s, 0.32s | 0 | 1 |
| 0.422s | 0 | 1 |

**Easing delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| cubic-bezier(0.4, 0, 0.6, 1) | 27 | 17 |
| ease | 18 | 29 |
| linear | 8 | 8 |
| cubic-bezier(0.25, 0.1, 0.3, 1) | 3 | 3 |
| ease-in-out, ease-in-out, ease-in-out, ease-in-out, ease-in-out | 2 | 2 |
| cubic-bezier(0.4, 0, 0.6, 1), steps(1, start) | 1 | 4 |

Altri 2 valori nel JSON completo.

**Durate delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| Nessun valore non nullo rilevato | 0 | 0 |

**Easing delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| Nessun valore non nullo rilevato | 0 | 0 |

**Tempi letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| .24s | 58 |
| 0s | 38 |
| 80ms | 36 |
| 250ms | 28 |
| 20ms | 27 |

**Easing letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| ease-in-out | 84 |
| cubic-bezier(.4,0,.6,1) | 78 |
| linear | 41 |
| cubic-bezier(0.4, 0, 0.6, 1) | 17 |
| ease-out | 16 |

Evidence REA desktop/mobile: `ev_f7093a0eb4c6a5b1e482c19b0c2f5eec022739c5ef169e85aa13233f9139a81a`, `ev_ac06d68958da50029339a1956794b926780331314e18cd82764ea81a72fbef91`.

### SAP Signavio

Pagina: [https://www.signavio.com/](https://www.signavio.com/). Dati completi: [signavio-styles.json](docs/design-research/signavio-styles.json).

72brand è la famiglia principale osservata. Benton Sans proviene dall’interfaccia di consenso, non va assunto come scelta tipografica editoriale del prodotto. Il campo peso assente in @font-face non prova che il binario sia un font variabile.

**Font face dichiarate nei CSS**

| Famiglia | Pesi dichiarati | Face |
| --- | --- | ---: |
| "72brand" | non specificato | 1 |
| SAP-icons | 400 | 1 |
| "Benton-Sans-Bold" | non specificato | 1 |
| "Benton-Sans-Regular" | non specificato | 1 |

**Famiglie applicate — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| "72brand", Arial, Helvetica, sans-serif | 118 | 112 |
| Benton-Sans-Regular | 17 | 17 |

**Pesi applicati — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 400 | 83 | 77 |
| 500 | 46 | 46 |
| 300 | 6 | 6 |

**Dimensioni del testo — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 16px | 37 | 35 |
| 14px | 36 | 32 |
| 20px | 18 | 18 |
| 12px | 14 | 14 |
| 18px | 13 | 13 |
| 13px | 6 | 6 |
| 36px | 4 | 4 |
| 30px | 3 | 4 |
| 24px | 3 | 3 |
| 48px | 1 | 0 |

**Colori del testo principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #000000 | 77 | 77 |
| #0040B0 | 13 | 12 |
| #666666 | 12 | 12 |
| #1B90FF | 9 | 9 |
| #FFFFFF | 7 | 6 |
| #475E75 | 5 | 1 |

Altri 8 valori nel JSON completo.

**Sfondi principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #FFFFFF | 27 | 24 |
| #D5DADD | 4 | 5 |
| #0070F2 | 4 | 3 |
| #000000 | 2 | 2 |
| #1E6A92 | 2 | 2 |
| #F5F6F7 | 1 | 2 |
| #002A86 | 1 | 1 |
| #E2D8FF | 1 | 1 |

Altri 5 valori nel JSON completo.

**Raggi non nulli, angolo superiore sinistro — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 8px | 18 | 14 |
| 12px | 13 | 13 |
| 6px | 2 | 1 |

**Ombre dichiarate principali — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow) | 7 |
| 0 -1px 1px #ddd | 4 |
| 0 1px 1px #eee | 4 |
| none | 3 |

**Durate delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 0.2s | 18 | 12 |

**Easing delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| cubic-bezier(0.4, 0, 0.2, 1) | 16 | 10 |
| ease | 2 | 2 |

**Durate delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 0.2s | 3 | 3 |
| 300s | 1 | 1 |

**Easing delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| ease | 3 | 3 |
| linear | 1 | 1 |

**Tempi letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| 0s | 41 |
| .2s | 31 |
| .5s | 13 |
| .75s | 10 |
| .3s | 8 |

**Easing letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| ease | 46 |
| linear | 16 |
| cubic-bezier(.4,0,.2,1) | 9 |
| ease-out | 4 |
| ease-in | 4 |

Evidence REA desktop/mobile: `ev_10932bf28ab6b974870cbc9da5a220cf8d83413d89a09085a1806c29bf7f8a19`, `ev_c39a992242f662c5b75f368a95708b75ca1a54869222fe00f83e47e3a5c3e0e2`.

### beSharp

Pagina: [https://www.besharp.it/](https://www.besharp.it/). Dati completi: [besharp-styles.json](docs/design-research/besharp-styles.json).

Le famiglie Gotham sono suddivise per nome; Sora è molto presente nel testo. Atomic Marker è un accento decorativo. I pesi CSS nominali delle face e i pesi computed sono riportati separatamente: nessuna ispezione del binario font è stata eseguita. Il corpus include Bootstrap, AOS, Swiper, Font Awesome e reCAPTCHA; le loro regole non sono automaticamente scelte del brand.

**Font face dichiarate nei CSS**

| Famiglia | Pesi dichiarati | Face |
| --- | --- | ---: |
| swiper-icons | 400 | 1 |
| "Font Awesome 6 Brands" | 400 | 1 |
| "Font Awesome 6 Duotone" | 900 | 1 |
| "Font Awesome 6 Pro" | 300, 400, 900, 100 | 4 |
| "Font Awesome 5 Brands" | 400 | 1 |
| "Font Awesome 5 Pro" | 900, 400, 300 | 3 |
| "Font Awesome 5 Duotone" | 900 | 1 |
| "FontAwesome" | non specificato | 4 |
| 'gotham' | normal | 1 |
| 'gotham-black' | normal | 1 |
| 'gotham-bold' | normal | 1 |
| 'gotham-ultra' | normal | 1 |
| 'sora' | normal | 1 |
| 'sora-bold' | normal | 1 |
| 'atomic-marker' | normal | 1 |
| 'atomic-marker-extra' | normal | 1 |

**Famiglie applicate — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| sora, verdana | 69 | 59 |
| gotham-bold, Verdana | 30 | 27 |
| sora-bold, Verdana | 21 | 21 |
| atomic-marker, Arial | 8 | 8 |
| gotham-ultra, Verdana | 7 | 7 |
| gotham-black, Verdana | 6 | 6 |
| sans-serif | 6 | 6 |
| gotham, verdana | 5 | 5 |

**Pesi applicati — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 400 | 90 | 77 |
| 700 | 29 | 29 |
| 500 | 28 | 28 |
| 600 | 5 | 5 |

**Dimensioni del testo — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 16px | 52 | 0 |
| 14px | 46 | 19 |
| 20px | 12 | 0 |
| 14.4px | 7 | 0 |
| 17px | 7 | 0 |
| 80px | 7 | 0 |
| 15px | 6 | 57 |
| 24px | 6 | 0 |
| 48px | 5 | 0 |
| 64px | 2 | 0 |
| 32px | 1 | 0 |
| 96px | 1 | 0 |
| 13.125px | 0 | 25 |
| 18.75px | 0 | 9 |
| 13.5px | 0 | 7 |
| 75px | 0 | 7 |
| 14.0625px | 0 | 6 |
| 30px | 0 | 6 |
| 33.75px | 0 | 2 |
| 45px | 0 | 1 |

**Colori del testo principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #E8E4EC | 98 | 85 |
| #A39CA8 | 17 | 17 |
| #130F19 | 9 | 9 |
| #7531AF | 8 | 8 |
| #D1CCD5 | 7 | 7 |
| #E21380 | 5 | 5 |

Altri 4 valori nel JSON completo.

**Sfondi principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #7531AF | 13 | 13 |
| #130F19 | 12 | 12 |
| #2B2630 | 4 | 4 |
| #FFFFFF | 2 | 5 |
| #A39CA8 | 2 | 2 |
| #E8E4EC | 2 | 2 |
| #D6D6D6 | 1 | 4 |
| #000000 | 1 | 1 |

Altri 2 valori nel JSON completo.

**Raggi non nulli, angolo superiore sinistro — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 6px | 15 | 15 |
| 3.75px | 3 | 0 |
| 30px | 2 | 5 |
| 8px | 1 | 1 |
| 3.51562px | 0 | 3 |

**Ombre dichiarate principali — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| 0 0 0 .25rem rgba(13,110,253,0.25) | 4 |
| 0 0 0 .25rem rgba(var(--bs-success-rgb), 0.25) | 3 |
| 0 0 0 .25rem rgba(var(--bs-danger-rgb), 0.25) | 3 |
| var(--bs-btn-focus-box-shadow) | 3 |

**Durate delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 0.3s | 56 | 56 |
| 0.2s | 52 | 46 |
| 0.3s, 0.3s | 10 | 10 |
| 3s | 2 | 0 |
| 0.5s | 1 | 1 |
| 10s | 1 | 0 |
| 0.5s, 0.5s, 0.55s | 0 | 3 |

**Easing delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| ease | 109 | 103 |
| ease, ease | 10 | 10 |
| linear | 3 | 0 |
| cubic-bezier(0.77, 0.2, 0.05, 1), cubic-bezier(0.77, 0.2, 0.05, 1), ease | 0 | 3 |

**Durate delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| Nessun valore non nullo rilevato | 0 | 0 |

**Easing delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| Nessun valore non nullo rilevato | 0 | 0 |

**Tempi letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| 0.15s | 28 |
| 1s | 16 |
| .2s | 13 |
| .5s | 10 |
| 0s | 8 |

**Easing letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| ease-in-out | 35 |
| ease | 30 |
| linear | 10 |
| ease-out | 6 |
| cubic-bezier(.55,.085,.68,.53) | 3 |

Evidence REA desktop/mobile: `ev_4d13ca8ceb66d82c1120017670026e767ab63aa2535787ff95b9a1ba82f82408`, `ev_fcee5e8ea9681df4fda9dcc73df4ca11bf8f772ab215a5f1b20bba65f19de4b2`.

### ProcessMind

Pagina: [https://processmind.com/](https://processmind.com/). Dati completi: [processmind-styles.json](docs/design-research/processmind-styles.json).

Lo snapshot DOM è in dark mode; i CSS contengono anche il tema chiaro. Poppins usa un alias generato e fallback locali. Le utility Tailwind e le variabili degli anelli producono molte dichiarazioni/ombre che non corrispondono a componenti distinti.

**Font face dichiarate nei CSS**

| Famiglia | Pesi dichiarati | Face |
| --- | --- | ---: |
| Poppins [alias] | 400, 500, 600, 700 | 8 |
| Poppins [alias] fallback\: Arial | 400, 500, 600 | 6 |
| Poppins [alias] fallback\: Arial Bold | 700 | 2 |

**Famiglie applicate — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| Poppins [alias] + fallback Arial/sans-serif | 251 | 246 |

**Pesi applicati — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 300 | 117 | 117 |
| 600 | 57 | 56 |
| 700 | 52 | 52 |
| 400 | 13 | 13 |
| 500 | 12 | 8 |

**Dimensioni del testo — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 14px | 89 | 89 |
| 16px | 69 | 69 |
| 12px | 22 | 22 |
| 20.8px | 15 | 15 |
| 18px | 13 | 12 |
| 72px | 10 | 10 |
| 36.5581px | 8 | 8 |
| 27.04px | 6 | 6 |
| 30px | 5 | 7 |
| 24px | 5 | 5 |
| 20px | 4 | 0 |
| 14.4px | 3 | 3 |
| 48px | 2 | 0 |

**Colori del testo principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #FFFFFF | 92 | 88 |
| oklab(0.999994 0.0000455677 0.0000200868 / 0.6) | 49 | 49 |
| #DCDCDC | 36 | 36 |
| #FE6C19 | 24 | 24 |
| oklab(0.999994 0.0000455678 0.0000200868 / 0.9) | 13 | 13 |
| oklab(0.999994 0.0000455677 0.0000200868 / 0.7) | 9 | 9 |

Altri 12 valori nel JSON completo.

**Sfondi principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #373737 | 37 | 36 |
| oklab(0.999994 0.0000455678 0.0000200868 / 0.05) | 18 | 18 |
| #FE6C19 | 17 | 16 |
| oklab(0.702691 0.141358 0.136229 / 0.1) | 6 | 6 |
| oklab(0.999994 0.0000455678 0.0000200868 / 0.1) | 6 | 6 |
| #1D5BA6 | 6 | 6 |
| oklab(0.999994 0.0000455678 0.0000200868 / 0.2) | 5 | 6 |
| #10A67D | 5 | 5 |

Altri 22 valori nel JSON completo.

**Raggi non nulli, angolo superiore sinistro — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 2.68435e+07px | 45 | 46 |
| 16px | 35 | 35 |
| 8px | 19 | 18 |
| 6px | 9 | 9 |
| 12px | 5 | 5 |
| 24px | 3 | 3 |

**Ombre dichiarate principali — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow) | 55 |
| 0 0 0 25px #fe601900 | 2 |
| 0 0 0 1px var(--tw-prose-kbd-shadows), 0 3px 0 var(--tw-prose-kbd-shadows) | 2 |
| none | 1 |

**Durate delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 0.15s | 78 | 75 |
| 0.4s | 43 | 41 |
| 0.3s | 18 | 14 |
| 0.5s | 7 | 7 |
| 0.2s | 1 | 1 |
| 3s | 0 | 1 |

**Easing delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| cubic-bezier(0.4, 0, 0.2, 1) | 101 | 92 |
| ease | 44 | 43 |
| cubic-bezier(0, 0, 0.2, 1) | 1 | 1 |
| ease-out | 1 | 1 |
| cubic-bezier(0.55, 0.055, 0.675, 0.19) | 0 | 1 |
| linear | 0 | 1 |

**Durate delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 0.3s | 1 | 1 |
| 1s | 0 | 1 |

**Easing delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| ease-out | 1 | 1 |
| ease | 0 | 1 |

**Tempi letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| 0s | 20 |
| .3s | 18 |
| .15s | 15 |
| .4s | 7 |
| .1s | 6 |

**Easing letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| ease | 22 |
| ease-out | 10 |
| ease-in-out | 9 |
| linear | 4 |
| cubic-bezier(.55,.055,.675,.19) | 2 |

Evidence REA desktop/mobile: `ev_431c338457638b05e1a06b3a50d40acb26f9486ae9ec4a853fad79f70eeca689`, `ev_1eae5f1713e60aaf4e046f54435aedbf0b50320b71573d29d16bec217bae5d94`.

### Celonis

Pagina: [https://www.celonis.com/](https://www.celonis.com/). Dati completi: [celonis-styles.json](docs/design-research/celonis-styles.json).

Poppins regular domina lo snapshot; i frammenti della headline animata moltiplicano i conteggi di testo. Il verde acceso è un accento su superfici prevalentemente nere/bianche. Il banner consenso rimane incluso nella rilevazione, e alcune animazioni hanno durate calcolate dinamicamente.

**Font face dichiarate nei CSS**

| Famiglia | Pesi dichiarati | Face |
| --- | --- | ---: |
| Poppins Fallback | 400 | 2 |
| Poppins | 400 | 2 |

**Famiglie applicate — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| Poppins, "Poppins Fallback", helvetica, arial, sans-serif | 208 | 207 |

**Pesi applicati — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 400 | 201 | 200 |
| 700 | 4 | 4 |
| 600 | 3 | 3 |

**Dimensioni del testo — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 16px | 41 | 64 |
| 18px | 36 | 0 |
| 32px | 33 | 21 |
| 24px | 20 | 40 |
| 14px | 18 | 25 |
| 44px | 16 | 16 |
| 80px | 16 | 0 |
| 12px | 9 | 9 |
| 11.382px | 6 | 6 |
| 128px | 6 | 0 |
| 60px | 5 | 6 |
| 20px | 2 | 20 |

**Colori del testo principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #FFFFFF | 89 | 94 |
| #CBCBCB | 33 | 33 |
| #000000 | 33 | 31 |
| rgba(255, 255, 255, 0.4) | 30 | 30 |
| #666666 | 8 | 8 |
| #767676 | 8 | 4 |

Altri 2 valori nel JSON completo.

**Sfondi principali — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| #000000 | 17 | 17 |
| #1D1D1D | 16 | 14 |
| #FFFFFF | 15 | 15 |
| #5CFE50 | 4 | 3 |
| #CBCBCB | 3 | 3 |
| #333333 | 1 | 2 |
| #F5F5F5 | 1 | 1 |
| rgba(0, 0, 0, 0.5) | 1 | 1 |

**Raggi non nulli, angolo superiore sinistro — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 4px | 50 | 52 |
| 2px | 22 | 19 |
| 8px | 4 | 4 |
| 2.5px | 1 | 1 |

**Ombre dichiarate principali — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| 0 0 0 100vh var(--fnd-color-background-base) inset | 9 |
| none | 4 |
| inset 0 0 0 1000px #0003 | 1 |
| 0 6px 6px #00000026 | 1 |

**Durate delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 0.2s | 37 | 27 |
| 0.3s | 34 | 32 |
| 0.15s | 30 | 30 |
| 0.45s, 0.45s | 4 | 4 |
| 1s | 2 | 2 |
| 0.4s | 1 | 1 |
| 1.5s, 1.5s | 1 | 1 |
| 0.4s, 0.4s | 0 | 1 |

**Easing delle transition — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| ease | 55 | 45 |
| ease-in-out | 48 | 46 |
| ease, ease | 4 | 4 |
| cubic-bezier(0, 0.81, 0.36, 0.87) | 1 | 1 |
| ease-in-out, ease-in-out | 1 | 1 |
| cubic-bezier(0, 0.81, 0.36, 0.87), cubic-bezier(0, 0.81, 0.36, 0.87) | 0 | 1 |

**Durate delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| 5.26188s | 2 | 0 |
| 0.4s | 1 | 1 |
| 10.5238s | 0 | 2 |

**Easing delle animation — elementi D / M**

| Valore | D | M |
| --- | ---: | ---: |
| linear | 2 | 2 |
| ease-in-out | 1 | 1 |

**Tempi letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| .4s | 5 |
| 0s | 4 |
| 2.4s | 2 |
| .2s | 1 |
| 1s | 1 |

**Easing letterali nelle dichiarazioni motion — dichiarazioni CSS**

| Valore | Occorrenze |
| --- | ---: |
| ease | 46 |
| cubic-bezier(0,.81,.36,.87) | 5 |
| linear | 3 |
| ease-out | 2 |
| ease-in-out | 1 |

Evidence REA desktop/mobile: `ev_efbe5923b681a17d200f61e183fddf8fd7254103852e445a9fda46ccc76af42d`, `ev_4dcfad05267c241045631c716091dc1e19696d1f23a692fa1e3abe9edbdd3902`.

## Inventario di ogni stylesheet e font osservato

Gli URL font sono riferimenti di rete, non file copiati. Le richieste includono preload, fallback e widget esterni; la presenza di una richiesta non prova che il font abbia disegnato il testo. Le definizioni @font-face e gli URL dichiarati ma non richiesti sono elencati nei JSON per sito.

### Apple — risorse

**Stylesheet**

- [globalheader.css](https://www.apple.com/api-www/global-elements/global-header/v1/assets/globalheader.css)
- [ac-globalfooter.built.css](https://www.apple.com/ac/globalfooter/8/en_US/styles/ac-globalfooter.built.css)
- [ac-localnav.built.css](https://www.apple.com/ac/localnav/9/styles/ac-localnav.built.css)
- [fonts · query preservata](https://www.apple.com/wss/fonts?families=SF+Pro,v3|SF+Pro+Icons,v3)
- [main.built.css](https://www.apple.com/v/homepage/a/styles/main.built.css)
- [homepage.built.css](https://www.apple.com/v/homepage/a/styles/homepage.built.css)
- [home-gallery.built.css](https://www.apple.com/autopush/us/fam-gallery/styles/home-gallery.built.css)
- [inline-media.built.css](https://www.apple.com/v/homepage/a/styles/inline-media.built.css)
- [index_jr6iaf49.built.css](https://www.apple.com/homepage/styles/index_jr6iaf49.built.css)
- [localeswitcher.built.css](https://www.apple.com/ac/localeswitcher/4/it_IT/styles/localeswitcher.built.css)

**Font richiesti (soltanto URL)**

- [sf-pro-text_semibold.woff2](https://www.apple.com/wss/fonts/SF-Pro-Text/v3/sf-pro-text_semibold.woff2)
- [sf-pro-text_regular.woff2](https://www.apple.com/wss/fonts/SF-Pro-Text/v3/sf-pro-text_regular.woff2)
- [sf-pro-display_semibold.woff2](https://www.apple.com/wss/fonts/SF-Pro-Display/v3/sf-pro-display_semibold.woff2)
- [sf-pro-text_regular-italic.woff2](https://www.apple.com/wss/fonts/SF-Pro-Text/v3/sf-pro-text_regular-italic.woff2)
- [sf-pro-display_regular.woff2](https://www.apple.com/wss/fonts/SF-Pro-Display/v3/sf-pro-display_regular.woff2)
- [sf-pro-display_bold.woff2](https://www.apple.com/wss/fonts/SF-Pro-Display/v3/sf-pro-display_bold.woff2)
- [sf-pro-icons_light.woff2](https://www.apple.com/wss/fonts/SF-Pro-Icons/v3/sf-pro-icons_light.woff2)
- [sf-pro-text_light.woff2](https://www.apple.com/wss/fonts/SF-Pro-Text/v3/sf-pro-text_light.woff2)
- [sf-pro-text_bold.woff2](https://www.apple.com/wss/fonts/SF-Pro-Text/v3/sf-pro-text_bold.woff2)

### SAP Signavio — risorse

**Stylesheet**

- [app.css](https://www.signavio.com/css/app.css)

**Font richiesti (soltanto URL)**

- [72Brand.woff2](https://www.signavio.com/fonts/72Brand.woff2)
- [get · query preservata](https://consent.trustarc.com/get?name=Benton-Sans-Regular.ttf)

### beSharp — risorse

**Stylesheet**

- [style.min.css · query preservata](https://www.besharp.it/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/menu-item/style.min.css?ver=1)
- [besharp-home.min.css · query preservata](https://www.besharp.it/wp-content/themes/besharp/assets/css/besharp-home.min.css?ver=3.0)
- [owl.carousel.min.css · query preservata](https://www.besharp.it/wp-content/themes/besharp/assets/css/vendor/owl.carousel.min.css?ver=3.0)
- [owl.theme.default.min.css · query preservata](https://www.besharp.it/wp-content/themes/besharp/assets/css/vendor/owl.theme.default.min.css?ver=3.0)
- [swiper-bundle.min.css · query preservata](https://www.besharp.it/wp-content/themes/besharp/assets/css/vendor/swiper-bundle.min.css?ver=3.0)
- [aos.css · query preservata](https://www.besharp.it/wp-content/themes/besharp/assets/css/vendor/aos.css?ver=3.0)
- [all.min.css · query preservata](https://www.besharp.it/wp-content/themes/besharp/assets/css/all.min.css?ver=3.0)
- [styles__ltr.css](https://www.gstatic.com/recaptcha/releases/4EDjxXf4knsx6UBM1L2V6cv8/styles__ltr.css)

**Font richiesti (soltanto URL)**

- [Gotham-Bold.woff](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Bold.woff)
- [Gotham-Bold.ttf](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Bold.ttf)
- [Gotham-Book.woff](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Book.woff)
- [Gotham-Book.ttf](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Book.ttf)
- [Gotham-Black.woff](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Black.woff)
- [Gotham-Black.ttf](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Black.ttf)
- [Gotham-Ultra.woff](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Ultra.woff)
- [Gotham-Ultra.ttf](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/gotham/Gotham-Ultra.ttf)
- [Sora-Regular.woff](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/sora/Sora-Regular.woff)
- [Sora-Regular.ttf](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/sora/Sora-Regular.ttf)
- [AtomicMarker.ttf](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/atomic/AtomicMarker.ttf)
- [fa-regular-400.woff2](https://www.besharp.it/wp-content/themes/besharp/assets/webfonts/fa-regular-400.woff2)
- [Sora-Bold.woff](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/sora/Sora-Bold.woff)
- [fa-solid-900.woff2](https://www.besharp.it/wp-content/themes/besharp/assets/webfonts/fa-solid-900.woff2)
- [AtomicMarker.woff](https://www.besharp.it/wp-content/themes/besharp/assets/fonts/atomic/AtomicMarker.woff)
- [fa-brands-400.woff2](https://www.besharp.it/wp-content/themes/besharp/assets/webfonts/fa-brands-400.woff2)
- [KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2](https://fonts.gstatic.com/s/roboto/v48/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2)

### ProcessMind — risorse

**Stylesheet**

- [Base.DSZE7YIe.css](https://processmind.com/_astro/Base.DSZE7YIe.css)

**Font richiesti (soltanto URL)**

- [a14d1900bfe74992.woff2](https://processmind.com/_astro/fonts/a14d1900bfe74992.woff2)
- [4f0b2c279482965c.woff2](https://processmind.com/_astro/fonts/4f0b2c279482965c.woff2)
- [52056217662ab262.woff2](https://processmind.com/_astro/fonts/52056217662ab262.woff2)
- [ae6437875e76fe72.woff2](https://processmind.com/_astro/fonts/ae6437875e76fe72.woff2)

### Celonis — risorse

**Stylesheet**

- [styles.css](https://www.celonis.com/dist/styles/styles.css)
- [header.css](https://www.celonis.com/dist/blocks/header/header.css)
- [home-hero.css](https://www.celonis.com/dist/blocks/home-hero/home-hero.css)
- [fragment.css](https://www.celonis.com/dist/blocks/fragment/fragment.css)
- [square-value.css](https://www.celonis.com/dist/blocks/square-value/square-value.css)
- [fonts.css](https://www.celonis.com/dist/styles/fonts.css)
- [text-only.css](https://www.celonis.com/dist/blocks/text-only/text-only.css)
- [home-basic.css](https://www.celonis.com/dist/blocks/home-basic/home-basic.css)
- [solutions.css](https://www.celonis.com/dist/blocks/solutions/solutions.css)
- [title.css](https://www.celonis.com/dist/blocks/title/title.css)
- [cards.css](https://www.celonis.com/dist/blocks/cards/cards.css)
- [topic-highlight.css](https://www.celonis.com/dist/blocks/topic-highlight/topic-highlight.css)
- [question.css](https://www.celonis.com/dist/blocks/question/question.css)
- [link-with-arrow.css](https://www.celonis.com/dist/styles/components/link-with-arrow/link-with-arrow.css)
- [carousel.css](https://www.celonis.com/dist/styles/components/carousel/carousel.css)
- [footer.css](https://www.celonis.com/dist/blocks/footer/footer.css)
- [lazy-styles.css](https://www.celonis.com/dist/styles/lazy-styles.css)
- [pnf.css](https://www.celonis.com/dist/blocks/pnf/pnf.css)
- [external-forms-style.css](https://www.celonis.com/dist/styles/pardot/external-forms-style.css)

**Font richiesti (soltanto URL)**

- [Poppins-Regular.woff2](https://www.celonis.com/src/assets/fonts/Poppins-Regular.woff2)

## Verifica e prossima implementazione

Sono stati verificati: 10 scenari REA, 10 snapshot DOM, 39 letture CSS HTTP riuscite, zero errori PostCSS e presenza dei dati di ogni sito nei cinque JSON. Le limitazioni degli scenari incompleti rimangono aperte e sono dichiarate sopra. Non è un audit completo dei siti concorrenti, né una prova di efficacia del loro design.

L'applicazione V2 e le verifiche locali sono descritte nella sezione dedicata alla PR. La promozione alla home, i controlli sul deployment reale, i risultati di conversione e le verifiche SEO live restano passaggi successivi. Le frequenze dei riferimenti sono dati della ricerca, non misure delle prestazioni o dell'efficacia della nuova UI.
