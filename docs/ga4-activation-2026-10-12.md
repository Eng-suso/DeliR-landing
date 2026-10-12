# GA4 — attivazione con consenso

Autorizzazione del titolare del 12 ottobre 2026. Proprietà DeliR e stream https://delir.it, ID pubblico G-6D2FN0HCDS verificati nel pannello autenticato. I termini sul trattamento risultano accettati l’11 ottobre; non sono stati accettati nuovi contratti dall’agente.

## Configurazione verificata

Eventi e dati utente: 2 mesi; rinnovo alla nuova attività disattivato. Misurazione avanzata disattivata per evitare duplicati e raccolta automatica. Google Signals e dati forniti dagli utenti inattivi; nessun User-ID implementato. Raccolta granulare posizione/dispositivo disattivata. Personalizzazione annunci non consentita in tutte le regioni; condivisioni opzionali dell’account disattivate. La riduzione della retention non riguarda i report aggregati standard.

Il sito usa consenso preventivo: nessun tag, richiesta o ping Google prima dell’accettazione. Ads sempre denied. Cookie Google massimo 180 giorni senza rinnovo. Rifiuto, chiusura, revoca e scadenza sono gestiti; il rifiuto non impedisce il modulo. Informativa IT/EN aggiornata per finalità, dati, fornitore, conservazione, diritti e trasferimenti; non si afferma trattamento esclusivamente UE o certificazione generale GDPR.

## Misurazione

Indice diagnostico prima della prova reale: 68/100, Unreliable (decisioni 22/25, modello 18/20, integrità 8/20, conversioni 10/15, attribuzione 2/10, governance 8/10). Le proprietà e i test sono verificati, ma mancano ancora ricezione reale e campione osservabile: non usare dati per ottimizzare prima della validazione. Remediation: rilascio verificato, richiesta di raccolta, Tempo reale, poi controllo delle richieste effettive nel database.

Piano eventi in `mobile-conversion-2026-10-12.md`: page_view e cinque eventi del funnel. Conversione generate_lead soltanto dopo accepted:true; clic e tentativi non sono conversioni. Conteggio previsto ogni richiesta accettata, non ogni sessione. Nessun campo o contenuto libero in GA4. Il database è la fonte operativa; GA4 rappresenta soltanto chi accetta e non misura tutti i visitatori. URL canonici e referrer vuoto riducono l’attribuzione: non presentare acquisizione/campagne come complete.

Responsabile operativo: titolare DeliR. Per richieste diritti, raccogliere solo l’identificatore necessario a individuare i dati già inviati e usare gli strumenti di eliminazione GA4; la revoca locale non elimina retroattivamente i dati. Non chiedere di inviare identificatori in questo repository.

Fonti: [Garante cookie](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876), [Google retention](https://support.google.com/analytics/answer/7667196), [termini](https://marketingplatform.google.com/about/analytics/terms/it/), [trasferimenti](https://business.safety.google/adsdatatransfers/), [trattamento UE](https://support.google.com/analytics/answer/12017362).

La CI abilita soltanto la build; test unitari isolati mantengono fixture proprie. Le prove generali E2E usano un rifiuto esplicito; le prove privacy partono senza scelta e verificano entrambe le opzioni. Le richieste Google nei test di accettazione sono simulate per non inviare traffico CI alla proprietà reale. Pubblicazione e ricezione reale restano da verificare prima di dichiarare l’attivazione completata.
