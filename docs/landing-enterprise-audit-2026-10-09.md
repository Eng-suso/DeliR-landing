# DeliR — audit generale della landing come prodotto enterprise

Data: 9 ottobre 2026. Stato: diagnosi e raccomandazioni; nessuna modifica al sito.

## Giudizio

La landing ha una direzione visiva coerente e una base tecnica solida nei controlli locali. È ancora debole come strumento di vendita: mostra molte schermate, ma lascia aperte le domande su valore economico, differenziazione, affidabilità del fornitore, adozione e offerta acquistabile. Il percorso di acquisizione è attualmente chiuso.

Il pubblico dichiarato è coerente: consulenti BPM/Operations indipendenti e piccole practice. Questo audit non propone di cambiare tale segmento. Per questo pubblico, qualità enterprise significa anche poter usare il prodotto su incarichi riservati, spiegare gli output al cliente, sapere come iniziare e capire responsabilità e condizioni. Se si vuole vendere direttamente a grandi organizzazioni, servirà inoltre un percorso dedicato ai buyer aziendali; oggi quel percorso non esiste.

## Perimetro ed evidenze

- Home `/`, `/pilot`, `/waitlist`, `/enterprise-readiness`, pagina 404 e collegamenti interni.
- Sorgenti React, copy italiano/inglese, configurazioni SEO, header e pipeline.
- Build di produzione locale servita su `http://127.0.0.1:4174`, distinta dal server Vite su porta 3000.
- Chromium desktop 1440×900, Pixel 7 emulato, iPhone 14/WebKit emulato; controllo overflow a 320, 390, 640, 820, 1024 e 1440 px.
- Axe WCAG A/AA, esercizi da tastiera, dialog video, FAQ, riduzione del movimento e stato dei moduli.
- Lighthouse: tre esecuzioni mobile e tre desktop sul build di produzione. Audit npm completo e con `--omit=dev`.
- Nessun accesso al prodotto applicativo, ai competitor, a clienti, analytics, Search Console o hosting pubblico. Nessuna verifica di sicurezza o conformità del prodotto DeliR. Non sono stati inviati moduli.

Evidenze riproducibili in `artifacts/qa/enterprise-audit-2026-10-09/`: `browser-audit.json`, `lighthouse-summary.json`, sei report Lighthouse, tre report Axe, screenshot e `direct-anchor-recheck.json`. I due audit npm sono in `artifacts/qa/enterprise-*-dependency-audit-2026-10-09.json`.

## Prontezza alla conversione

Indice diagnostico editoriale, non una misura delle conversioni né una previsione di incremento.

| Categoria | Valutazione | Motivo |
|---|---:|---|
| Chiarezza della proposta | 17/25 | Pubblico e funzioni riconoscibili; beneficio commerciale ancora astratto. |
| Focus della conversione | 6/20 | Pilot principale e aggiornamenti secondari, entrambi indisponibili; resta solo esplorare la demo. |
| Corrispondenza traffico/messaggio | Non valutabile /15 | Mancano dati su provenienza, campagne e intenzione dei visitatori. |
| Fiducia e credibilità | 4/15 | Demo e fonti presenti; mancano prove cliente e informazioni per valutare il fornitore e il trattamento dei dati. |
| Attrito e UX | 12/15 | Buona base responsive/accessibile; pagina molto lunga, demo piccole su mobile e prove difficili da condividere. |
| Gestione delle obiezioni | 4/10 | Risponde a quesiti di categoria; costo, durata, implementazione e dati rimangono aperti. |

Totale osservabile **43/85**; normalizzato sul perimetro valutato **51/100 — non pronta all'acquisizione commerciale**. La componente traffico è esclusa, non penalizzata arbitrariamente. L'indice non è confrontabile con audit precedenti di singole sezioni. La chiusura dei moduli è intenzionale e dichiarata: è un limite commerciale attuale, non un invio malfunzionante o una raccolta fittizia.

Prima di esperimenti A/B vanno risolti offerta, prove e percorso di contatto. Mancano anche baseline e volume di traffico per progettare un esperimento affidabile.

## Problemi in ordine di impatto

### E01 — Il visitatore interessato non ha un passo commerciale disponibile

**Priorità P1, evidenza diretta.** La CTA hero conduce al pilot; `/pilot` mostra cinque campi disabilitati e un pulsante disabilitato. `/waitlist` dichiara iscrizioni non aperte e non presenta un modulo. Non emerge un contatto alternativo dal footer.

Evidenze: `src/components/Hero.tsx:10`, `src/components/PilotInvitation.tsx:17`, `src/pages/PilotPage.tsx:142`, `src/pages/LeadCapturePendingPage.tsx:15`, `src/components/Footer.tsx:1`.

**Impatto:** l'interesse generato non può essere trasformato in richiesta. **Raccomandazione:** definire un'offerta e un canale realmente disponibili. Se si mantiene una preview, rendere coerente tutta la gerarchia CTA con l'esplorazione del prodotto. Non attivare moduli prima che destinazione, informativa e gestione delle richieste siano pronti.

### E02 — Il titolo descrive una filosofia, il motivo per spendere resta debole

**Priorità P1, diagnosi editoriale.** «Dal processo alle fonti. Senza perdere il perché.» è riconoscibile ma non esplicita un lavoro costoso da risolvere. La descrizione elenca organizzazione, verifica e scenari; non chiarisce quale consegna diventa più semplice o quale frizione del consulente viene eliminata. La sezione metodo riprende lo stesso concetto.

Evidenze: `src/components/Hero.tsx:8`, `src/components/Problem.tsx:6`, `src/components/BuiltFor.tsx:10`.

**Impatto:** una persona può capire il prodotto senza vedere una ragione forte per cambiare il suo modo di lavorare. **Raccomandazione:** collegare la promessa a un incarico concreto, al problema attuale e a un output utilizzabile. Usare metriche di risparmio solo dopo una misurazione reale.

### E03 — La tabella non dimostra il vantaggio sui competitor diretti

**Priorità P1, evidenza diretta.** Nelle tre righe, DeliR, Celonis, SAP Signavio e ProcessMind hanno tutti tre «Sì». Due righe riguardano canvas BPMN e review del medesimo canvas. La differenza più evidente è verso chat generaliste e modellazione causale, che svolgono compiti differenti. Il perimetro dichiarato rende il confronto più corretto, ma non lo rende una prova di superiorità.

Evidenze: `src/lib/comparisonContent.ts:37`, `src/components/Comparison.tsx:10`; screenshot `desktop-chromium-confronto.png`.

**Impatto:** il buyer che valuta un tool di processo non trova una ragione per preferire DeliR. **Raccomandazione:** selezionare feature decisive dell'incarico e verificarne il funzionamento e il perimetro presso tutte le alternative. Collegamento puntuale fonte/attività, gestione delle ambiguità prima della modellazione e consegna tracciabile sono candidati da indagare, non esclusive già dimostrate. Dove le capacità sono condivise, spiegare il vantaggio operativo con evidenze; non trasformare l'assenza di documentazione in una croce.

### E04 — La demo è una prova dell'interfaccia; manca una prova del valore ottenuto

**Priorità P1, evidenza sul contenuto pubblicato.** La pagina dichiara correttamente che azienda, persone e valori sono dimostrativi. Non presenta un incarico cliente verificabile, un risultato misurato, una testimonianza attribuita o una validazione esterna.

Evidenze: `src/components/Journey.tsx:10`, `src/lib/productClips.ts:31`, struttura DOM in `browser-audit.json`.

**Impatto:** il visitatore vede che cosa può apparire sullo schermo, ma non quanto possa fidarsi della delivery o dei benefici. **Raccomandazione:** aggiungere una prova autorizzata e specifica quando disponibile. Nel frattempo, mostrare un esempio completo di output e come viene verificato, esplicitando i limiti. Non usare i valori della simulazione come risultato cliente.

### E05 — Le domande sui dati e sul fornitore restano senza risposta

**Priorità P1, lacuna informativa.** Il footer contiene brand e nome del fondatore. Non offre contatto, presentazione del fornitore, policy o informazioni pubbliche su hosting, uso dei dati da parte dell'AI, conservazione, cancellazione, separazione tra clienti, accessi, esportazione e supporto.

Evidenze: `src/components/Footer.tsx:1`, `src/components/Faq.tsx:9`, `src/components/Hero.tsx:12`.

**Impatto:** chi lavora con documenti del cliente non può valutare l'idoneità all'adozione. «Nessun documento cliente al primo contatto» risponde soltanto alla prima fase. **Raccomandazione:** pubblicare risposte aderenti alle capacità effettive, distinguendo disponibile, previsto e concordabile. Questo rilievo riguarda la landing, non prova l'assenza di controlli nel prodotto. Nessuna certificazione o conformità viene inferita.

### E06 — Il pilot non è ancora un'offerta valutabile

**Priorità P1, evidenza diretta.** Sono indicati confronto sul fit, perimetro e assenza di abbonamento automatico. Non sono indicati durata, investimento o criterio di preventivo, attività incluse, contributo richiesto al consulente, output consegnati, assistenza e condizioni di uscita.

Evidenze: `src/components/PilotInvitation.tsx:9`, `src/pages/PilotPage.tsx:23`, `src/components/Faq.tsx:18`.

**Impatto:** non è possibile stimare impegno, rischio o convenienza. L'assenza di abbonamento non chiarisce se il pilot abbia un costo. **Raccomandazione:** definire e pubblicare la scheda del pilot. Le risposte mancanti sono decisioni di business, non testi da inventare.

### E07 — L'architettura fa leggere una demo estesa prima dell'offerta

**Priorità P2, misure dirette; effetto sulle conversioni da validare.** La home misura 13.773 px a 1440×900 e 13.329 px sul profilo Pixel 7. Su desktop il confronto inizia a circa 9.201 px e il pilot a 11.247 px; su Pixel 7 rispettivamente a 7.497 e 10.173 px. Il solo percorso della demo occupa circa 7.031 px su desktop e 5.138 su mobile. Gli anchor della nav consentono di saltare le sezioni, ma non migliorano la lettura lineare iniziale.

Evidenze: `src/pages/LandingPage.tsx:31`, `src/components/Journey.tsx:62`, `browser-audit.json`.

**Impatto:** il visitatore deve investire attenzione prima di conoscere proposta, prove e condizioni. **Raccomandazione:** sintetizzare il percorso principale e lasciare la demo estesa a un livello di approfondimento. Ordine candidato: problema concreto → risultato/output → demo sintetica → differenze documentate → fiducia e dati → offerta → FAQ di acquisto.

### E08 — La demo su mobile richiede troppo lavoro di interpretazione

**Priorità P2, riscontro visivo.** Le schermate desktop da 1920 px sono presentate a circa 330–344 CSS px. Etichette, BPMN e pannelli diventano piccoli. Espansione e descrizioni aiutano, ma il visitor deve scegliere una scena, riprodurla e interpretare l'interfaccia. La matrice mostra una sola alternativa per volta su mobile, pur mantenendo correttamente DeliR e le feature fissi.

Evidenze: `src/components/ProductFilm.tsx:88`, `src/components/ClipExplorer.tsx:14`, screenshot `mobile-chromium-product-03.png` e `mobile-chromium-confronto.png`.

**Impatto:** mostrare il prodotto non equivale a far capire il vantaggio in una scansione rapida. **Raccomandazione:** ritagli mirati, una breve annotazione sul passaggio decisivo e un prima/dopo del lavoro. Per il confronto mobile, valutare selezione esplicita del competitor pur mantenendo la matrice desktop.

### E09 — Le FAQ non risolvono le principali obiezioni d'acquisto

**Priorità P2, evidenza diretta.** Molte domande spiegano categorie del prodotto o visioni future, come Management Systems e Company Memory. Restano scoperte costo, durata del pilot, onboarding, formati di input/output, gestione dati e assistenza. La distinzione tra roadmap e capacità attuali è corretta e va mantenuta.

Evidenze: `src/components/Faq.tsx:9`.

**Raccomandazione:** ordinare le FAQ intorno a idoneità, avvio, investimento, dati, output e limiti dell'AI; mantenere la roadmap in un approfondimento separato.

### E10 — Le prove non sono raggiungibili in modo affidabile da un link diretto

**Priorità P2, riproduzione diretta.** Aprendo una nuova sessione su `/#comparison-evidence-review`, la disclosure delle fonti rimane chiusa e la pagina resta a `scrollY=0` anche dopo 10 secondi con reduced motion. Il click su una cella apre la disclosure, ma il montaggio iniziale gestisce solo lo scroll dell'anchor. Inoltre `#product-05`, usato per la prova degli scenari, seleziona inizialmente `ipotesi-to-be`, non il clip di confronto quantitativo. Le scene selezionate non sono rappresentate nell'URL.

Evidenze: `src/pages/LandingPage.tsx:17`, `src/components/Comparison.tsx:66`, `src/components/ClipExplorer.tsx:9`, `direct-anchor-recheck.json`, `deeplinks.json`.

**Impatto:** condividere o riaprire una prova può perdere il contesto. **Raccomandazione:** ripristinare disclosure e scena attraverso URL e collegare le feature al clip specifico. I normali link in pagina non risultano mancanti; il problema è il ripristino dello stato all'accesso diretto.

### E11 — Un vecchio audit interno è esposto come pagina del sito

**Priorità P1, evidenza diretta.** `/enterprise-readiness` è inclusa nelle route del build di produzione e eredita `index, follow`. Dichiara assenza di skip link/test/404, waitlist con finto successo, bundle principale da 804 kB e undici vulnerabilità. Diverse affermazioni sono superate dai sorgenti e dai controlli attuali.

Evidenze: `src/App.tsx:26`, `src/pages/EnterpriseReadinessPage.tsx:56`, `:70`, `:84`, `:98`, `:105`, `index.html:9`.

**Impatto:** chi scopre la pagina può leggere un'autodiagnosi negativa e inesatta invece delle informazioni sul prodotto. **Raccomandazione:** mantenere i rapporti operativi fuori dal sito pubblico oppure esporre una pagina di fiducia aggiornata, con intenzione e indicizzazione deliberate. Il rilievo dimostra l'esposizione nel build locale, non che Google abbia già indicizzato l'URL pubblico.

### E12 — Metadata e lingua non seguono la pagina

**Priorità P2, riproduzione diretta.** Il title e la description della home persistono sulle route testate. Passando all'inglese il contenuto e `html.lang` cambiano, ma title, description e Open Graph restano italiani. Non c'è canonical; le lingue condividono una URL e la preferenza è in localStorage. Sitemap e OG assumono `https://delir.ai`, dominio da confermare nell'ambiente di pubblicazione.

Evidenze: `index.html:6`, `:13`, `:20`, `src/i18n/LanguageContext.tsx:26`, `public/sitemap.xml:3`, `browser-audit.json`.

**Raccomandazione:** metadata specifici per route/lingua e una decisione esplicita sulle URL delle versioni linguistiche e sulle pagine indicizzabili. Google raccomanda title distinti, descrittivi e nella lingua del contenuto; per siti multilingua raccomanda URL distinti per le versioni linguistiche. [Title](https://developers.google.com/search/docs/appearance/title-link), [siti multilingua](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

### E13 — Performance mobile buona, con margine sulla prima visualizzazione

**Priorità P2, misurazione locale.** Mediana di tre run: performance 93/100 mobile, LCP 2.840 ms, CLS 0 e TBT 0. Desktop: 100/100, LCP 617 ms, CLS circa 0,00022 e TBT 0. Sul mobile il poster hero è il principale elemento LCP. Ha priorità alta, ma è scoperto dopo il rendering JS; tutte le immagini usano una versione da 1920 px senza `srcset`.

Evidenze: `src/components/ProductFilm.tsx:88`, `src/App.tsx:8`, report Lighthouse. Le stime di risparmio immagine del tool sono opportunità, non miglioramenti già ottenuti.

**Raccomandazione:** anticipare la scoperta del poster, introdurre dimensioni responsive e verificare di nuovo sul build. Il riferimento LCP di 2,5 s riguarda il 75° percentile delle visite reali; questi risultati locali non sono dati di campo e non misurano INP. [Riferimento LCP](https://web.dev/articles/lcp).

### E14 — Le dipendenze di sviluppo richiedono manutenzione

**Priorità P2, scan dipendenze.** `npm audit --omit=dev`: zero advisory. Audit completo: 27 pacchetti segnalati, 3 critical, 16 high, 6 moderate, 2 low, nella catena di sviluppo/test/build. «3 critical» include severità propagate, non tre exploit indipendenti. Esempi: tinypool/Vitest e proxy-addr. Non equivale a vulnerabilità dimostrate nella pagina statica servita agli utenti.

**Raccomandazione:** triage delle catene effettivamente usate da CI/build e aggiornamenti verificati. Non applicare `audit fix --force` indiscriminato: alcune proposte cambiano versioni major o suggeriscono downgrade della toolchain.

### E15 — Non emerge una misura del percorso commerciale

**Priorità P2, limite di osservazione.** Nel codice esaminato non risultano eventi specifici di CTA, approfondimento demo o richiesta pilot; una configurazione esterna dell'hosting potrebbe esistere e non è stata ispezionata.

**Raccomandazione:** prima dell'acquisizione, definire che cosa conta come richiesta qualificata e come misurare i passaggi del percorso. Privacy e configurazione della raccolta vanno decise prima di attivare strumenti. Non sono disponibili dati per attribuire cali di conversione alla lunghezza o al copy.

## Sintesi SEO locale

Indice editoriale di readiness, non ranking né stato reale d'indicizzazione. Lighthouse SEO 100/100 verifica un insieme più ristretto di controlli e non annulla i rilievi qui riportati.

| Categoria | Score | Peso | Contributo |
|---|---:|---:|---:|
| Crawlability & Indexation | 80 | 30% | 24 |
| Technical Foundations | 95 | 25% | 23,75 |
| On-Page Optimization | 80 | 20% | 16 |
| Content Quality & E-E-A-T | 95 | 15% | 14,25 |
| Authority & Trust Signals | 90 | 10% | 9 |
| **Totale** | **87/100 — Good** | | **87** |

Detrazioni dal punteggio grezzo di ciascuna categoria:

| Issue / categoria | Evidenza | Severità / confidenza | Deduzione | Impatto e raccomandazione |
|---|---|---|---:|---|
| S1. Audit interno indicizzabile / Crawlability | E11, route e `index, follow` | High / High | −10 | Espone contenuto operativo superato; scegliere esposizione e indicizzazione deliberate. |
| S2. Canonical assente / Crawlability | E12, HTML e DOM | Medium / High | −5 | Segnale preferenziale non definito; fissare dominio e URL canoniche di pubblicazione. |
| S3. Pagine di acquisizione chiuse nella sitemap / Crawlability | E01, `public/sitemap.xml` | Medium / High | −5 | Le URL offerte non soddisfano ancora l'intento di iscrizione; rivedere la loro indicizzabilità nella fase preview. |
| S4. Metadata condivisi tra route / On-Page | E12, DOM delle route | High / High | −10 | Riduce chiarezza delle pagine nei risultati/condivisioni; descrivere ciascuna pagina. |
| S5. Versione inglese senza URL e metadata propri / On-Page | E12, localStorage e cambio lingua | High / High | −10 | Versione linguistica non identificabile tramite URL; definire URL e metadata coerenti. |
| S6. LCP mobile lab oltre 2,5 s / Technical | E13, tre run e poster hero | Medium / High | −5 | Margine sulla visualizzazione iniziale; ottimizzare scoperta e dimensioni del poster. Non è un fallimento field CWV accertato. |
| S7. Prova di esperienza cliente assente / Content | E04, contenuti della home | Medium / High | −5 | Mancano evidenze pubbliche di impiego reale; pubblicare casi autorizzati o output verificabili senza inventare risultati. |
| S8. Informazioni sul fornitore e contatto insufficienti / Authority | E05, footer e contenuti | High / High | −10 | Il lettore non può valutare il fornitore; rendere disponibili identità, contatto e informazioni applicabili. |

S1–S3: prima del lancio commerciale. S4–S6: miglioramenti ad alto impatto sulla presentazione e sulla prima visita. S7–S8: rafforzamento duraturo della credibilità. Il massimo recupero aritmetico dell'indice è 13 punti se tutte le lacune osservate vengono risolte; non indica un aumento del traffico o dei lead. Autorità esterna, backlink, concorrenza e dati Search Console restano fuori perimetro.

## Revisione UI a livello di file

- `src/pages/LandingPage.tsx:20` — un fragment diretto delle fonti non riapre la disclosure; riproduzione salvata.
- `src/components/ClipExplorer.tsx:9` — scena selezionata non condivisibile nell'URL; le prove quantitative aprono il capitolo con una scena diversa.
- `src/components/ProductFilm.tsx:88` — poster 1920 px senza `srcset`; dettaglio UI troppo piccolo sul mobile e opportunità di peso misurata.
- `index.html:20` — title fisso per route e lingua; modifica del contenuto non aggiorna i metadata.
- `src/App.tsx:26` — vecchio audit operativo incluso nel routing di produzione.

Riferimento consultato: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Nessuna violazione automatica Axe nel campione della home. Le osservazioni editoriali su scansione e persuasione non sono dichiarate violazioni WCAG.

## Interventi consigliati

**Prima priorità:** definire offerta pilot, prossimo passo realmente disponibile, prova principale e informazioni sul fornitore/dati; rimuovere l'esposizione involontaria del vecchio audit. Questi interventi richiedono fatti e decisioni di business prima della riscrittura.

**Interventi rapidi:** rendere le CTA coerenti con lo stato reale, riordinare le FAQ d'acquisto, correggere i metadata e il ripristino dei link alle prove. Sono ipotesi di intervento, non cambiamenti eseguiti.

**Interventi strutturali:** sintetizzare la home, raccontare un output dall'input alla consegna, progettare una demo leggibile su mobile e rivedere la matrice intorno a differenze significative documentabili.

**Da validare prima di esperimenti:** comprensione dell'offerta e delle differenze con consulenti del segmento; disponibilità di un canale reale e di una baseline. Non si raccomanda A/B testing allo stato attuale.

| Ipotesi da validare | Cambiamento candidato | Comportamento atteso | Misura |
|---|---|---|---|
| Il problema e l'output concreto sono più comprensibili del titolo astratto | Hero legato a un incarico e a un deliverable | Il lettore sa spiegare prodotto, utilità e prossimo passo | Intervista breve: risposta corretta dopo la prima vista. |
| Una demo sintetica fa comprendere il valore con meno sforzo | Un percorso breve con output finale, demo estesa separata | Il lettore identifica l'utilità senza vedere tutte le scene | Compito di comprensione; tempo e correttezza, senza obiettivo inventato. |
| Un pilot definito riduce incertezza commerciale | Scheda con durata, investimento, inclusioni, impegno e risultati da valutare | Il buyer può decidere se chiedere una valutazione | Comprensione delle condizioni; richieste qualificate dopo apertura del canale. |

Alternative di hero da validare, non approvate né implementate:

1. «Dalle interviste a un processo che puoi verificare.» — chiarisce input e lavoro del consulente; la body deve esplicitare modello, fonti e scenari.
2. «Porta al cliente il processo e le prove dietro ogni scelta.» — mette al centro la consegna e la responsabilità professionale.
3. «Fonti, BPMN e scenari per il tuo prossimo incarico.» — categoria e percorso immediati; meno distintiva ma semplice da comprendere.

La CTA «Richiedi un pilot sul tuo progetto» è candidabile soltanto quando esiste davvero quel percorso. Nella fase preview, «Guarda il caso dimostrativo» è coerente con ciò che il sito offre oggi.

## Cosa funziona e cosa non è stato accertato

- Tipografia, palette e gerarchia sono coerenti; schermate reali del materiale fornito e dati demo etichettati.
- La home non mostra overflow globale nei sei viewport verificati.
- Axe: zero violazioni automatiche in tutti e tre i profili sulla home. FAQ e dialog rispondono alla tastiera; il dialog restituisce il focus. Il link di salto oltrepassa la nav nel percorso Chromium. WebKit ha selezione Tab dipendente dal comportamento del browser; non viene dichiarata una certificazione della navigazione nativa Safari.
- Reduced motion disattiva le riproduzioni automatiche; sul mobile la riproduzione è volontaria. I controlli e le descrizioni dei video esistono.
- TypeScript, lint e build completati con successo. I test automatizzati unitari e l'intera suite e2e del progetto non sono stati rieseguiti: sono stati eseguiti i controlli browser descritti sopra.
- `public/_headers` e pipeline CI/CD esistono; non è stata verificata la loro applicazione sull'hosting pubblico né lo stato di esecuzione dei job.
- 404 dedicata e `noindex` sono presenti. Non si ripete la vecchia diagnosi che li dava assenti.
- Nessuna vulnerabilità npm segnalata nelle dipendenze di produzione; la manutenzione della toolchain resta distinta dalla sicurezza del prodotto.
- Non sono disponibili metriche di conversione, risultati cliente o dati field CWV. Non sono stati eseguiti test con screen reader né dispositivi fisici.

Questa analisi è una proposta tecnica/editoriale da valutare, non una strategia di prodotto già approvata e non una verifica delle capacità enterprise dell'applicazione DeliR.
