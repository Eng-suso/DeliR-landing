# DeliR — SEO e Search Console

Data: 11 ottobre 2026. Dominio confermato: `https://delir.it`.

## Pubblico e obiettivo

Pubblico confermato dall'utente: consulenti BPM/Operations e responsabili Operations delle PMI. Obiettivo attuale del sito: mostrare il percorso del prodotto e portare al contatto per il pilot. GA4 e Search Console non sono ancora configurati. Google Business Profile è escluso.

Il copy attuale richiede una revisione ampia secondo l'utente. Prima di riscriverlo vanno confermati messaggio principale, disponibilità del prodotto, output realmente consegnati e obiezioni dei due pubblici. Nessun risultato economico o quantitativo è stato dimostrato.

## Mappa query iniziale

Ipotesi editoriali basate sul pubblico e sui workflow presenti nella landing, non su volumi, difficoltà keyword, ranking o dati Search Console. Mercato iniziale assunto: Italia, lingua italiana. Le pagine dedicate indicate sotto sono proposte, non route già pubblicate.

| Gruppo di query | Pubblico e intento | Pagina da usare o progettare | Evidenza da mostrare |
| --- | --- | --- | --- |
| software analisi processi aziendali; strumenti analisi processi | Entrambi; valutazione di uno strumento | Home | Interviste/fonti, modello revisionato, confronto scenari |
| software BPMN; strumenti BPMN per consulenti | Consulenti; valutazione di modellazione e analisi | Home; eventuale pagina BPMN | Review umana, fonti collegate alle attività, limiti di esportazione da confermare |
| mappatura processi aziendali PMI; analisi processi operativi PMI | Operations PMI; capire metodo e fattibilità | Pagina dedicata proposta | Esempio concreto di processo, raccolta evidenze, responsabilità e perimetro |
| analisi AS-IS TO-BE; confronto processi AS-IS TO-BE | Entrambi; metodo e valutazione | Pagina dedicata proposta, collegata alla demo | Percorso AS-IS/TO-BE e criteri di review |
| simulazione processi aziendali; simulazione processi BPMN | Entrambi; valutare scenari | Pagina dedicata proposta | Scenario, input, assunzioni e limiti; non promettere previsioni validate |
| pilot analisi processi aziendali; pilot software BPMN | Entrambi; contatto per una valutazione | `/pilot` | Milestone, criteri di accettazione, consegna e condizioni del pilot |

La landing deve parlare a chi cerca uno strumento o un pilot. Query come "consulente BPM" o "consulenza Operations" possono avere un intento di acquisto di servizi diverso: non farne il focus senza verificare l'offerta.

## Preparazione tecnica nel repository

- Canonical, Open Graph, hreflang, robots e sitemap puntano a `delir.it`.
- Le route indexable previste sono `/`, `/pilot` e le relative varianti `?lang=en`.
- `/waitlist` resta esclusa dalla sitemap e ha `noindex` perché la raccolta automatica non è aperta; anche le pagine inesistenti hanno `noindex` nel documento renderizzato.
- La sitemap usa solo URL del dominio confermato, con HTTPS.
- Limite da affrontare nel lavoro SEO successivo: il documento HTML iniziale è italiano e i metadati delle altre route/lingue sono aggiornati dal client. Prima di creare pagine SEO dedicate, valutare HTML prerenderizzato per percorso e lingua e uno stato HTTP 404 reale sul server.
- DNS, certificato e risposte HTTP di produzione devono essere verificati dopo la pubblicazione. Una build locale non dimostra che Google possa scansionare il sito.

## Attivazione Search Console

1. Con l'account Google proprietario del progetto, aprire [Search Console](https://search.google.com/search-console/) e aggiungere una proprietà di tipo **Dominio**, inserendo `delir.it` senza protocollo o percorso.
2. Google fornisce il valore TXT di verifica. Inserirlo nei DNS IONOS come indicato da Google e dal pannello IONOS, conservando gli altri record. Il valore reale non è presente in questa documentazione.
3. Dopo che il record è pubblicamente visibile, completare la verifica in Search Console. Non rimuovere il record dopo la verifica.
4. Quando il sito pubblicato è accessibile in HTTPS, inviare `https://delir.it/sitemap.xml` nella sezione Sitemap.
5. Usare Controllo URL e Test URL pubblicato per home e `/pilot`: controllare accessibilità, canonical, rendering e assenza di `noindex`, poi richiedere l'indicizzazione.
6. Monitorare indicizzazione e Performance, filtrando Italia/Italiano e separando le ricerche di marca dalle altre. Rivedere la mappa query usando impressioni, clic, CTR e query effettive.

Stato: proprietà non creata, dominio non verificato, sitemap non inviata, indicizzazione non richiesta né confermata. Google decide tempi di scansione, indicizzazione e ranking; l'invio di sitemap o una richiesta non li garantisce.

## Attivazione GA4 successiva

Creare proprietà e stream web per `https://delir.it`. L'implementazione richiede l'ID di misurazione reale e una decisione sulla gestione privacy/consenso. Misurare almeno visualizzazioni delle pagine, clic verso demo/pilot e invii riusciti quando i moduli saranno attivi. Non inviare dati personali o contenuto libero dei moduli come eventi. Questa PR non carica script Google né aggiunge cookie.

## Fonti e provenienza

- ICP, dominio, provider database e strumenti di misurazione: confermati dall'utente nella conversazione dell'11 ottobre 2026.
- Workflow prodotto: landing e registrazioni già presenti nel repository; nessuna nuova verifica del backend prodotto.
- [Google — Verificare la proprietà del sito](https://support.google.com/webmasters/answer/9008080?hl=it).
- [Google — Richiedere una nuova scansione](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=it).
