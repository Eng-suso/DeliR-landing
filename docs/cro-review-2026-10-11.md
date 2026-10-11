# DeliR — revisione della conversione, 11 ottobre 2026

## Ambito e metodo

Audit della build locale su http://127.0.0.1:4173, commit 47367b7, senza modifiche al prodotto. Skill: website-enterprise-delivery e page-cro. Lettura dei componenti e ispezione con browser visibile in IT/EN a 390×844 e 1440×900. Obiettivo primario: richiesta qualificata per valutare un pilot a pagamento; demo secondaria. Pubblico: consulenti BPM/Operations. Traffico organico/diretto e pubblico consapevole del problema sono ipotesi già confermate nel brief, non dati di acquisizione osservati. Nessun dato GA4, invio di email o tasso di conversione disponibile. Nessuna nuova misura Lighthouse o verifica della produzione.

## Indice diagnostico: 77/100 — preparazione moderata

| Categoria | Punti | Evidenza e limite |
| --- | ---: | --- |
| Chiarezza del valore | 20/25 | Destinatario esplicito e subheadline concreta; headline ampia, differenza più chiara nel testo sottostante. |
| Focus della conversione | 17/20 | CTA primaria condivisa e demo secondaria; Testa/Test apre un’email, non un accesso al prodotto. |
| Corrispondenza pubblico/messaggio | 12/15 | Problemi pertinenti ai consulenti; provenienza e query effettive non osservate. La pagina è meno specifica per Operations interne delle PMI. |
| Fiducia e credibilità | 10/15 | Registrazioni del prodotto, caso dichiarato dimostrativo, condizioni del pilot e pagine di approfondimento; assenza di risultati di clienti verificati. |
| Attrito e UX | 10/15 | CTA visibile nel primo schermo e layout funzionante; dipendenza da client email, pagina molto estesa e matrice densa su telefono. |
| Gestione delle obiezioni | 8/10 | Rischio commerciale e dati affrontati; le nuove FAQ educano sul prodotto, mentre durata, impegno del consulente e consegna richiedono ancora un confronto. |

Il punteggio è un giudizio euristico, non una percentuale di conversione né una previsione di incremento.

## Osservazioni sulla versione attuale

- IT a 390×844: circa 17.616 px di pagina; blocco pilot a circa 13.406 px dal principio. Hero CTA tra 521 e 569 px, quindi visibile nel primo schermo. Il visual del prodotto compare soprattutto sotto la prima schermata. EN: circa 17.370 px e pilot a 13.226 px.
- IT a 1440×900: circa 12.016 px di pagina; pilot a 9.112 px. Hero CTA tra 580 e 628 px. EN: circa 11.987 px e pilot a 9.181 px.
- Dimensioni locali dipendenti da viewport, lingua, font e rendering; non dimostrano abbandono. Scroll e navigazione con ancore permettono di saltare sezioni.
- Cinque moduli demo mostrano il prodotto; sei schede differenzianti successive ripetono molte delle stesse idee; dieci FAQ ripercorrono ulteriormente il viaggio. L’accordion riduce la quantità di risposta visibile ma non la lunghezza delle domande.
- Le quattro CTA principali aprono la stessa bozza mailto con processo, obiettivo e tempistica. Non è possibile osservare un invio completato dal solo clic.
- La pagina dati presenta alcuni controlli come principio da verificare; la landing parla di workspace/autenticazione come fatti. Le formulazioni vanno mantenute allineate allo stato dimostrabile, senza aggiungere rassicurazioni prive di evidenza.

## Priorità e ipotesi da verificare

| Priorità | Categoria | Modifica proposta | Ipotesi e misura |
| --- | --- | --- | --- |
| 1 | Focus / attrito | Conservare la CTA scelta e chiarire subito sotto che il primo passo è un confronto sul progetto; nel frattempo rendere esplicito che si apre un’email. Valutare un modulo breve quando privacy ed endpoint saranno pronti. | Più persone comprendono il passo successivo e completano una richiesta pertinente. Misura principale: richieste qualificate ricevute, non soli clic. |
| 2 | Attrito / focus | Presentare prima una sintesi dell’offerta e compattare il tratto demo–differenzianti. Conservare tutte le scene e i deep link, mostrando i dettagli su richiesta. | Più visitatori interessati arrivano a capire e discutere il pilot. Misura: richieste qualificate per visitatori idonei; raggiungimento del pilot come indicatore intermedio. |
| 3 | Fiducia / obiezioni | Mostrare un esempio dimostrativo del risultato consegnabile: modello con evidenze, confronto scenari, motivazione della raccomandazione; distinguere esempio e perimetro concordato. | Il lettore sa spiegare cosa riceve e porta un progetto più adatto. Misura: comprensione in colloqui di usabilità e quota di richieste qualificabili. |
| 4 | Obiezioni | Conservare le dieci FAQ e aggiungere nel pilot una sintesi di cosa serve, cosa si consegna e cosa si concorda prima del kickoff. Definire internamente impegno e durata prima di pubblicare numeri. | Meno incertezza sull’avvio. Misura: ostacoli dichiarati nei colloqui e completamento delle richieste. |
| 5 | Fiducia / chiarezza | Allineare promesse su dati e controlli alla documentazione; rendere riconoscibile chi conduce il pilot con informazioni reali approvate. | Maggiore comprensione di interlocutore e condizioni; misura qualitativa iniziale, poi richieste qualificate. |

La matrice completa su ogni dispositivo, senza scorrimento orizzontale, resta un vincolo dell’utente: non si propone di sostituirla con schede. Può essere introdotta da una guida sintetica ai criteri più rilevanti, evitando un’altra lunga ripetizione dei benefici. Le dieci FAQ richieste vengono conservate. Headline e CTA approvate restano la base del lavoro.

## Verifica iniziale consigliata

Prima di un A/B test, osservare alcuni consulenti del pubblico target: chiedere dopo una breve esplorazione cosa fa DeliR, cosa lo differenzia, cosa riceverebbero dal pilot e cosa si aspettano premendo Testa DeliR. Far arrivare alla richiesta senza guidarli. Usare appunti anonimi e registrare incomprensioni, non trarre percentuali statistiche da pochi partecipanti. La metrica finale sarà richiesta qualificata / visitatore idoneo quando la misurazione sarà pronta. I clic mailto restano un indicatore di intenzione. Il traffico corrente non è noto: non si presume che sia sufficiente per A/B test.

## Riferimenti esterni e limiti

- [NN/g — Better Link Labels](https://www.nngroup.com/articles/better-link-labels/): etichette coerenti con ciò che accade dopo il clic. L’applicazione alla CTA DeliR è una valutazione dell’audit, non una prova di perdita misurata.
- [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): mantenere visibile il percorso essenziale e offrire approfondimenti su richiesta. L’applicazione alla lunghezza di questa landing è un’ipotesi da osservare, non una regola universale sul numero di schermate.

Le fonti sostengono principi di usabilità; non dimostrano un uplift per DeliR. Nessuna modifica al sito o attivazione di raccolta dati è stata eseguita durante l’audit.

## Aggiornamento successivo all’audit

Su richiesta del proprietario, le CTA primarie ora aprono il modulo pilot invece della bozza email. Il modulo è compilabile in anteprima; invio reale e relativa misurazione restano in attesa di database, endpoint e informativa. Il rilievo mailto descrive quindi la versione oggetto dell’audit, non l’attuale destinazione dei pulsanti. Non è stato assegnato un nuovo punteggio o dedotto un uplift. Vedere `pilot-form-activation.md`.
