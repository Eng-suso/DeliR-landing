# Privacy, consenso e GA4 — DeliR

## Stato e perimetro

Revisione dell’11 ottobre 2026. Il titolare è la persona fisica già indicata nel footer, confermata dall’utente; il contatto pubblico esistente è stato confermato per le richieste privacy. Nessuna azienda è dichiarata. La proprietà GA4 e lo stream web sono stati creati dall’utente. L’ID pubblico è riportato in `.env.example`; non è una credenziale. Nessun segreto, dato di cliente o registro di consensi individuali viene salvato nel repository.

La pagina `/privacy` è una **bozza da completare**, in italiano e inglese, con `noindex`. Non va presentata come informativa definitiva. Questa modifica prepara il codice, non pubblica il sito, non attiva Google Analytics e non certifica conformità GDPR. Entrambi i flag `VITE_PRIVACY_NOTICE_READY` e `VITE_ANALYTICS_READY` restano `false`.

## Diagnosi della misurazione prima dell’intervento

Indice richiesto dalla skill analytics-tracking: **30/100, Broken**. È un giudizio di preparazione, non una metrica di performance: 18/25 allineamento alle decisioni (visite e interesse nel pilot); 6/20 modello eventi (da definire); 0/20 accuratezza (nessuna raccolta verificata); 0/15 conversioni (moduli chiusi); 2/10 attribuzione; 4/10 governance. Non usare dati di questa configurazione per decisioni finché non è stata attivata e validata.

Remediation: prima raccolta e rispetto della scelta; poi informativa e impostazioni reali dei fornitori; infine attivazione controllata e verifica nel report Tempo reale. Il codice di tracking è predisposto ma inattivo. I test con tag simulato verificano il comportamento tecnico, non la raccolta su GA4.

## Riscontri normativi e applicazione

- [GDPR, artt. 5, 6, 7, 12–13, 15–22, 28 e 44–49](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=it): informare su titolare, finalità, basi giuridiche, destinatari, conservazione, diritti e trasferimenti; minimizzare; documentare il consenso e consentirne la revoca; verificare il rapporto con i fornitori. L’art. 12 disciplina la risposta ai diritti, normalmente entro un mese. La scelta tecnica non determina da sola la base giuridica dei trattamenti.
- [Garante, linee guida cookie, 10 giugno 2021](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876): nessun tracciamento facoltativo per impostazione predefinita; rifiuto possibile; scrolling e prosecuzione non valgono consenso. Evitare richieste ripetute; la riproposizione dopo almeno sei mesi è una delle eccezioni. La scelta locale conserva versione, data, scadenza e valore. Non è un registro centralizzato né una prova di identità.
- [Google, Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode): nella modalità di base i tag restano bloccati senza consenso; la modalità avanzata può trasmettere ping senza cookie. Implementata la prima, con categorie pubblicitarie sempre negate.

## Inventario e decisioni da completare

| Trattamento | Configurazione osservata o proposta | Da verificare prima della pubblicazione |
| --- | --- | --- |
| Lingua | localStorage `delir-language`, nessun invio al backend | Includere nell’informativa definitiva; cancellazione dal browser |
| Preferenze | localStorage `delir-consent-v1`, sei mesi di calendario, scelta accetta/rifiuta e data/versione | Limite della prova locale e gestione della revisione del testo; incremento versione per modifiche sostanziali |
| Hosting | IONOS Hosting Plus confermato dall’utente | Ente contrattuale, DPA, log effettivi, retention, localizzazione e subfornitori; non dedurre questi dettagli dal nome del piano |
| Email | Link mailto verso il contatto pubblico, nessun invio dal frontend | Provider effettivo della casella e termini; finalità, base e conservazione della corrispondenza; nessuna newsletter automatica |
| Analytics | Proposto GA4 con consenso, Google Signals e pubblicità disabilitati nel codice | Proprietà, raccolta dati, impostazioni Ads, misurazione avanzata, conservazione, condizioni e trasferimenti effettivi |
| Moduli / DB | Intake non attivo | Informativa separata/aggiornata e endpoint prima dell’apertura; il DB IONOS non riceve dati da questa modifica |

La base del trattamento per la risposta a una richiesta contrattuale dell’interessato può differire dalla gestione di contatti generici o dalla sicurezza del sito. Le basi vanno scelte e motivate per i trattamenti realmente attivi. Proposte operative da confermare: dati di richiesta non convertita cancellati entro 12 mesi dall’ultimo contatto; eventuali rapporti contrattuali trattati separatamente; eventi GA4 conservati due mesi senza rinnovo dell’identificatore a ogni evento. Sono proposte, non impostazioni già applicate o periodi imposti dal GDPR.

La [documentazione IONOS sui log](https://www.ionos.com/help/hosting/log-files/notes-on-log-files/) distingue contratti acquistati prima del 21 luglio 2026: il limite di otto settimane indicato per quei contratti **non dimostra** la retention del nuovo contratto dell’utente. Verificare pannello o assistenza senza esportare log personali nel repository. [IONOS DPA](https://www.ionos.it/aiuto/protezione-dei-dati/informazioni-generali-sullordinanza-di-base-sulla-protezione-dei-dati-oderr/contratto-per-il-trattamento-dei-dati/).

Per Google verificare ente destinatario, termini applicabili e subfornitori. [Termini sul trattamento](https://business.safety.google/adsprocessorterms/) e [informazioni Google per UE](https://support.google.com/analytics/answer/12017362?hl=it) sono fonti da confrontare con il contratto effettivo, non una prova di localizzazione esclusivamente europea. Per eventuali trasferimenti verificare il meccanismo applicabile (decisione di adeguatezza con destinatario coperto o altre garanzie pertinenti); non dichiarare automaticamente che il consenso ai cookie li risolve.

## Implementazione e limiti

- Nessun tag inline nel documento HTML, preconnect o script Google prima del consenso. Nessuna CMP esterna aggiunta.
- Dialogo nativo, rifiuto e accettazione con pari stile, accesso persistente dal footer; Escape equivale a rifiuto, nessun consenso implicito. L’accettazione resta disabilitata con release gate chiusi.
- Entrambe le scelte persistono sei mesi. Storage mancante, invalido, vecchia versione o scaduto non autorizza il tag. Se il browser impedisce il salvataggio, il sito rimane utilizzabile e GA4 resta bloccato.
- Revoca: blocco `ga-disable`, svuotamento della coda, rimozione dello script e dei cookie `_ga`/`_ga_*` sul percorso radice per gli ambiti di dominio controllabili; ricaricamento per arrestare codice Google già eseguito. Sincronizzazione tra schede tramite evento storage. La revoca non annulla richieste già in corso né cancella dati già ricevuti da Google.
- Scadenza controllata anche in una scheda aperta; un timer del browser sospeso viene eseguito alla ripresa. Nessuna promessa di cancellazione remota alla scadenza.
- Solo page_view esplicite, deduplicate per percorso/lingua: home, pilot, waitlist, privacy. Nessun evento di invio riuscito finché i moduli sono chiusi.
- Percorsi consentiti, titoli fissi, referrer vuoto e sola lingua consentita: non inoltrare campi liberi, hash o parametri arbitrari. Questo limita l’attribuzione: le UTMs non fanno parte del piano corrente. Non promettere un funnel commerciale completo.
- Cookie GA4 proposti a 180 giorni, `cookie_update:false`; retention lato Google da configurare separatamente. [Cookie Google](https://developers.google.com/tag-platform/security/guides/customize-cookies), [retention GA4](https://support.google.com/analytics/answer/7667196?hl=it).
- La CSP consente gli origin Google strettamente necessari e non abilita script inline. `_headers` è per Cloudflare e **non viene applicato automaticamente da IONOS**: replicare la policy nella configurazione reale del server e testarla prima del rilascio. Tracker automatici aggiuntivi del provider non sono coperti da questo consenso e vanno inventariati/disabilitati.

## Piano di tracking

| Evento | Trigger | Proprietà | Decisione |
| --- | --- | --- | --- |
| page_view | Consenso valido, route/lingua consentita diversa dalla precedente | page_location normalizzato, page_title fisso, language, referrer vuoto | Pagine consultate da chi accetta analytics |

Conversioni: nessuna configurata; visite e clic non equivalgono a lead acquisiti. L’eventuale `generate_lead` dovrà avvenire solo dopo conferma server di un invio riuscito, senza informazioni personali.

## Verifica e rilascio

1. Completare la bozza con le informazioni reali della tabella; definire procedura diritti, cancellazione e conservazione. Non archiviare corrispondenze personali in Git.
2. In GA4, stream web → disattivare **Misurazione avanzata** per questa prima implementazione manuale; gli eventi automatici potrebbero duplicare page_view o raccogliere contesto non previsto. [Guida Google](https://support.google.com/analytics/answer/9216061?hl=it).
3. Controllare Google Signals, collegamenti Ads, condivisione dati, redazione dati e retention. Non impostare eventi chiave su semplici visualizzazioni. [Evitare PII](https://support.google.com/analytics/answer/6366371?hl=it).
4. Verificare HTTPS, routing e CSP IONOS; poi preparare build con ID reale e i due flag attivati solo a revisione conclusa.
5. Nel browser reale: prima della scelta/rifiuto nessuna richiesta Google; dopo consenso una page_view per navigazione; payload e cookie effettivi; revoca e nuova scheda; storage bloccato; report Tempo reale. Non inserire dati personali nei test. Consent Mode non prova da sola conformità.
6. Ripetere controllo su desktop e mobile dopo la pubblicazione. Realtime e DebugView non sono ancora stati verificati sulla proprietà reale.

Evidenza locale: lint, typecheck, 40 unit test (18 nuovi), build; privacy/preferenze su Chromium, WebKit, Android e iPhone simulati; smoke e axe sulle route principali. La coverage è stata estesa ai nuovi moduli `src/privacy`: 99,02% linee e 97,97% branch complessivi. Anche con gate aperti esclusivamente in una build temporanea, Chromium desktop e WebKit iPhone verificano rifiuto, accettazione, revoca, cancellazione cookie, sincronizzazione tra schede, deduplica, payload normalizzato, CSP e axe. Tutte le richieste Google di questa prova sono intercettate localmente; nessun traffico viene inviato alla proprietà reale. Non è stato effettuato un test con lettore di schermo: i controlli automatici e di tastiera non equivalgono a una verifica completa WCAG.
