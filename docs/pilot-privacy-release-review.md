# Privacy e pilot — assetto IONOS del 12 ottobre 2026

Questa versione sostituisce la valutazione del precedente inoltro a Gmail. Il titolare ha scelto la gestione solo IONOS e confermato nel pannello la disattivazione dell’inoltro automatico. È evidenza riferita dal titolare, non accesso diretto dell’agente alla configurazione.

## Assetto definitivo dell’informativa

- Titolare persona fisica e contatto pubblico già approvati.
- Hosting, database MariaDB e corrispondenza contact@delir.it su IONOS.
- Nessun inoltro del backend a Gmail, CRM o provider AI; nessun inoltro automatico della posta a Gmail.
- Richieste senza seguito e copie gestite: massimo 12 mesi dall’ultimo contatto, verifica giornaliera delle richieste e revisione settimanale delle scadenze.
- Informativa IT/EN per questo assetto, senza banner di bozza o informazioni legali da formalizzare nella pagina pubblica. Stato del modulo descritto dal medesimo gate usato dall’applicazione: una build in anteprima non dichiara di raccogliere dati.
- GA4 e waitlist rimangono chiusi. L’informativa attuale descrive GA4 disattivato; prima della sua futura attivazione occorre aggiornare il testo per Google, conservazione e trasferimenti, oltre a verificare proprietà e consenso. Il gate analytics non è una certificazione.

## Valutazione delle basi giuridiche

**Richieste precontrattuali di una futura parte del contratto:** art. 6(1)(b), limitatamente ai passi richiesti dalla persona. Non esteso automaticamente ai referenti di una società.

**Referenti aziendali e richieste spontanee:** art. 6(1)(f). Interesse individuato: comprendere e rispondere alla richiesta ricevuta, valutando un eventuale pilot. Necessità: contatto e breve contesto sono funzionali alla risposta e qualificazione; non vengono raccolti telefono, upload, dati dei clienti o informazioni per arricchimento commerciale. Bilanciamento: il mittente si aspetta una risposta; uso circoscritto, assenza di marketing successivo, accessi privati, avviso contro dati di terzi, conservazione limitata, diritti e opposizione riducono l’impatto. Esito della valutazione documentale per questo perimetro: favorevole con queste condizioni; da riesaminare prima di newsletter, CRM, AI, nuovi fornitori o finalità. Non è una valutazione dei dati trattati dal prodotto nei pilot.

**Sicurezza:** interesse a disponibilità e protezione del sito; guardie HTTPS, validazione, quote, identificativi HMAC pseudonimizzati e diagnostica senza payload. Durate e pulizia distinte dalle richieste commerciali. La prima esecuzione automatica del cron rimane una verifica operativa, senza attestare risultati non osservati.

## Fornitore e fonti

Le condizioni generali identificano IONOS SE per hosting ed email. La guida IONOS dichiara l’accordo sul trattamento incorporato nei contratti dal 19 luglio 2022; il titolare ha confermato che il contratto è recente. Conservare privatamente la versione contrattuale applicabile e il registro dei fornitori: non inserire documenti dell’account, credenziali o dati personali in Git. Il modello pubblico del 2021 non è descritto come prova della versione accettata.

La descrizione IONOS dei log Hosting indica otto settimane e nessun trasferimento fuori UE per tale trattamento. Non viene estesa a qualsiasi prodotto. Per il database Hosting, la guida indica backup giornalieri disponibili per 14 giorni; l’informativa distingue questa durata dai backup della posta. Nessuna promessa di cancellazione immediata da tutti i backup o di trattamento esclusivamente UE per tutti i servizi.

- [IONOS — condizioni generali](https://www.ionos.it/terms-gtc/condizioni-generali-per-litalia/).
- [IONOS — accordo nei contratti recenti](https://www.ionos.it/aiuto/protezione-dei-dati/informazioni-generali-sullordinanza-di-base-sulla-protezione-dei-dati-oderr/contratto-per-il-trattamento-dei-dati/).
- [IONOS — dati tecnici Hosting](https://www.ionos.it/aiuto/protezione-dei-dati/elaborazione-dei-dati-da-parte-del-prodotto-ionos/hosting/).
- [IONOS — backup database](https://www.ionos.it/aiuto/hosting/mysql-datenbank-sichern-wiederherstellen/ripristinare-un-database-mysql-o-mariadb-da-un-backup-di-7-giorni/).
- [GDPR — artt. 5–6, 12–13, 28 e capo V](https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it).

## Pubblicazione e prossimo passo

Il testo è predisposto per pubblicazione nell’assetto confermato; non equivale a una certificazione di conformità. La CI imposta privacy pronta, URL /privacy, endpoint /api/pilot.php, ma conserva invio e GA4 disattivati. Il backend privato e la prova HTTP precedente rimangono separati dalla prova browser finale.

Per aprire gli invii: build controllata con il gate intake attivo, abilitazione personale del backend privato, prova browser con dati fittizi, controllo della riga salvata e successiva cancellazione. Conferma solo dopo accepted:true. Non sovrascrivere configurazioni private o dati; rollback enabled=false e frontend in anteprima. Il nuovo .htaccess conserva il redirect HTTPS già configurato manualmente sul dominio.

Le eventuali copie Gmail anteriori alla disattivazione dell’inoltro vanno ancora revisionate e cancellate quando non necessarie: il cambio di configurazione non le elimina.
