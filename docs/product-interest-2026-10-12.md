# DeliR — richieste di utilizzo e colloquio con il fondatore

## Obiettivo e decisioni

Il titolare vuole capire quanti consulenti desiderano usare DeliR. La homepage
invita a richiedere di provarlo; non promette accesso immediato, una data, una beta
gratuita o disponibilità a pagare. L'email è il contatto necessario e il tipo di
attività distingue consulenti, Operations interne e altri visitatori. La
tempistica è facoltativa e segnala un incarico attivo, entro 90 giorni o curiosità.
Nome, cognome, telefono e documenti non vengono raccolti in questo percorso.

La hero conserva titolo e descrizione originali IT/EN come richiesto dal titolare.
Su mobile descrizione e azione precedono il video, con il medesimo ordine nel DOM.
Pilot a pagamento, sintesi dell'offerta e FAQ restano visibili. Il pilot conserva
la pagina e le condizioni esistenti, incluso il pagamento per milestone.

La conversazione con Sohayb è separata. VITE_CONVERSATION_BOOKING_URL può contenere
un link HTTPS pubblico a un evento Calendly. Non viene incorporato un widget.
Senza un URL valido il pulsante apre il contatto email reale e lo dichiara.
Il link non invia dati del modulo e il clic non prova una prenotazione.

## Misura dell'interesse

Una richiesta è una dichiarazione, non una prova di adozione o pagamento.
Non è verificata la titolarità dell'email e non si presume di conoscere
l'organizzazione o il numero di consulenti di un team.

Il riepilogo privato restituisce soltanto conteggi:

- requests: email uniche raccolte;
- consultant_requests: richieste che dichiarano independent o consulting-team;
- consultants_active_engagement: consulenti che indicano un incarico attivo;
- consultants_next_90_days: consulenti con incarico previsto entro 90 giorni;
- consultants_exploring e consultants_timing_unspecified: gli altri due gruppi.

Per leggerlo sul server: php /private/delir/interest-metrics.php.
Non esporta email, nomi o messaggi e non espone un URL pubblico.
I conteggi non dimostrano che una persona abbia provato il prodotto.
Conversazioni svolte, trial realmente iniziati e pilot concordati vanno verificati
separatamente. Un singolo referente di un team conta come una richiesta, non come
tutti i consulenti dell'azienda.

Gli eventi browser sono interest_cta_clicked, interest_form_started,
interest_submit_attempt, interest_submit_failed, interest_request_accepted,
conversation_contact_clicked e conversation_booking_clicked. Restano protetti
dagli stessi gate e consenso analytics esistenti. Non trasmettono campi, messaggi,
email, link Calendly o parametri liberi. interest_request_accepted non è chiamato
nuova iscrizione: una richiesta ripetuta può essere accettata senza un nuovo record.
La fonte per le nuove email uniche è il database. Non dividere tutti i record per
le sole sessioni di visitatori consenzienti per stimare la conversione totale.

## Installazione IONOS e apertura

Il frontend e il server hanno interruttori indipendenti, chiusi per impostazione
predefinita. Il gate del pilot non apre il nuovo endpoint. La PR non modifica
la configurazione privata, non carica file sul server e non pubblica il sito.

1. Importare server/ionos/schema.sql nel database esistente con phpMyAdmin:
   CREATE TABLE IF NOT EXISTS aggiunge product_interest senza cancellare il pilot.
2. Installare waitlist.php e interest-metrics.php in /private/delir; preservare
   pilot.php e config.php privati. Aggiornare maintenance.php.
3. Installare public/api/waitlist.php in /public/api/waitlist.php. Il server deve
   eseguire PHP; la sola preview Vite e Cloudflare Static Assets non eseguono PHP.
4. Nel config.php privato aggiungere waitlist_enabled con valore true. Preservare
   tutti i valori esistenti e il gate enabled del pilot. Nessuna credenziale in
   VITE_*, Git, chat o document root. Il modulo usa pdo_mysql.
5. Preparare una build con VITE_PRIVACY_NOTICE_READY=true,
   VITE_PRIVACY_NOTICE_URL=/privacy, VITE_LEAD_CAPTURE_READY=true,
   VITE_WAITLIST_READY=true e VITE_WAITLIST_ENDPOINT=/api/waitlist.php.
   Gli analytics conservano la configurazione separata esistente.
6. In staging verificare modulo → risposta JSON accepted:true → record nel
   database. Inviare due volte la stessa email fittizia e verificare un record.
   Verificare 503 e retry senza conferma falsa; rimuovere il record fittizio.
7. Pubblicare soltanto il pacchetto verificato, preservando /api e /private.
   In caso di problemi impostare waitlist_enabled=false e
   VITE_WAITLIST_READY=false: resta il contatto email e il pilot non è disabilitato.

VITE_CONVERSATION_BOOKING_URL resta vuoto fino alla disponibilità del link reale.
Prima di valorizzarlo configurare l'evento per il confronto senza impegno,
controllare disponibilità, campi richiesti e impostazioni effettive dell'account.
Non viene creata una pagina Calendly e non viene dichiarato un meeting prenotato.

## Ricezione, deduplicazione e protezioni

Il server accetta JSON con cinque chiavi allowlist: email, practice, timing,
source e noticeVersion. Controlla HTTPS, Origin, Sec-Fetch-Site quando presente,
tipo di contenuto, limite di 4 KiB, email e valori ammessi prima di connettersi.
Le query sono parametrizzate e quota e inserimento sono nella stessa transazione.
accepted:true viene emesso dopo commit. Il client verifica il tipo JSON e quel
riscontro esplicito: HTML con status 200 non è una ricevuta.

Un indice univoco email evita duplicati anche concorrenti. Una richiesta ripetuta
non modifica ruolo o intento della prima e restituisce la medesima risposta;
non rivela se l'email era presente. Le quote usano HMAC con namespace separato
dal pilot: 5 richieste per IP e 100 globali ogni 15 minuti. Non vengono salvati
IP grezzi. Gli errori pubblici non espongono payload, SQL o eccezioni.
Non vengono inviate email automatiche da questo codice.

La notice version e la data UTC documentano la richiesta di contatto sulla
disponibilità del prodotto. Il modulo spiega lo scopo e il ritiro prima dell'invio.
Il titolare gestisce i ritiri ricevuti a contact@delir.it; maintenance.php
--dry-run conta i record oltre 12 mesi, --apply elimina soltanto quelli scaduti.
I pilot non vengono cancellati da questa estensione. Programmare la manutenzione
privata già prevista e gestire i ritiri prima di ricontattare una persona.
Questi controlli non costituiscono una certificazione GDPR.

Riferimenti: [EDPB — consenso](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en)
e [Calendly — privacy](https://calendly.com/legal/privacy-notice).

## Validazione

TypeScript, lint, build e unit test con copertura: vedere il risultato aggiornato
nella PR. I test PHP verificano validazione e guardie localmente; CI aggiunge una
MariaDB usa e getta per transazioni, duplicati, quote, riepilogo e conservazione.
Le prove browser dei percorsi attivi usano risposte simulate; non dimostrano
un salvataggio su IONOS. Nessun dato reale viene inviato durante le verifiche.
