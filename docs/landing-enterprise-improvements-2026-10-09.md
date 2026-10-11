# DeliR — interventi dopo l’audit enterprise

Data: 9 ottobre 2026. Obiettivo richiesto: 85/85 sul perimetro osservabile dell’audit. Il punteggio è un giudizio editoriale, non una conversione misurata.

## Comportamento consegnato

- Hero a due colonne su desktop: titolo, sottotitolo, CTA e tre condizioni del pilot a sinistra; visual del prodotto a destra. Su mobile i blocchi si impilano per mantenere la leggibilità.
- Video hero: registrazione originale di 16 secondi in Full HD (1920 × 1080), senza montaggio con slide. Frasi complete centrate sotto il video, senza effetto di scrittura. Su desktop il video occupa circa il 65% della griglia e la sezione arriva a 1600 px.
- Contatto commerciale disponibile tramite una bozza email a `delir.team@gmail.com`. Nessuna email è stata inviata durante il lavoro o le verifiche.
- Pilot a pagamento per milestone: quota alla firma, obiettivi AS-IS e TO-BE, consegna al process owner. Importi, ripartizione, calendario, output e accettazione si definiscono nel preventivo. Nessuna cifra o durata inventata.
- `/pilot` offre informazioni e contatto, invece di un modulo disabilitato, quando la raccolta automatica non è configurata. I moduli reali rimangono subordinati alle condizioni di privacy e destinazione già previste.
- Demo organizzata in cinque viste selezionabili, con una vista alla volta. Le sedici scene del percorso restano raggiungibili; la registrazione hero originale resta disponibile come asset insieme agli altri file.
- Collegamenti diretti alle scene e alle prove: apertura della vista corretta e dei contenitori `details`, anche al ricaricamento.
- Sezione dati/AI e validazione qualitativa con i fatti approvati dal titolare. FAQ dedicate a costo, durata, input, dati, assunzioni e responsabilità.
- Footer con contatto e navigazione. Titoli, descrizioni, lingua e canonical aggiornati per route; lingua inglese condivisibile con `?lang=en`. L’audit interno `/enterprise-readiness` è escluso dalle route di produzione.
- Poster responsive WebP per le scene. La hero usa una risoluzione adeguata al dettaglio ingrandito; le altre viste scelgono immagini più piccole.

## Provenienza commerciale

Il titolare ha approvato in questa conversazione il contatto pubblico, la struttura economica per milestone e queste informazioni:

1. DeliR è progettato con separazione dei clienti a livello applicativo e database, workspace distinti, autenticazione e policy di accesso dedicate.
2. I dati aziendali costruiscono il contesto per l’analisi di processo e le funzionalità AI.
3. Hosting, conservazione, cancellazione e uso dei dati da parte dei modelli AI sono ancora in formalizzazione, con verifica prevista prima dei pilot.
4. Sono state svolte sessioni qualitative con professionisti e Operations; non sono disponibili case study pubblici, testimonianze nominative autorizzate o risultati misurati.

Queste sono dichiarazioni approvate dal titolare, non esiti di un audit applicativo o una certificazione.

## Limiti dell’obiettivo 85/85

Le modifiche risolvono il percorso commerciale chiuso, rendono concreta l’offerta e migliorano la scansione e la dimostrazione. Non attestano ancora 85/85: rimangono necessarie policy pubbliche verificabili, una prova autorizzata del valore ottenuto e una dimostrazione di differenziazione rispetto ai competitor diretti. La matrice è stata sostituita con le sei capacità e i giudizi Sì/Parziale/No forniti dal titolare il 9 ottobre 2026. La provenienza è esplicita: valutazione DeliR, non test comparativi indipendenti. I link ufficiali sono documentazione di riferimento e non attestano tutti i giudizi della nuova matrice.

La corrispondenza tra traffico e messaggio resta fuori dal punteggio osservabile perché mancano analytics e campagne. Non viene dichiarato un aumento delle conversioni.

## Verifica

- TypeScript, ESLint e build di produzione: passati.
- Unit test: 22 passati. Copertura della logica inclusa: 100% linee/funzioni/statement e 94,73% branch.
- Suite browser iniziale: 61 passati, 36 esclusi per profilo e tre fallimenti. Due erano selettori ambigui dopo l’aggiunta del footer: corretti e verificati su entrambi i browser mobile. Il test della riproduzione Safari aveva un errore intermittente; il ricontrollo isolato sul build di produzione è passato tre volte consecutive. Non è stato riprodotto come difetto stabile del sito.
- Ricontrollo responsive e accessibilità: 17 passati, 11 esclusi per profilo. Axe senza violazioni automatiche WCAG A/AA su home, pilot e pagina aggiornamenti in Chromium. Non equivale a certificazione WCAG.
- I percorsi principali coprono Chromium desktop, WebKit desktop, Pixel 7 e iPhone 14 emulati. Verificati video, controlli da tastiera, lingua, collegamenti profondi, errori di caricamento, gating delle form e asset dei 17 video.
- Verifica visiva della hero desktop sia come poster sia in riproduzione. La finestra ingrandita mantiene il filmato completo. I cataloghi statici di media e confronto sono esclusi dalla copertura unitaria: asset, scene e link vengono controllati nel browser. La logica di navigazione, contatto, validazione e gating resta nel denominatore della copertura.

Il dominio `https://delir.ai` nei metadati è quello già presente nella configurazione del repository. Va confermato in sede di pubblicazione. I metadati dinamici sono aggiornati dal client: le anteprime social senza JavaScript continuano a ricevere il documento HTML italiano di base.

## Aggiornamento del confronto e della hero

- Sei righe e colonne nell’ordine richiesto: DeliR, ProcessMind, Celonis, SAP Signavio, Camunda, ChatGPT / Claude.
- Capacità e valori coincidono con la tabella fornita; il testo accidentale dopo l’ultimo Parziale è stato escluso.
- DeliR in evidenza, legenda a tre stati, scorrimento orizzontale confinato alla tabella e colonne capacità/DeliR fisse.
- Verifica FFprobe: tutti i 34 file attivi (17 MP4 + 17 WebM) sono 1920 × 1080. Non è stato necessario aumentarne artificialmente la risoluzione.

Verifica di questo aggiornamento: TypeScript, lint e build passati. Suite video su Chromium desktop e mobile: 9 test passati, 3 esclusi per profilo. Matrice controllata nel browser: tutte le 36 celle coincidono con i valori forniti. Nessun overflow della pagina a 320, 390, 820, 1130 e 1440 px; nessun errore JavaScript o violazione automatica Axe WCAG A/AA. Hero desktop misurata a circa 838 px nel viewport di 1440 px. Screenshot e risultati: `artifacts/qa/enterprise-improvements-2026-10-09/latest/`. Queste verifiche riguardano la landing e i suoi file video, non le capacità effettive dei competitor.
