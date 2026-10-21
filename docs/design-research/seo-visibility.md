# Visibilità Google e ChatGPT — requisiti per il design DeliR

Data: 20 ottobre 2026. Ambito: lettura del branch `codex/figma-v2-framework` e documentazione primaria Google/OpenAI. Questo è un piano mirato di readiness, non un audit completo: nessun punteggio SEO, ranking, volume di ricerca o citazione acquisita è dichiarato. Non sono stati modificati codice, robots, impostazioni Search Console o infrastruttura.

## Decisione per DESIGN.md

Lo stile dei riferimenti può migliorare gerarchia e leggibilità. La visibilità richiede anche pagine accessibili, contenuti utili e prove originali. Nessuna combinazione di colori, font, animazioni o markup garantisce ranking o citazioni.

Il design deve preservare testo HTML, titoli comprensibili, link reali e navigazione accessibile. I concetti essenziali del prodotto devono essere leggibili anche senza avviare un video. Mantenere la headline concordata, «Mappa. Analizza. Simula. Migliora.», insieme all'audience e alla subheadline approvate: il solo slogan non spiega la categoria del prodotto. Il title SEO può rimanere descrittivo senza allungare la headline visiva.

## Evidenze nel repository

I riferimenti `file:riga` sono relativi alla radice del worktree e fotografano il codice letto in questa ricerca.

| Stato osservato | Evidenza | Implicazione per il prossimo design |
| --- | --- | --- |
| HTML generato per route e lingua, usando gli stessi componenti React | `src/entry-prerender.tsx:17`; `scripts/prerender.mjs:17`; `scripts/prerender.mjs:22`; `scripts/prerender.mjs:40` | Preservare il prerender; non spostare spiegazioni indispensabili dentro canvas, immagini o video. La generazione di un file non dimostra che l'hosting lo serva alla URL pubblica corretta. |
| Title e description IT/EN condivisi | `src/lib/siteMetadata.ts:3`; `src/lib/siteMetadata.ts:12` | Mantenere una categoria e un destinatario espliciti nei metadati, oltre alla breve headline. |
| Canonical, hreflang e JSON-LD inseriti nella build | `scripts/prerender.mjs:26`; `scripts/prerender.mjs:27`; `scripts/prerender.mjs:29` | Verificare coerenza sull'HTML iniziale di ogni URL dopo il deploy. |
| Robots generale permette il crawl e indica la sitemap | `public/robots.txt:1`; `public/robots.txt:4` | Il file locale non blocca specificamente OAI-SearchBot o GPTBot. Un eventuale blocco CDN/WAF rimane da verificare. |
| Sitemap con otto URL, quattro pagine in IT/EN | `public/sitemap.xml:3` fino a `public/sitemap.xml:10` | `/v2` non è elencata; evitare di inserire anteprime e pagine intenzionalmente escluse. |
| `/v2` è un'anteprima intenzionalmente esclusa | `src/lib/siteMetadata.ts:24`; `public/index.php:18` | Sono presenti sia meta `noindex` sia header PHP `X-Robots-Tag`. Non rimuoverli durante la ricerca. Al rilascio promuovere il design sulla pagina canonica pubblica con un piano esplicito. |
| Apache/PHP seleziona il documento per route e lingua e risponde 404 sugli URL sconosciuti | `public/.htaccess:17`; `public/index.php:5`; `public/index.php:8`; `public/index.php:15` | Verificare questa catena sull'hosting effettivo. |
| Il Worker Cloudflare è configurato come SPA fallback | `wrangler.jsonc:7`; `wrangler.jsonc:16` | La selezione PHP non viene eseguita dal Worker. Prima di usarlo per produzione, verificare o implementare equivalenza di HTML iniziale IT/EN, metadati, noindex e 404. È un rischio di portabilità osservato, non una diagnosi del sito live. |
| Schema attuale: WebSite, WebPage, FAQPage sulla home | `src/lib/structuredData.ts:7`; `src/lib/structuredData.ts:11` | Conservare solo informazioni vere e coerenti con il contenuto visibile; nessuna promessa di risultato speciale. |
| Esistono test di HTML iniziale e lettura senza JavaScript | `e2e/prerender.spec.ts:3`; `e2e/prerender.spec.ts:20` | Riutilizzarli nella futura implementazione; qui non sono stati eseguiti né aggiornati. |
| Hero con descrizione testuale, demo e tracce captions | `src/content/landingCopy.ts:5`; `src/content/landingCopy.ts:6`; `src/components/ProductFilm.tsx:126` | Mantenere una spiegazione utile accanto alla demo; valutare trascrizioni più estese per risorse didattiche. |

## Regole esterne verificate

**Google Search.** Google indica tre requisiti tecnici minimi: accesso di Googlebot, risposta HTTP 200 e contenuti indicizzabili. L'idoneità non assicura l'indicizzazione. Le verifiche devono riguardare le URL pubbliche effettive. [Requisiti tecnici ufficiali](https://developers.google.com/search/docs/essentials/technical).

**Funzioni AI di Google.** La guida ufficiale privilegia contenuti originali e una struttura tecnica chiara. Non richiede `llms.txt`, file AI o uno schema speciale, né una scrittura artificialmente spezzata in blocchi minimi. Il report dedicato alle funzioni generative è indicato nella guida aggiornata. [Guida Google](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

**Scelta di inclusione Google.** In Search Console controllare `Impostazioni → Search generative AI`, inclusa l'eventuale ereditarietà dalla proprietà padre. Google documenta l'inclusione come default; l'impostazione reale di DeliR non è stata ispezionata. Questo controllo riguarda l'inclusione nelle funzioni AI, non il consenso al training. [Controllo ufficiale](https://support.google.com/webmasters/answer/16908024).

**ChatGPT Search e training sono separati.** `OAI-SearchBot` riguarda la scoperta e la ricerca; `GPTBot` riguarda contenuti potenzialmente utilizzabili per addestrare modelli. I due controlli sono indipendenti: è possibile consentire il primo e bloccare il secondo. `ChatGPT-User` rappresenta visite attivate da utenti e non decide l'inclusione nella ricerca. Verificare anche che CDN e hosting accettino gli intervalli IP pubblicati da OpenAI. La policy di training non viene cambiata da questa ricerca. [Crawler ufficiali OpenAI](https://developers.openai.com/api/docs/bots).

**Citazioni ChatGPT.** OpenAI raccomanda di non bloccare OAI-SearchBot per consentire l'uso del contenuto nei riassunti; segnala inoltre `utm_source=chatgpt.com` nei link di referral. L'accessibilità permette la scoperta, senza garantire selezione o citazione. [FAQ publisher OpenAI](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), [ChatGPT Search](https://help.openai.com/en/articles/9237897-chatgpt-search).

## Piano prioritario proposto

| Priorità | Azione proposta | Verifica di accettazione |
| --- | --- | --- |
| P0 — prima della pubblicazione | Scegliere la URL canonica e l'hosting effettivo; preservare `/v2` esclusa finché resta anteprima. | HTML iniziale IT/EN corretto sulle URL pubbliche, 200 sulle pagine valide, 404 reali sugli URL sconosciuti, canonical e direttive coerenti. |
| P0 — scoperta | Verificare produzione, robots, sitemap, Search Console, CDN/WAF e accesso OAI-SearchBot. | Controllo URL, crawl e log disponibili; nessuna dichiarazione di accesso basata soltanto sul file locale. Verifica separata della scelta di inclusione Google AI. |
| P1 — contenuti commerciali | Spiegare destinatario, input, output, metodo e limiti di DeliR con testo accanto alle demo. | Un consulente capisce quando usare il prodotto e cosa riceve senza guardare l'intero video. Confronti datati e sostenuti da documentazione primaria. |
| P1 — contenuti originali | Preparare una prima guida sostanziale: esempio As-Is/To-Be, assunzioni della simulazione e decisioni del consulente. | Esempio riproducibile, fonti, autore o revisore reale e data effettiva; dati dimostrativi dichiarati. Collegamenti contestuali a prodotto e pilot. |
| P1 — esperienza | Tradurre lo stile in componenti accessibili e leggeri: titoli leggibili, focus visibile, reduced motion, poster e caricamento video controllato. | Test mobile/desktop, tastiera e HTML senza JavaScript; misure di performance prima/dopo, distinguendo laboratorio e dati sul campo. |
| P2 — misurazione | Separare impressioni/clic Google, referral ChatGPT e richieste commerciali pertinenti. | Search Console e, dove disponibile, report generativo; attribuzione referral/UTM con le regole privacy esistenti. Un controllo manuale delle risposte AI è un campione, non una quota di mercato. |

Le risorse editoriali sono ipotesi da validare con le domande dei consulenti e i dati di ricerca: non sono state misurate domanda, difficoltà o concorrenza. Non produrre pagine in serie per ogni variante di query. Nessun risultato cliente, certificazione, testimonianza o dato proprietario può essere inventato per rendere la pagina più convincente o citabile.

## Limiti della verifica

Questa ricerca non ha accesso ai dati Search Console, ai log del server, alle impostazioni CDN, ai dati di traffico o ai Core Web Vitals sul campo. Non è stato verificato il deploy di produzione in questa attività. I documenti SEO dell'11 ottobre nel repository sono contesto storico e non attestano lo stato attuale. Le proposte editoriali e di design sono raccomandazioni; non costituiscono evidenza di efficacia già ottenuta.
