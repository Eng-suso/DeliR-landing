# Privacy operations — landing e richieste pilot

Procedura predisposta l’11 ottobre 2026. È una proposta operativa da mettere in uso prima dell’apertura del modulo; non documenta attività già eseguite sul server. Si applica ai contatti della landing, non ai documenti o processi dei clienti nei pilot. Non conservare richieste, identificativi, email, password o prove contenenti dati personali in Git.

## Responsabilità e canale

Il titolare gestisce le richieste attraverso contact@delir.it su IONOS. Accedere con account personali autorizzati, evitare copie su Gmail o strumenti AI e controllare eventuali inoltri/client di posta configurati. Proteggere l’account IONOS con autenticazione a più fattori, ove disponibile, e verificare la protezione separata della casella. Nessun invio automatico o servizio newsletter è configurato dal codice corrente.

## Valutazione delle richieste spontanee

Finalità: comprendere la richiesta, rispondere e valutare il perimetro di un pilot. Per la persona che richiede misure precontrattuali ed è futura parte del contratto: art. 6(1)(b). Per referenti aziendali e contatti generici: proposta art. 6(1)(f), interesse a rispondere alla richiesta ricevuta. La valutazione proposta considera aspettativa di risposta, soli dati di contatto e breve descrizione, niente newsletter/profilazione, accessi limitati, diritto di opposizione e conservazione delimitata. Rischi: inserimento di dati di terzi, riutilizzo commerciale non richiesto, accesso o conservazione eccedenti. Misure: avviso nel modulo, nessun upload, limite del testo, nessun inoltro automatico, revisione delle richieste. Documentare fuori da Git l’esito della verifica di necessità e bilanciamento sul trattamento effettivo; non estendere questa base a marketing o dati del pilot.

## Conservazione e revisione

Regola scelta: richieste senza seguito per non oltre 12 mesi dall’ultimo contatto. I rapporti contrattuali passano a regole separate, comunicate prima del relativo trattamento. Prima di aprire il modulo, assegnare al titolare la revisione periodica e un controllo delle scadenze; nessuna automazione è stata installata per questa attività.

Nel database attuale esiste created_at, ma non last_contact_at o stato del rapporto. Non cancellare automaticamente righe solo perché la loro creazione risale a 12 mesi: potrebbe esserci una conversazione recente. Durante la revisione usare ricevuti/inviati nella Webmail e il registro operativo privato per identificare ultimo contatto e scadenza. Registrare solo riferimenti minimi necessari in uno spazio protetto fuori dal repository. Per il volume iniziale, verifica manuale settimanale e cancellazione entro la scadenza; se il volume cresce, implementare lo stato e le scadenze prima di affidarsi a una cancellazione automatica.

Per ogni richiesta scaduta o da cancellare:

1. Verificare la richiesta e l’eventuale obbligo o motivo specifico di conservazione. Non mantenere tutte le richieste per una generica possibilità di contenzioso.
2. In phpMyAdmin controllare la singola riga e rimuovere solo quella identificata. Non eseguire DELETE senza filtro né esportare l’intera tabella per una singola richiesta.
3. Rimuovere la corrispondenza pertinente da ricevuti, inviati, archivio e cestino, nonché download ed eventuali copie gestite dal titolare. Verificare le funzioni della casella e della sincronizzazione; non promettere una cancellazione dai sistemi di altri destinatari.
4. Registrare fuori da Git data, ambito ed esito dell’operazione con il minimo necessario. Se alcuni dati restano per una base distinta, limitarne l’accesso e spiegare all’interessato motivo e periodo applicabile.

## Backup e ripristini

La guida IONOS per i database Hosting dichiara backup automatici giornalieri disponibili per 14 giorni. Questo non prova la durata dei backup della posta o la possibilità di eliminare una singola richiesta da un backup; questi punti vanno verificati col fornitore. La cancellazione dal database attivo non implica sparizione immediata dalle copie di sicurezza.

Evitare backup manuali aggiuntivi non necessari. Se occorrono, definire prima luogo protetto, accessi, durata e gestione della cancellazione; niente dump in Git. Prima di riaprire un database ripristinato, applicare nuovamente le cancellazioni avvenute dopo la data del backup. Il registro minimo privato delle operazioni deve consentirlo e avere una propria durata limitata al periodo dei backup verificato. Non promettere cancellazione immediata da backup che non si possono modificare. Aggiornare la versione definitiva dell’informativa con il comportamento verificato.

## Contatori antiabuso e diagnostica

I contatori HMAC scadono in finestre di 15 minuti; la cancellazione su traffico non garantisce pulizia nei periodi inattivi. È predisposto server/ionos/maintenance.php, da caricare esclusivamente in /private/delir accanto a pilot.php e config.php. Non modifica o legge le richieste pilot. Rimuove contatori scaduti e righe diagnostiche più vecchie di sette giorni (periodo tecnico proposto), preservando contatori attivi e log recenti. Dry-run restituisce conteggi senza modificare dati. Il file non offre un endpoint HTTP.

Da SSH, nella cartella privata, con il binario PHP effettivamente disponibile:

```sh
php maintenance.php --dry-run
php maintenance.php --apply
```

Prima eseguire la prova controllata con dati fittizi. Poi configurare un cron **lato server** almeno giornaliero, monitorandone uscita e codice di errore. Il campo HTTP GET del pannello IONOS non esegue questo file CLI: non renderlo pubblico e non mettere una password nella URL. La guida IONOS distingue i cron web da quelli lato server; richiedono accesso SSH. Non è stato ancora configurato alcun cron di manutenzione. Finché non è verificato, l’informativa non deve dichiarare cancellazione automatica o scadenza effettiva di 15 minuti per i record memorizzati.

I log di hosting IONOS hanno regole separate: verificare configurazione e termini effettivi. La funzione di manutenzione interviene solo su diagnostic.log dell’applicazione.

## Richieste sui diritti

Controllare contact@delir.it ogni giorno lavorativo. Annotare privatamente ricezione, diritto richiesto e termine; verificare l’identità in modo proporzionato, iniziando dal canale già usato, senza chiedere sistematicamente documenti di identità. Cercare solo nei sistemi pertinenti: casella IONOS, database e copie controllate. Non trasmettere dati di altri interessati nelle risposte.

Rispondere senza ingiustificato ritardo e normalmente entro un mese. Se ricorrono complessità o numero di richieste, l’eventuale proroga fino a due mesi aggiuntivi richiede comunicazione e motivi entro il primo mese. Valutare accesso/rettifica/cancellazione/limitazione/portabilità/opposizione secondo i presupposti applicabili. In caso di rifiuto, comunicare motivi e possibilità di reclamo e ricorso. La revoca del consenso Analytics non cancella automaticamente dati già inviati; GA4 resta disattivato e necessita di procedura separata prima dell’attivazione.

## Incidenti

In caso di accesso sospetto o divulgazione: bloccare la raccolta tramite enabled=false, contenere l’accesso, conservare solo prove necessarie fuori da Git e coinvolgere il supporto IONOS. Valutare dati, interessati, conseguenze e rischio, documentando anche la decisione di non notificare. Se dovuta, notifica al Garante senza ingiustificato ritardo e, ove possibile, entro 72 ore dalla conoscenza; per rischio elevato valutare anche comunicazione agli interessati. Ripristinare il servizio solo dopo aver corretto la causa e applicato cancellazioni eventualmente riemerse dal backup.

## Verifica contrattuale da completare

- Conservare privatamente i termini applicabili al contratto recente e l’accordo sul trattamento incorporato: l’indicazione generale IONOS non sostituisce questa evidenza.
- Confermare per Hosting, database e Mail Basic: perimetro art. 28, localizzazione, sub-responsabili e trasferimenti, backup e cancellazione, supporto per diritti e incidenti. Il link al DPA nei termini pubblici consultati restituisce 404; non assumere che il PDF di aiuto del 2021 sia la versione applicabile.
- Verificare inoltri e funzioni AI effettivamente attive nella casella prima di descrivere destinatari e finalità definitivi.
- Verificare cron privato e gestione delle scadenze, poi completare informativa e prova UI di produzione. Non aprire GA4 con questa attività.

## Fonti primarie consultate

- [GDPR, artt. 5–6, 12–22, 28, 32–34](https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it).
- [IONOS: condizioni generali, ambito hosting ed email](https://www.ionos.it/terms-gtc/condizioni-generali-per-litalia/).
- [IONOS: trattamento incorporato nei contratti dal 19 luglio 2022](https://www.ionos.it/aiuto/protezione-dei-dati/informazioni-generali-sullordinanza-di-base-sulla-protezione-dei-dati-oderr/contratto-per-il-trattamento-dei-dati/).
- [IONOS: backup automatici database per 14 giorni](https://www.ionos.it/aiuto/hosting/mysql-datenbank-sichern-wiederherstellen/ripristinare-un-database-mysql-o-mariadb-da-un-backup-di-7-giorni/).
- [IONOS: cron web e cron lato server](https://www.ionos.it/aiuto/hosting/cronjob/cronjob-manager-di-11-ionos/).
