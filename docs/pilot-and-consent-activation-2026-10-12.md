# Invio pilot e preferenze cookie — 12 ottobre 2026

## Ambito e autorizzazione

Il titolare ha richiesto l’apertura del modulo e un banner analytics in stile enterprise, con gestione del consenso. È confermato il percorso solo IONOS. Non vengono aggiunti campi o fornitori, né attivati Google Analytics, newsletter o waitlist.

La build di rilascio imposta privacy pronta, intake attivo e endpoint /api/pilot.php. L’informativa usa il medesimo gate del frontend per descrivere la raccolta. La waitlist resta chiusa perché priva di endpoint. Configurazioni e credenziali del database restano nel file privato del server.

## Invio e sicurezza

Cinque campi già concordati: nome, email, attività, tempistica e breve contesto; niente telefono o upload. Validazione prima del POST JSON, conferma solo dopo accepted:true del backend, bozza mantenuta dopo errore e retry. HTML iniziale inerte finché il client non attacca i propri handler. Il backend conserva validazione server, query parametrizzate, transazione, quota IP pseudonimizzata e quota globale.

I test browser intercettano /api/pilot.php: primo invio con risposta 503, compilazione conservata e assenza di falsa conferma; retry con risposta 201 e accepted:true. Queste prove simulate non dimostrano la scrittura sul database di produzione.

## Banner e consenso

Direzione visiva: pannello bianco in basso, tipografia esistente, colori blu/neutri, bordi e ombra discreti, azioni con pari rilievo e focus visibile. Nessun logo o badge di certificazione. Dialog nativo con contenimento del focus, Escape e chiusura equivalenti al rifiuto, area interna scorrevole e compatibilità con Lenis.

Rifiuta, accetta e gestisci preferenze sono raggiungibili al primo livello. Le memorie necessarie sono identificate separatamente; analytics opzionali non preselezionati quando manca una scelta valida. Salva preferenze applica la scelta del checkbox. Preferenze riapribili dal footer, revoca e sincronizzazione tra schede, scadenza della scelta dopo sei mesi. Dopo la scadenza vengono azzerati anche i controlli opzionali della UI.

Nessun Google tag o richiesta prima del consenso valido, verificato dai test esistenti del modulo analytics. I test del nuovo componente usano analytics disponibili come fixture locale: non attivano GA4 in produzione. La build reale mantiene il gate analytics false: niente banner automatico inutile per soli strumenti tecnici; pannello disponibile dal footer, analytics non selezionabili. Prima di aprire GA4 occorre verificare proprietà e termini e aggiornare l’informativa, che oggi lo descrive disattivato. Il solo aspetto del banner non attesta conformità GDPR dell’intero trattamento.

## Passaggio sul server IONOS

Non è disponibile un accesso autenticato dell’agente al pannello. La prova SSH BatchMode, senza password o modifica delle chiavi, restituisce Permission denied. Non richiedere o conservare credenziali in chat/Git.

1. Caricare il pacchetto frontend verificato in /public, preservando /api, product-clips e /private.
2. Nel file privato /private/delir/config.php cambiare soltanto il booleano enabled da false a true. Non copiare il file in /public.
3. Dal dominio HTTPS inviare una richiesta fittizia dal modulo, controllare la sola riga di prova in phpMyAdmin e rimuoverla. Conferma solo dopo salvataggio. Eventuali invii falliti non devono mostrare successo.
4. In caso di problemi, ripristinare enabled=false e il frontend precedente in anteprima. Il backend chiuso restituisce errore e non salva nuovi dati.

Non dichiarare attivo il sito sulla base della sola build: restano caricamento e abilitazione privata sul server. L’API non invia email automatiche; la gestione iniziale giornaliera del database resta quella scelta dal titolare.

## Misurazione e traffico

L’apertura del modulo misura inizialmente richieste ricevute e qualificate nella gestione privata, senza nuovo tracking browser. Un milione di utenti mensili rimane un obiettivo di acquisizione; non è un risultato della modifica. Non si cambiano campi per ipotesi di conversione e non si propongono A/B test senza traffico misurabile. Il piano SEO/AEO/GEO esistente resta separato dall’apertura dell’intake.

## Validazione locale

Cinque test del nuovo componente passati: assenza di avvio prima della scelta, pari stile delle azioni, default analytics off, rifiuto, accettazione esplicita, scelta granulare, revoca e chiusura senza consenso. Dieci prove E2E Chromium/WebKit passate su intake e preferenze, incluse risposta 503 seguita da retry accepted:true e sincronizzazione tra schede. Verifica con browser visibile IT/EN a 320, 390, 768 e 1440 px: nessun overflow orizzontale, zero violazioni axe A/AA rilevate nel pannello, analytics non selezionabili nella build reale, Escape con rifiuto e zero richieste Google. Screenshot di telefono e desktop ispezionati. Queste prove non attestano l’invio reale o una conformità complessiva.

## Fonti primarie

- [Garante — cookie e altri strumenti di tracciamento](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876).
- [EDPB — consenso](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).
- [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it).

- [Cookiebot — esempi di banner con azioni bilanciate e preferenze separate](https://www.cookiebot.com/en/cookie-banner-examples/).
- [OneTrust — preferenze e blocco preventivo sul proprio sito](https://www.onetrust.com/cookie-policy/).

Il pannello usa titolo breve, testo essenziale e righe semplici per le categorie. Rimossi il marchio decorativo, il riepilogo ridondante della scelta e il checkbox non modificabile dei necessari.

Ulteriore riduzione richiesta dal titolare: padding 12/16 px, categorie in righe compatte, azioni da 44 px. Con analytics disattivati il pannello aperto dal footer mostra solo Chiudi e Gestisci preferenze; non propone consensi a strumenti inattivi. Con analytics disponibili, Accetta/Rifiuta sono affiancati anche su mobile, con Gestisci preferenze sotto.
