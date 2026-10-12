# DeliR: percorso mobile e misurazione — 12 ottobre 2026

Richiesta: prodotto prima nella hero, demo leggibili, meno ripetizioni, criteri di confronto chiari, promesse dati coerenti e funnel. Brief già confermato: consulenti BPM/Operations e Operations PMI; CTA pilot a pagamento, IT/EN, traffico organico/diretto consapevole del problema. Nessuna promessa di incremento del traffico o delle conversioni.

Baseline CRO dell’audit precedente: 67/100 (chiarezza 20/25, focus 15/20, match 11/15, fiducia 8/15, attrito 5/15, obiezioni 8/10). Indice euristico, non una conversione osservata. Il modulo in anteprima era il limite principale; il rilascio già mergiato lo abilita nella build. Nessun A/B test prima di dati sufficienti.

## Interventi e verifica

- Hero: headline e CTA conservate, subheadline breve su telefono, condizioni dettagliate nel pilot; video prima del primo scroll completo a 320/390 px. Ipotesi: comprensione del prodotto più rapida.
- Prova: dettagli ingranditi delle registrazioni reali su mobile, con anteprime a risoluzione sufficiente e registrazione integrale nel dialog. Nessun risultato simulato presentato come risultato cliente.
- Percorso: sintesi di output/perimetro/milestone/prezzo subito dopo la hero; una fase della demo alla volta selezionabile tramite link, tutti i deep link preservati. I sei criteri sono un approfondimento apribile; tutte le dieci FAQ restano nel documento e nello schema.
- Confronto: sintesi dei tre criteri decisivi prima della matrice; tabella intera, otto colonne e valori originali conservati. Nessuno scroll orizzontale. Il vincolo delle otto colonne limita la leggibilità dei dettagli su telefono; le definizioni restano in /comparison-sources.
- Dati: isolamento/workspace dichiarati come principio progettuale e controllo da verificare nella configurazione del pilot. Provider AI e uso delle fonti si concordano prima dei dati reali. Coerente con /security-data, senza inventare attestazioni.

## Piano di misurazione

Readiness iniziale 47/100: allineamento 18/25, modello 6/20, integrità 8/20, conversione 6/15, attribuzione 2/10, governance 7/10. Indice diagnostico: GA4 è spento, non ci sono dati con cui ottimizzare. Prima rimedi: intake operativo, definizione del funnel, test; poi proprietà e informativa aggiornate prima di aprire GA4. Questa modifica prepara gli eventi ma mantiene il gate Google disattivato.

| Evento | Trigger | Decisione |
| --- | --- | --- |
| pilot_cta_clicked | Link al modulo dalla landing | Quali posizioni generano interesse |
| pilot_form_started | Prima modifica di campo, una volta dopo consenso | Attrito tra arrivo e compilazione |
| pilot_submit_attempt | Campi validi, subito prima del POST | Quante compilazioni arrivano all’invio |
| pilot_submit_failed | POST fallito, nessuna conferma | Problemi di consegna e retry |
| generate_lead | Risposta backend accepted:true | Richieste realmente accettate |

Solo lingua, nome fisso del modulo, sezione allowlisted e URL canonico senza query libere. Nessun nome/email/contenuto, messaggio di errore, identificatore o dato del cliente. Eventi subordinati sia al gate sia al consenso valido e all’analytics avviato; nessun recupero retroattivo delle interazioni senza consenso. Conversione soltanto generate_lead; i retry contano nuovi tentativi, mai una conversione se il backend risponde errore. Il database resta la fonte operativa delle richieste; GA4 coprirà solo il campione consensuale. Enhanced Measurement automatico del form dovrà essere disabilitato nella proprietà per evitare duplicati prima dell’attivazione. Non sono implementati nuovi cookie o nuovi fornitori.

Fonti: [Google — eventi](https://developers.google.com/analytics/devguides/collection/ga4/events), [Google — generate_lead](https://developers.google.com/analytics/devguides/collection/ga4/reference/events), [Garante — cookie](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876).

## Evidenze locali preliminari

Browser visibile, IT/EN a 320, 390, 820 e 1440 px: zero violazioni axe A/AA rilevate, nessun overflow. A 390 px IT il prodotto inizia a circa 465 px e la pagina misura circa 10.200 px, rispetto ai 17.488 px dell’audit precedente; a 320 px inizia a circa 504 px. Misure locali, senza dichiarare aumento della conversione o metriche CWV di campo. Gli screenshot hanno individuato una risoluzione insufficiente delle anteprime ritagliate, corretta con sizes dedicato. CI e prove del rilascio rimangono i gate di pubblicazione.

## Rilascio precedente completato

PR #8 mergiata in main (53b6e53). Frontend della CI e15efae pubblicato su IONOS tramite gestore file, con backup dei file di ingresso e documenti precedenti; API, cartelle private e video preservati. Nel file privato è cambiato soltanto enabled=false in true, con confronto delle altre quattordici righe nell’editor senza mostrarle o scaricarle. Non sono state lette o archiviate credenziali. IONOS ha mostrato un errore generico dopo il salvataggio, ma l’API verificata risponde 405 a GET e 201 accepted:true a una sola richiesta interamente fittizia. La riga tecnica rimane nel database per la revisione del titolare; nessuna cancellazione automatica. GA4 resta spento. Queste prove riguardano l’attivazione già mergiata; le modifiche mobile sono il rilascio successivo.
