# Apertura pilot — verifica del percorso dati

11 ottobre 2026. Preparazione per la pubblicazione, non attestazione di conformità. Nessuna raccolta attivata o modifica a configurazioni private IONOS/Google.

## Decisioni confermate

- Titolare persona fisica e contatto pubblico già approvati nella landing.
- Richieste senza seguito: massimo 12 mesi dall’ultimo contatto.
- Consultazione iniziale giornaliera del database e revisione settimanale manuale delle scadenze.
- contact@delir.it su IONOS con inoltro automatico a Gmail gratuita, mantenuto per scelta del titolare.
- GA4 e waitlist rimangono disattivati; nessuna attivazione implicita tramite apertura del pilot.

## Percorso effettivo

1. **Modulo:** browser → HTTPS /api/pilot.php → database MariaDB IONOS. Nessun invio automatico dei campi a email, CRM, Google o AI. Consultazione privata tramite phpMyAdmin.
2. **Email:** messaggio a contact@delir.it → casella IONOS → inoltro automatico alla Gmail gratuita. Include dati del mittente, corpo e allegati eventualmente inviati. Le risposte successive richiedono gestione coerente di entrambe le copie.
3. **Navigazione:** Hosting IONOS e memorie locali di lingua/preferenze. Nessun tag Google caricato nella build corrente.

## Verifica necessaria prima della chiusura dell’informativa

Google dichiara esplicitamente di non offrire un DPA per Gmail e Drive consumer. Il DPA Google Workspace non va presentato come copertura della Gmail gratuita. La scelta di mantenere l’inoltro è registrata; non si deduce automaticamente né liceità né illiceità del percorso dal solo nome del servizio.

Serve una valutazione documentata del trattamento professionale della corrispondenza: ruolo Google per questo utilizzo, base e necessità della comunicazione dei dati a Google, eventuale requisito art. 28, garanzie per i trasferimenti effettivi e impostazioni/funzioni del relativo account. Le dichiarazioni Google sul Data Privacy Framework riguardano trasferimenti coperti e non risolvono da sole gli altri requisiti. Non pubblicare una dichiarazione di conformità o di trattamento solo UE per tutta la corrispondenza.

Questo punto riguarda anche le email già ricevute tramite l’inoltro; lasciare chiuso il modulo non modifica il trattamento della casella esistente.

Per IONOS: conservare privatamente i termini applicabili al contratto recente e il relativo accordo incorporato, verificando il perimetro Hosting/database/Mail Basic. Il modello PDF pubblico del 2021 non prova quale versione sia incorporata nel contratto attuale. La documentazione Hosting descrive otto settimane di dati tecnici e nessun trasferimento fuori UE per quel trattamento; non estenderla alla posta o al database. La documentazione backup del database indica 14 giorni, senza dimostrare le durate dei backup email.

## Risultato concreto preparato

PrivacyPage IT/EN aggiornata al percorso Gmail confermato, alla gestione manuale scelta e al cron giornaliero configurato. Restano visibili lo stato di bozza e i punti da verificare. Diritti, opposizione e termine ordinario di risposta sono esplicitati. Nessun consenso generico all’informativa, newsletter o promessa aggiuntiva.

Validazione locale: lint, typecheck e build passati. Browser Chromium visibile su IT/EN a 390 e 1440 px: informazione sull’inoltro e conservazione presente, nessun overflow, zero violazioni axe A/AA rilevate nel contenuto principale, preferenze raggiungibili da tastiera, accettazione analytics disabilitata e zero richieste Google. Non equivale a un audit WCAG completo o alla verifica del server IONOS. Nessun dato reale inviato.

## Apertura dopo la verifica

Completare e pubblicare l’informativa coerente con il percorso valutato. Configurare solo privacy/intake e /api/pilot.php nella build; il backend privato va abilitato personalmente sul server. Eseguire una prova con dati fittizi dal browser e controllare una sola riga in phpMyAdmin, quindi rimuoverla. La conferma deve dipendere da accepted:true dopo salvataggio. Conservare il rollback enabled=false e una build in anteprima. Non dichiarare attiva la raccolta sulla base del solo test HTTP precedente.

## Fonti primarie

- [Google — assenza di DPA per servizi consumer](https://support.google.com/policies/answer/9581826?hl=en).
- [Google — norme sulla privacy](https://policies.google.com/privacy?hl=it).
- [Google — garanzie per trasferimenti](https://policies.google.com/privacy/frameworks?hl=en-GB).
- [IONOS — trattamento nei contratti recenti](https://www.ionos.it/aiuto/protezione-dei-dati/informazioni-generali-sullordinanza-di-base-sulla-protezione-dei-dati-oderr/contratto-per-il-trattamento-dei-dati/).
- [IONOS — dati tecnici Hosting](https://www.ionos.it/aiuto/protezione-dei-dati/elaborazione-dei-dati-da-parte-del-prodotto-ionos/hosting/).
- [IONOS — backup database](https://www.ionos.it/aiuto/hosting/mysql-datenbank-sichern-wiederherstellen/ripristinare-un-database-mysql-o-mariadb-da-un-backup-di-7-giorni/).
- [GDPR — artt. 5, 6, 12–13, 28 e capo V](https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it).
