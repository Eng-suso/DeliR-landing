# DeliR — dominio e infrastruttura

Decisioni confermate dall'utente l'11 ottobre 2026.

- Dominio di produzione: `https://delir.it`, registrato presso IONOS.
- Hosting: IONOS Hosting Plus; il pannello indica il dominio collegato a `/public`.
- Il pannello ha accettato la richiesta SSL Starter Wildcard gestito da IONOS; installazione e HTTPS pubblico restano da verificare.
- Backend dei moduli: usare il database incluso in IONOS, attraverso endpoint server-side. Il frontend non deve contenere credenziali del database.
- Misurazione richiesta: Google Analytics 4 e Google Search Console, con verifica dell'indicizzazione e SEO sulle query dell'ICP. Google Business Profile è escluso. L'utente ha creato lo stream GA4 e riferito accesso alla dashboard Search Console dopo la procedura TXT; sitemap e indicizzazione non ancora verificate. Il codice GA4 è predisposto con consenso e flag di attivazione chiusi.
- ICP confermato: consulenti BPM/Operations e responsabili Operations delle PMI. L'utente ha segnalato che il copy attuale richiede una revisione ampia; i testi pubblici non vengono riscritti in questa modifica.
- Privacy: titolare persona fisica e contatto già pubblici confermati dall'utente; nessuna azienda dichiarata. Informativa in bozza, retention e condizioni dei fornitori da completare: [privacy e GA4](privacy-ga4-review-2026-10-11.md).
- GitHub: `main` deve richiedere una pull request e il check `quality` di GitHub Actions superato sulla base aggiornata. Nessuna approvazione di un secondo revisore richiesta per il lavoro individuale.

Protezione applicata e verificata tramite API GitHub: check `quality` vincolato a GitHub Actions, branch aggiornato obbligatorio, PR richiesta anche agli amministratori, discussioni da risolvere, force push e cancellazione di `main` disabilitati. La modifica ai metadati passa tramite PR; la configurazione di protezione è già attiva sul repository.

## Lavoro ancora da eseguire

Adattare il deploy Cloudflare a IONOS, configurare header/rotte/cache sul server, verificare HTTPS online e implementare i moduli con validazione, protezioni dagli abusi e informativa privacy. Database e analytics non sono attivati da questa modifica.

I precedenti report descrivono la configurazione osservata alle rispettive date; i riferimenti storici a `delir.ai` non rappresentano il dominio di produzione confermato.
