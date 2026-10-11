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
3. Solo dopo la prova configurare `VITE_PILOT_ENDPOINT=/api/pilot.php`, `VITE_PRIVACY_NOTICE_URL` effettivo e `VITE_LEAD_CAPTURE_READY=true`. GA4/waitlist rimangono separati. Distribuire `dist` in `/public`; caricare il backend privato separatamente, non incluso nella build Vite.
4. Verificare browser e database sul dominio reale. Nessun merge/deploy automatico con questa modifica.

Rollback: `enabled=false` blocca subito gli invii; ripristinare il frontend in anteprima. Conservare richieste già ricevute secondo le regole definite. Il fallback SPA non deve mascherare endpoint mancanti. PHP deve eseguire il file: le infrastrutture statiche Cloudflare precedenti non eseguono il backend. Non distribuire una raccolta attiva su un server statico.

## Evidenza

Sintassi dei tre file PHP e 25 controlli locali passati su PHP 8.5.11: payload, UTF-8, guardie HTTP/origine, gate chiuso, dimensione del corpo e fallimento connessione senza conferma. Runtime portabile ufficiale con SHA-256 verificato, fuori dal repository. Nessun database locale disponibile: test SQL non eseguiti localmente.

Il check GitHub `quality` impone test con MariaDB 11.8 temporaneo: importazione, salvataggio, testo SQL injection trattato come dato, quote IP/globali, scadenza, assenza di IP in chiaro e rollback su inserimento fallito. Lo step PHP/MariaDB del run GitHub 38154269516 è passato sul commit cbd912a; anche typecheck, lint, coverage e build sono passati. Le ulteriori verifiche browser/performance dello stesso run erano ancora in corso al momento del controllo. Questi test non verificano IONOS o il database di produzione.
