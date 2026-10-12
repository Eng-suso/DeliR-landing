# DeliR — cosa manca alla landing pubblicata

Audit mirato del 11 ottobre 2026. Nessuna modifica al prodotto o attivazione di raccolta dati. Skill: website-enterprise-delivery, page-cro, seo-audit. Obiettivo: richieste qualificate per un pilot; pubblico BPM/Operations, IT/EN. Fonti: repository, documentazione operativa, controlli HTTP attuali e precedenti verifiche browser della release 30479f6. Nessun accesso diretto ai report GA4/GSC, ai log del provider o al database di produzione.

Il vincolo principale è operativo: /pilot risponde 200 e mostra l’anteprima; /privacy risponde 200 e contiene ancora la bozza. Il test manuale del backend riuscito, riferito dal titolare, non equivale a un invio completo dal modulo pubblico.

## Preparazione alla conversione: 67/100 — bassa

Indice euristico, non tasso di conversione. Non confrontabile direttamente con il precedente audit della versione con CTA mailto.

| Categoria | Punti | Evidenza / limite |
| --- | ---: | --- |
| Chiarezza del valore | 20/25 | Problema e meccanismo espliciti; headline ampia. |
| Focus della conversione | 15/20 | CTA coerenti verso il pilot, ma richiesta non inviabile. |
| Pubblico e messaggio | 11/15 | Consulenti ben rappresentati; intenti e traffico effettivi non osservati. |
| Fiducia | 8/15 | Demo e condizioni del pilot presenti; risultati di clienti verificati assenti. |
| Attrito e UX | 5/15 | Modulo strutturato e controllato, ma in anteprima; percorso lungo e confronto denso. |
| Obiezioni | 8/10 | Scope, pagamento e uscita espliciti; durata e impegno da concordare. |

### Priorità, vincoli e verifica

1. **Invio reale — focus/attrito.** Completare informativa e modalità operative, poi aprire i gate e verificare browser → endpoint → riga salvata → conferma. Ipotesi: un visitatore interessato può completare una richiesta. Misura iniziale: prova end-to-end; successivamente richieste qualificate ricevute.
2. **Gestione delle richieste — attrito/fiducia.** Definire chi legge il database, con quale frequenza e come risponde. Il backend non configura notifiche o email automatiche. Misura: richieste prese in carico e tempo di risposta; promessa pubblica solo dopo aver definito la capacità reale.
3. **Misurazione — focus.** GA4 resta disabilitato dai gate privacy/analytics. Attivarlo solo quando configurazione e consenso sono pronti; validare CTA → avvio modulo → invio accettato senza inviare valori dei campi. Misura: richieste qualificate e completamento del percorso per traffico misurabile.
4. **Prova concreta — fiducia.** Ricavare dal primo pilot un caso autorizzato con problema, fonti, risultato e misurazione. Prima, rendere chiaro un esempio dimostrativo del consegnabile. Ipotesi: il consulente comprende cosa riceve. Verifica qualitativa con consulenti, poi qualità delle richieste.
5. **Comprensione dell’offerta — obiezioni.** Verificare con consulenti quanto siano chiari primo passo, impegno e consegnabili; precisare solo condizioni effettivamente definite. Nessuna nuova headline o CTA proposta: quelle approvate restano la base.

Interventi rapidi: diagnosi GSC e definizione della presa in carico manuale. Interventi di maggiore impatto: attivazione completa dell’intake e prova di un pilot reale. Non si raccomandano A/B test prima di risolvere i vincoli fondamentali e conoscere il traffico.

## SEO Health Index limitato a crawlability/indexation: 90/100 — buono

L’indice riguarda soltanto disponibilità e scoperta delle pagine: peso crawlability/indexation redistribuito al 100%. Technical Foundations, On-Page, Content Quality ed Authority fuori dal punteggio di questo controllo mirato; nessun nuovo audit completo, analisi backlink o dato Core Web Vitals sul campo. Non è un voto SEO complessivo, né una conferma di indicizzazione o ranking.

| Categoria | Punteggio | Peso | Contributo |
| --- | ---: | ---: | ---: |
| Crawlability & Indexation | 90 | 100% | 90 |

**Rilievo:** elaborazione della sitemap non confermata. Categoria: Crawlability & Indexation. Evidenza: ultimo stato GSC fornito dall’utente «Impossibile leggere la Sitemap», zero pagine; controllo HTTP attuale /sitemap.xml 200, application/xml. Severità: alta. Confidenza: alta sull’esistenza dell’ultimo errore riportato; causa e stato attuale GSC non verificati. Impatto: −10. Perché conta: la scoperta tramite sitemap non è confermata, ma questo non dimostra che l’intero sito sia bloccato. Raccomandazione: ottenere dettaglio dell’errore e risultato del test URL pubblicato in GSC, quindi intervenire sulla causa. Nessun blocco critico di indicizzazione dimostrato.

Priorità SEO: chiarire prima questo errore; poi sviluppare pagine originali sulle domande del pubblico, sostenute da esempi e competenza reale. Un milione di utenti mensili richiede anche distribuzione, domanda sufficiente e autorevolezza: non è un risultato garantibile con la sola ottimizzazione della landing. La comparsa nelle risposte ChatGPT resta non verificata; robots permissivo e HTTP 200 dal nostro client non provano l’accesso dai sistemi OpenAI.

Fonti primarie: [Google — report Sitemap](https://support.google.com/webmasters/answer/7451001?hl=it), [OpenAI — ChatGPT Search](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt).

## Chiusura operativa

PR #8 ancora da integrare in main secondo l’ultimo stato verificato. Il redirect HTTPS aggiunto manualmente sul server va riportato nella configurazione versionata prima del prossimo pacchetto, per conservarlo nelle pubblicazioni successive. Verifica della prima esecuzione automatica del cron e condizioni privacy/fornitori non vengono considerate completate sulla base della sola disponibilità del sito.
