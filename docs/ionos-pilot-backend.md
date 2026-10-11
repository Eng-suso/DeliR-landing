# Richieste pilot su IONOS

## Stato

Database MariaDB standard creato dall’utente. I riferimenti ricevuti non vengono trascritti nel repository. Backend PHP predisposto, non distribuito e non collegato al database di produzione. Frontend e backend restano chiusi per impostazione predefinita. Nessun invio reale verificato.

## Primo passo: creare le tabelle

IONOS → database → phpMyAdmin → selezionare il database creato → Importa → scegliere `server/ionos/schema.sql` → Esegui. Il file crea `pilot_applications` e `pilot_rate_limits`; non contiene credenziali né dati personali. Verificare che entrambe compaiano. Non eseguire i test su IONOS: eliminano tabelle e sono solo per database temporanei.

## Configurazione e caricamento successivi

Struttura rispetto alla radice dello spazio web:

```text
/public/                   ← directory associata a delir.it
  api/pilot.php            ← unico endpoint pubblico
/private/delir/            ← fuori da /public e dalle directory di altri domini
  config.php               ← configurazione privata compilata sul server
  pilot.php                ← copia di server/ionos/pilot.php
```

L’account SFTP attuale è limitato a `/public`: per caricare `/private` occorre un accesso alla radice dello spazio web oppure il file manager IONOS. Non spostare la configurazione dentro `/public`. Verificare che nessun dominio punti a `/private` o alla radice dello spazio web.

Servono PHP 8.3 o successivo, `pdo_mysql` e `mbstring`. Copiare `server/ionos/config.example.php` in `/private/delir/config.php` e compilare lì host, porta 3306, database, utente e password. Generare `rate_secret` sul server con `bin2hex(random_bytes(32))`; non riportarlo in chat/Git. Tenere `enabled=false` fino alle verifiche e all’informativa completa. Limitare i permessi al proprietario e verificare la lettura da PHP.

Il database è accessibile soltanto dalla rete IONOS. Il DSN usa la rete interna; cifratura della tratta applicazione–database e condizioni del servizio vanno confermate con IONOS, non sono attestate dal codice. Fonti ufficiali consultate l’11 ottobre 2026: [IONOS: PHP/PDO e accesso dalla rete IONOS](https://www.ionos.it/aiuto/hosting/utilizzo-di-php-per-i-progetti-web/collegarsi-a-php-su-un-database-mysql-esempi-di-codice/), [PHP: PDO MySQL](https://www.php.net/manual/en/ref.pdo-mysql.php).

## Contratto e protezioni

- POST JSON a `/api/pilot.php`, stesso dominio HTTPS, origine esatta `https://delir.it`. Niente CORS o GET con dati. Non sono fidati header forwarded del client. Se IONOS termina TLS a monte, verificare `HTTPS` nel runtime senza fidarsi arbitrariamente degli header del browser.
- Sei chiavi esatte: cinque campi e `source=delir-pilot-application`. Allowlist attività/tempistiche; nome 1–100 caratteri, email valida entro 254 byte, descrizione 20–600 caratteri. Corpo entro 8 KiB, lettura limitata anche senza Content-Length.
- Query parametrizzate native e tabelle InnoDB. Conferma `201 {"accepted":true}` soltanto dopo commit. Errori generici, nessun payload, IP o dettaglio SQL nei log dell’applicazione.
- Cinque invii validi per IP e cento complessivi per finestra fissa di 15 minuti. Contatori serializzati nel database; salvataggio fallito annulla anche l’incremento. Limiti iniziali da monitorare, non protezione DDoS completa: un bot può inviare richieste dirette e distribuire gli IP.
- Nessun IP in chiaro nel database dell’applicazione; identificativi HMAC pseudonimizzati, non dichiarati anonimi. Scadono alla fine della finestra, cancellati al successivo traffico. Pianificare anche `DELETE FROM pilot_rate_limits WHERE expires_at <= UNIX_TIMESTAMP()` con job privato giornaliero per periodi senza traffico: job non ancora configurato. I log di hosting IONOS possono contenere IP e richiedono verifica separata.
- Raccolta pubblica senza account. Nessun endpoint per leggere/elencare richieste. Consultazione tramite IONOS/phpMyAdmin con accessi controllati; nessuna email automatica o CRM aggiunto.

Conservazione proposta delle richieste senza seguito: 12 mesi dall’ultimo contatto. `created_at` registra soltanto la ricezione. Prima dell’attivazione definire revisione/cancellazione periodica e registro dei contatti successivi; nessuna cancellazione indiscriminata dei rapporti contrattuali. Non sono attestati conformità GDPR o cancellazione automatica delle richieste.

## Attivazione e rollback

1. Verificare tabelle, PHP/estensioni, posizione/permessi privati, HTTPS e informativa pubblica effettiva.
2. Abilitare il backend durante una prova controllata con dati fittizi; verificare riga salvata, conferma solo dopo salvataggio, rifiuti/quote e assenza di dettagli nei messaggi/log; eliminare i dati di prova. Per provare la UI usare una build controllata prima di aprire la raccolta pubblica.
3. Solo dopo la prova configurare `VITE_PILOT_ENDPOINT=/api/pilot.php`, `VITE_PRIVACY_NOTICE_URL` effettivo e `VITE_LEAD_CAPTURE_READY=true` e `VITE_PRIVACY_NOTICE_READY=true`. GA4/waitlist rimangono separati. Distribuire `dist` in `/public`; caricare il backend privato separatamente, non incluso nella build Vite.
4. Verificare browser e database sul dominio reale. Nessun merge/deploy automatico con questa modifica.

Rollback: `enabled=false` blocca subito gli invii; ripristinare il frontend in anteprima. Conservare richieste già ricevute secondo le regole definite. Il fallback SPA non deve mascherare endpoint mancanti. PHP deve eseguire il file: le infrastrutture statiche Cloudflare precedenti non eseguono il backend. Non distribuire una raccolta attiva su un server statico.

## Diagnosi del 503

L’endpoint mantiene la risposta pubblica generica. La versione aggiornata scrive soltanto timestamp e un codice fisso in `/private/delir/diagnostic.log`, con dimensione limitata a circa 64 KiB. Nessuna configurazione, password, chiave, IP, payload o testo dell’eccezione. La cartella deve essere scrivibile da PHP e fuori dalle directory pubbliche. Se manca la cartella o il file non è scrivibile, il log PHP di hosting riceve soltanto `delir_pilot_diagnostic_unavailable`.

Per la diagnosi caricare entrambi i file aggiornati nelle rispettive destinazioni (`public/api/pilot.php` e `server/ionos/pilot.php`), senza sovrascrivere `config.php`. Ripetere una sola prova controllata, ripristinare `enabled=false` e consultare l’ultima riga di `diagnostic.log` in Webspace Explorer. Non condividere il file di configurazione.

| Codice privato | Verifica successiva |
| --- | --- |
| `capture_disabled` | Il valore deve essere il booleano `true` durante la prova, salvato nel file corretto, poi ripristinato a `false`. |
| `private_config_missing` / `private_library_missing` | Percorso `/private/delir` e nomi `config.php` / `pilot.php`. |
| `private_config_invalid` / `private_library_invalid` | Sintassi PHP/lettura file; attenzione agli apostrofi e ai backslash nella password, senza condividerla. |
| `php_extensions_missing` | Versione PHP e disponibilità di `mbstring` e `pdo_mysql`. |
| `rate_secret_invalid` | Stringa di 64 caratteri esadecimali minuscoli, senza spazi o a capo. |
| `database_configuration_invalid` | Host, porta, database e credenziali compilati nei campi corretti. |
| `database_connection_failed` | Accesso al database dalla rete IONOS: controllare riferimenti e password sul server. |
| `database_write_failed` | Importazione delle due tabelle, struttura/permessi e spazio disponibile. |
| `request_failed` | Errore residuo da indagare, senza esporre configurazione o stack trace. |

La prova HTTP da PowerShell deve usare dati fittizi e `Origin: https://delir.it`. Un 201 non basta alla verifica operativa: controllare anche la riga in phpMyAdmin, poi rimuovere soltanto il dato di prova. Non attivare il modulo pubblico finché informativa e prova completa non sono pronte.

## Evidenza precedente e verifica diagnostica

La modifica diagnostica passa 40 controlli PHP locali, inclusi cinque scenari eseguiti sul vero entrypoint in una directory temporanea: invio chiuso, config non valido, libreria/config mancanti e estensioni mancanti. In tutti i casi la risposta resta generica e il codice va nel solo log privato. Sintassi dei due file PHP aggiornata verificata. Nessuna prova o mutazione sul server IONOS è stata eseguita da Codex durante questa diagnosi.

Sintassi dei tre file PHP e 25 controlli locali passati su PHP 8.5.11: payload, UTF-8, guardie HTTP/origine, gate chiuso, dimensione del corpo e fallimento connessione senza conferma. Runtime portabile ufficiale con SHA-256 verificato, fuori dal repository. Nessun database locale disponibile: test SQL non eseguiti localmente.

Il check GitHub `quality` impone test con MariaDB 11.8 temporaneo: importazione, salvataggio, testo SQL injection trattato come dato, quote IP/globali, scadenza, assenza di IP in chiaro e rollback su inserimento fallito. Lo step PHP/MariaDB del run GitHub 38154269516 è passato sul commit cbd912a; anche typecheck, lint, coverage e build sono passati. Le ulteriori verifiche browser/performance dello stesso run erano ancora in corso al momento del controllo. Questi test non verificano IONOS o il database di produzione.

## Prova riferita dal titolare

L’11 ottobre 2026 il titolare ha confermato risposta accepted: true e una riga fittizia nella tabella pilot_applications dopo aver corretto il percorso del file privato. Ha confermato anche la successiva chiusura e pulizia. Non sono stati conservati payload o credenziali nel repository. La prova non sostituisce la verifica UI sul dominio reale né completa i requisiti privacy.

## Manutenzione privata predisposta

server/ionos/maintenance.php va copiato esclusivamente in /private/delir. Esecuzione CLI con --dry-run o --apply esplicito: rimuove contatori scaduti e diagnostica oltre sette giorni, senza leggere o cancellare richieste pilot. Procedura, scadenze manuali, gestione diritti, incidenti e ripristini in [privacy-operations.md](privacy-operations.md). Il titolare ha confermato accesso solo SFTP: SSH e cron lato server non sono ancora configurati. Il cron HTTP del pannello non esegue questo file privato.

Validazione locale: sintassi PHP e 52 controlli passati, inclusi dry-run senza modifiche, scadenza/retention dei log, idempotenza ed errori CLI senza dati. La CI include prova MariaDB di contatori scaduti/attivi e conservazione di una richiesta fittizia; non eseguita localmente perché manca un database isolato. Non è stata eseguita manutenzione sul database di produzione.
