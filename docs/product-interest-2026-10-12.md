# DeliR — waitlist, early access e pilot

## Obiettivo

La landing deve distinguere due intenzioni senza creare percorsi concorrenti:

1. **Waitlist / early access** — per chi vuole usare DeliR ma non ha ancora bisogno di avviare un progetto.
2. **Pilot** — per chi ha già un processo o un incarico reale e vuole valutare DeliR adesso.

La waitlist è la conversione principale della landing. Il pilot resta sempre disponibile come percorso ad alta intenzione, ma non compete visivamente con la CTA primaria.

Non esiste un terzo funnel principale per demo, call o colloqui con il founder. Il contatto email resta disponibile nel footer e come fallback operativo.

## Gerarchia della landing

- Navbar: CTA primaria **Entra nella lista d’attesa**.
- Hero: CTA primaria waitlist, CTA secondaria **Vedi il prodotto**, link testuale **Avvia un pilot** per chi ha già un progetto reale.
- Sezione early access: ribadisce la waitlist e segnala il pilot come alternativa per un incarico concreto.
- Sezioni pilot: mantengono perimetro, milestone, condizioni e candidatura esistenti.
- Chiusura pagina: scelta esplicita tra early access e pilot.
- `/waitlist`: linguaggio e conferma esplicitamente da lista d’attesa; il pilot è l’unica conversione alternativa.

La hero conserva titolo e descrizione di prodotto IT/EN. Su mobile descrizione e azioni precedono il video con lo stesso ordine nel DOM.

## Cosa raccoglie la waitlist

Il modulo raccoglie solo:

- email;
- tipo di attività (`independent`, `consulting-team`, `in-house`, `other`);
- tempistica prevista facoltativa (`active`, `next-90-days`, `exploring`).

Nome, cognome, telefono, documenti e dati dei clienti non vengono richiesti.

L’iscrizione indica interesse a essere ricontattati quando DeliR aprirà l’accesso a nuovi utenti. Non equivale a:

- accesso immediato;
- trial iniziato;
- adozione del prodotto;
- disponibilità a pagare;
- candidatura pilot.

Il pilot rimane un flusso separato con il proprio modulo e i propri segnali analytics.

## Misura dell’interesse

Il riepilogo privato restituisce soltanto conteggi aggregati:

- `requests`: email uniche raccolte;
- `consultant_requests`: richieste `independent` o `consulting-team`;
- `consultants_active_engagement`: consulenti con incarico attivo;
- `consultants_next_90_days`: consulenti con incarico previsto entro 90 giorni;
- `consultants_exploring` e `consultants_timing_unspecified`: gli altri gruppi.

Per leggerlo sul server:

```bash
php /private/delir/interest-metrics.php
```

Un referente di un team vale come una richiesta, non come tutti i consulenti dell’organizzazione. I conteggi della waitlist non devono essere presentati come utenti attivi o clienti.

Gli eventi browser della waitlist sono:

- `interest_cta_clicked`;
- `interest_form_started`;
- `interest_submit_attempt`;
- `interest_submit_failed`;
- `interest_request_accepted`.

Gli eventi non trasmettono campi, email o parametri URL liberi. La fonte per il numero di email uniche resta il database, perché richieste duplicate possono ricevere `accepted:true` senza creare un nuovo record.

## Installazione IONOS e apertura

Frontend e server hanno gate indipendenti. Il pilot non apre automaticamente la waitlist.

1. Importare `server/ionos/schema.sql` nel database esistente: `CREATE TABLE IF NOT EXISTS` aggiunge `product_interest` senza rimuovere il pilot.
2. Installare `waitlist.php` e `interest-metrics.php` in `/private/delir`, preservando `pilot.php` e `config.php`.
3. Installare `public/api/waitlist.php` in `/public/api/waitlist.php` su un host che esegue PHP.
4. Nel `config.php` privato abilitare `waitlist_enabled`. Nessuna credenziale deve essere inserita in `VITE_*`, Git o document root.
5. Preparare la build con:
   - `VITE_PRIVACY_NOTICE_READY=true`
   - `VITE_PRIVACY_NOTICE_URL=/privacy`
   - `VITE_LEAD_CAPTURE_READY=true`
   - `VITE_WAITLIST_READY=true`
   - `VITE_WAITLIST_ENDPOINT=/api/waitlist.php`
6. In staging verificare modulo → JSON `accepted:true` → record nel database.
7. Inviare due volte la stessa email fittizia e verificare un solo record.
8. Verificare errore server e retry senza conferma falsa, quindi rimuovere i dati fittizi.
9. Pubblicare solo il pacchetto verificato, preservando `/api` e `/private`.

Rollback: impostare `waitlist_enabled=false` e `VITE_WAITLIST_READY=false`. La pagina mostra il fallback email e il pilot continua a funzionare.

## Ricezione, deduplicazione e protezioni

Il server accetta JSON con cinque chiavi allowlist: `email`, `practice`, `timing`, `source`, `noticeVersion`.

Controlla HTTPS, Origin, `Sec-Fetch-Site` quando disponibile, content type, limite payload di 4 KiB, email e valori ammessi prima della connessione al database. Le query sono parametrizzate; quota e inserimento avvengono nella stessa transazione. `accepted:true` viene emesso soltanto dopo il commit.

Il client richiede una risposta JSON valida con conferma esplicita: una pagina HTML con status 200 non viene trattata come successo.

Un indice univoco sull’email evita duplicati anche concorrenti. Una richiesta ripetuta non rivela se l’indirizzo fosse già presente. Le quote usano HMAC con namespace separato dal pilot: 5 richieste per IP e 100 globali ogni 15 minuti; gli IP grezzi non vengono salvati.

La data UTC e la versione dell’informativa documentano la richiesta di contatto. I ritiri arrivano a `contact@delir.it`. `maintenance.php --dry-run` conta i record oltre 12 mesi e `--apply` elimina quelli scaduti senza toccare i pilot.

Questi controlli non costituiscono una certificazione GDPR.

Riferimento: [EDPB — Guidelines 05/2020 on consent](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).

## Validazione

La build distribuibile mantiene `VITE_WAITLIST_READY=false` finché il backend IONOS non viene installato e verificato con una scrittura reale.

La CI valida TypeScript, lint, unit test, PHP, transazioni MariaDB, build di produzione, browser test e Lighthouse. Una build isolata con waitlist attiva verifica inoltre:

- validazione del modulo;
- rifiuto di risposte HTML 200;
- retry dopo errore;
- conferma e focus dopo `accepted:true`;
- tempistica facoltativa;
- lingua inglese;
- viewport mobile da 320 px;
- accessibilità automatica;
- assenza di richieste esterne automatiche prima dell’interazione.

I test browser usano risposte simulate e non dimostrano una scrittura reale su IONOS: quella verifica resta un requisito di staging prima dell’apertura della waitlist.
