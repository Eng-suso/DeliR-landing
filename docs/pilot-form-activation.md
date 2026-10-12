# Pilot intake — stato e attivazione

**Stato corrente, 12 ottobre 2026:** informativa IT/EN predisposta per pubblicazione nell’assetto solo IONOS; il titolare ha confermato l’inoltro Gmail disattivato. La CI imposta il gate privacy pronto, ma mantiene invio e GA4 chiusi. Rimane da eseguire l’attivazione controllata e la prova completa browser → database sul dominio reale. Le note successive documentano anche versioni storiche; per privacy attuale vedere `pilot-privacy-release-review.md`.

## Percorso pronto

Hero, confronto, pilot, chiusura e CTA del menu portano a `/pilot#application` (in EN `/pilot?lang=en#application`). La route mostra sempre il modulo, porta il focus alla sezione e conserva la lingua. Cinque campi: nome, email, tipo di attività, tempistica, descrizione del progetto. Non richiede telefono, upload o dati del cliente. Il tipo di attività distingue consulente indipendente, boutique, società di consulenza e Operations aziendali.

L’anteprima è compilabile, valida i dati e non effettua POST né persiste la bozza. È dichiarata come anteprima. Non produce una conferma di ricezione. Una volta attivato l’invio, i campi si bloccano durante la richiesta; un errore conserva la bozza e consente di riprovare. La conferma richiede un successo HTTP con Content-Type JSON e `accepted: true`; una pagina HTML di fallback o un 2xx senza accettazione viene rifiutato. Il timeout client è 15 secondi. Dopo il successo la bozza viene svuotata e il focus passa alla conferma.

## Dipendenze ancora mancanti

L’utente ha ora creato il database MariaDB standard IONOS. È predisposto un backend PHP con schema e configurazione privata di esempio: [procedura e stato](ionos-pilot-backend.md). Il titolare ha distribuito il backend e confermato una risposta accepted: true e una riga con dati fittizi in phpMyAdmin. Ha poi confermato il ripristino della chiusura e la pulizia dei dati di prova; queste sono evidenze riferite dall’utente, non una verifica diretta dell’agente. L’informativa resta una bozza. I gate di invio e analytics non sono stati aperti. Le prove frontend successo/errore usano risposte simulate solo nei test.

## Primo passo su IONOS

Menu → Hosting → contratto Hosting Plus → Database → Crea database. Se compare soltanto Modifica, aprirlo e scegliere Crea database nella pagina successiva. MariaDB è il tipo standard; i tipi/versioni disponibili sono mostrati dal pannello. Assegnare una password e conservarla personalmente; non inserirla in chat, nel repository o in variabili `VITE_*`.

Fonte verificata l’11 ottobre 2026: [IONOS — Configurare un database MySQL o MariaDB](https://www.ionos.it/aiuto/hosting/configurare-un-database-mysql-o-mariadb/configurare-un-database-mysql-su-11-ionos/).

## Contratto del futuro endpoint

`VITE_PILOT_ENDPOINT` deve indicare un endpoint server che accetti il JSON prodotto da `submitPilotApplication`, validi nuovamente campi e allowlist, limiti dimensione/frequenza delle richieste e salvi tramite query parametrizzate. Nessun payload con dati personali nei log. Accessi al database e credenziali rimangono lato server. La risposta di accettazione va restituita soltanto dopo la registrazione riuscita, mai come fallback di una pagina statica. Errori generici 4xx/5xx, niente dettagli SQL. L’informativa e le effettive modalità di conservazione/accesso vanno completate prima dell’attivazione.

I valori pubblici di build da configurare dopo la verifica sono `VITE_PRIVACY_NOTICE_READY=true`, `VITE_LEAD_CAPTURE_READY=true`, `VITE_PRIVACY_NOTICE_URL` e `VITE_PILOT_ENDPOINT`. Non configurare il gate prima che destinazione, informativa e prova end-to-end reale siano pronte. L’invio della waitlist e GA4 restano separati. Il backend PHP è stato implementato nel successivo aggiornamento; la prova di salvataggio è confermata dal titolare; resta da verificare il percorso completo dal browser sul dominio reale dopo la preparazione dell’informativa.

## Prove

Lint, TypeScript e build passati. Suite con coverage: 47 test passati (99,08% linee, 98,26% branch), prima dell’estensione delle opzioni attività; i 12 test di intake/componente sono stati rieseguiti dopo tale estensione e passano. Test di componente verificano anteprima senza rete, accettazione esplicita, fallimento e retry. Tredici regressioni E2E passate su Chromium, WebKit, Chrome mobile e Safari mobile; tre smoke duplicati esclusi. Verifica finale IT/EN a 320, 390, 768 e 1440 px: quattro CTA primarie con destinazione corretta, cinque campi compilabili, nuove opzioni attività, validazione/focus, zero POST in anteprima, nessuna bozza persistita, nessun overflow e nessuna violazione axe A/AA rilevata. Le prove browser citate usano risposte simulate; successivamente il titolare ha verificato una richiesta fittizia salvata nel database IONOS tramite prova HTTP manuale.

Indice strutturale form-cro: 78/100 (campi 25/30, valore/sforzo 16/20, chiarezza 16/20, errori 13/15, fiducia 4/10, mobile 4/5). È una valutazione euristica del modulo, non un risultato di conversione; l’invio chiuso resta il vincolo operativo. Quando attivabile, misurare vista → inizio → invio accettato e richieste qualificate, senza valori dei campi nelle analytics e rispettando i gate già esistenti. Nessun nuovo tracker è stato aggiunto.

## Aggiornamento contatti e gate privacy

Il contatto pubblico diventa contact@delir.it, casella IONOS creata dal titolare. La prova email fornita mostra SPF, DKIM e DMARC superati; la consegna in spam resta aperta e non prova consegna affidabile ad altri destinatari. Nessun invio automatico è configurato dal backend. Non è stata verificata la configurazione di eventuali inoltri.

Il gate di intake richiede ora esplicitamente anche VITE_PRIVACY_NOTICE_READY: il solo flag di lead capture non può aprire un modulo con informativa non pronta. Restano da rendere operative revisione/cancellazione delle richieste, gestione diritti, pulizia dei contatori senza traffico e log diagnostici, e verifica di termini, backup e localizzazione dei servizi IONOS. GA4 resta disattivato e separato.

Verifica locale di questo aggiornamento: lint, typecheck e build passati; 48 test unitari passati. Browser Chromium visibile IT/EN a 390 e 1440 px sulle route home, pilot e privacy: nuovo mailto, nessun vecchio indirizzo, nessun overflow; privacy senza violazioni axe WCAG A/AA rilevate e focus/tastiera verificati. Zero POST e zero richieste Google Analytics/Tag Manager nella build chiusa. Questi controlli non equivalgono a un audit WCAG completo o alla prova di produzione.
