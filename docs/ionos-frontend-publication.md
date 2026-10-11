# Pubblicare il frontend con HTML IT/EN su IONOS

Preparazione locale: `npm run build`. Caricare **il contenuto** di `dist/` nella directory `/public` collegata a delir.it, inclusi `.htaccess`, `index.php`, `index.html`, `seo/`, `assets/`, `no-script.css`, `robots.txt` e `sitemap.xml`. Non caricare sorgenti, `node_modules`, file `.env` o la directory privata.

Prima dell'upload conservare una copia del frontend e dell'eventuale `.htaccess` esistente. Se quest'ultimo contiene regole operative, confrontarle e integrarle: non sostituirlo alla cieca. SFTP deve mostrare anche i file nascosti. Caricare prima gli asset e i documenti `seo/`, poi i file di ingresso; non svuotare `/public` né rimuovere l'API funzionante. Nessuna modifica a `/private/delir/config.php` o alle credenziali database.

Il file pubblico `index.php` serve esclusivamente HTML generato dalla build. Nessun dato visitatore viene scritto; nessuna connessione al database. Senza JavaScript i contenuti e le FAQ restano leggibili; i moduli sono nascosti e viene mostrato il contatto email, evitando un invio GET accidentale.

Verificare dopo upload:

- `https://delir.it/` e `https://delir.it/?lang=en`: 200, lingua e canonical corretti nell'HTML iniziale.
- `/pilot`, `/security-data`, `/comparison-sources`: 200, anche dopo ricarica e nelle varianti EN.
- `/privacy` e `/waitlist`: `noindex, follow` nell'HTML iniziale.
- `/indirizzo-inesistente`: 404 reale.
- `/robots.txt` e `/sitemap.xml`: 200; nessun asset mancante e nessun errore server dopo le nuove regole.
- API pilot esistente e configurazione privata preservate. Non usare richieste con dati reali per un controllo tecnico.

La risposta HTTPS e gli eventuali reindirizzamenti HTTP/www devono essere controllati in produzione prima di richiedere l'indicizzazione. Se IONOS rifiuta una direttiva `.htaccess`, ripristinare la copia e correggere la direttiva identificata nei log: non esporre directory o file privati per risolvere l'errore.

Solo dopo le verifiche: inviare `https://delir.it/sitemap.xml` in Search Console e usare Controllo URL → Test URL pubblicato per home IT/EN e pilot. Controllare canonical e rendering, poi richiedere l'indicizzazione. Verificare anche Impostazioni → Search generative AI secondo la [guida Google](https://support.google.com/webmasters/answer/16908024).

Pubblicazione e impostazioni Search Console non eseguite dall'agente in questa attività. Per rollback ripristinare ingressi/regole/documenti della build precedente mantenendo i suoi asset; non cambiare il database o l'API. Il routing PHP è specifico per IONOS/Apache: gli ambienti Cloudflare esistenti non sono stati migrati a questo comportamento.
