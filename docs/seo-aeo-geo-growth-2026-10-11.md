# DeliR — SEO, AEO, GEO e crescita

Obiettivo confermato: 1.000.000 di visitatori al mese. Nessuna scadenza, baseline, budget di acquisizione o domanda di ricerca quantitativa confermata. Questo documento è un piano proposto, non una previsione di traffico. ICP confermato: consulenti BPM/Operations e Operations delle PMI, IT/EN. Risultato economico del sito: richieste pilot pertinenti.

## Primo blocco da risolvere

L'11 ottobre le richieste HTTP esterne dell'agente hanno ricevuto 403 per `https://delir.it/` e 404 per `/robots.txt`, `/sitemap.xml` e `/pilot`. Questi test non dimostrano quale risposta riceva Googlebot, ma impediscono di dichiarare il sito pubblicato e indicizzabile. La proprietà Search Console è stata verificata secondo quanto riferito dall'utente; dati e impostazioni non sono stati ispezionati dall'agente.

La build ora produce 14 documenti IT/EN con gli stessi componenti e flag del client, inclusi draft, aggiornamenti chiusi e 404. Metadati condivisi tra client e generazione HTML; sitemap con otto URL e alternati reciproci; FAQ strutturate derivate dal copy visibile. Non sono state aggiunte recensioni, prezzi, risultati pilot o certificazioni inventati.

Il frontend IONOS usa `index.php` per scegliere il documento della lingua richiesta senza un runtime Node sul server. `.htaccess` mantiene i file API esistenti e assegna le route del sito al frontend PHP. Gli indirizzi sconosciuti ricevono 404. Per altri hosting statici, `index.html` contiene la home IT; il routing PHP IT/EN richiede IONOS/Apache e non è implementato nel Worker Cloudflare.

## Cosa significa AEO/GEO qui

Risposte dirette alle domande reali, spiegazioni di evidenze e limiti, esempi comprensibili e testi disponibili nel documento iniziale. La guida Google aggiornata nel 2026 mantiene centrali qualità, accessibilità e contenuti originali; non richiede `llms.txt` o uno schema speciale per i motori AI. [Guida ufficiale](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

In Search Console controllare **Impostazioni → Search generative AI**: la proprietà deve consentire l'inclusione. Google indica l'inclusione come valore predefinito; l'impostazione effettiva di DeliR non è stata verificata. [Controllo ufficiale](https://support.google.com/webmasters/answer/16908024).

FAQPage descrive le domande presenti, senza promessa di citazioni o risultati speciali. Google ha dismesso i rich result FAQ dal 7 maggio 2026. [Registro degli aggiornamenti](https://developers.google.com/search/updates#may-2026). Non basare la crescita su questo markup.

## Contenuti da validare e produrre

La landing resta la pagina commerciale. Costruire una biblioteca di risorse utili, con collegamenti alla spiegazione del prodotto e al pilot. Queste famiglie sono ipotesi editoriali: nessun volume, ranking o difficoltà è stato misurato.

| Priorità | Risorsa proposta IT/EN | Valore concreto da includere |
| --- | --- | --- |
| 1 | Analisi As-Is e To-Be / As-Is and To-Be process analysis | Un esempio di acquisti indiretti, fonti, assunzioni e confronto; dati dimostrativi etichettati |
| 2 | Mappatura dei processi da documenti e interviste / Process mapping from documents and interviews | Checklist di discovery e verifica con chi esegue il processo |
| 3 | Simulazione dei processi aziendali / Business process simulation | Input, KPI, sensibilità delle assunzioni e limiti delle previsioni |
| 4 | BPMN per consulenti Operations / BPMN for Operations consultants | Esempio commentato, attività collegate alle evidenze e revisione |
| 5 | Process intelligence e process mining | Spiegare quando servono event log e quando iniziare da fonti qualitative, con documentazione primaria |

Ogni risorsa deve avere una domanda principale, risposta chiara, esempio originale, limiti, fonti primarie, data di revisione reale, link contestuali e un invito al pilot pertinente. Pubblicare traduzioni curate; evitare pagine generate per ogni variante di keyword. Prima dei casi studio reali ottenere autorizzazione e anonimizzazione; non trasformare le demo in risultati dei clienti.

Distribuzione proposta: video dimostrativi con trascrizioni, contributi utili nelle comunità BPM/Operations, collaborazioni editoriali con professionisti del settore e risorse condivisibili. Non sono stati inviati messaggi o avviate campagne. I canali a pagamento richiedono prima budget, conversioni misurabili e costo sostenibile per pilot qualificato.

## Traguardi e misurazione

1. **Pubblicazione verificata:** 200 sulle pagine/sitemap, 404 sugli URL inesistenti, HTML IT/EN corretto, Controllo URL completato.
2. **Prima domanda verificata:** impressioni e clic non di marca per i gruppi di query; contatti pilot pertinenti. Usare i dati per scegliere i primi contenuti.
3. **Crescita ripetibile:** aumentare le risorse e i canali che portano traffico qualificato e progetti, aggiornando quelle che non rispondono all'intento.
4. **Scala:** verificare se il mercato raggiungibile permette il milione mensile. Potrebbero servire pubblico internazionale e temi adiacenti; non modificare l'ICP o l'offerta solo per aumentare visite.

Distinguere visitatori, sessioni, clic e impressioni. Proposta di KPI primario: utenti del sito nel mese di calendario; affiancare richieste pilot qualificate e pilot avviati. GA4 resta disattivato finché i gate concordati non sono aperti; i dati raccolti con consenso non rappresentano necessariamente tutti i visitatori. Search Console misura le ricerche, non tutti gli utenti. Non convertire clic o impressioni in una stima certa del numero di persone.

## Verifica locale

51 test unitari passati; typecheck/lint/build passati; smoke di produzione e CSP passati; cinque controlli automatici accessibilità Chromium passati. Otto combinazioni browser PHP locale: IT/EN × 390/1440 px × JavaScript attivo/disattivo; 200/404, metadati, FAQ, tastiera e assenza di overflow verificati. File e riferimenti asset dei 14 documenti controllati. I test di prerender sono aggiunti alla suite su Chromium, WebKit e profili mobile.

Lighthouse mobile, mediana di tre esecuzioni per route: home performance 96/100, LCP 2,34 s; pilot 92/100, LCP 2,96 s; aggiornamenti chiusi 96/100, LCP 2,38 s. CLS 0 nelle tre route e budget configurati superati. Il LCP del pilot supera il riferimento di 2,5 s: resta un punto da monitorare, non una dichiarazione di buoni Core Web Vitals sul campo. Questi test usano Vite preview locale, non il server IONOS.

La configurazione Apache va verificata su IONOS dopo upload. Nessuna indicizzazione, ranking, citazione AI, Core Web Vitals sul campo o crescita di traffico dichiarata come acquisita.
