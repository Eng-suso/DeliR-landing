# Hero e sfondo — direzione approvata

Prima fase della UI DeliR: bianco caldo, luce blu dietro il prodotto e atmosfera di nubi diffuse. Il titolare ha escluso righe, griglie e riquadri decorativi. Riferimento visuale consultato: [Bitdrift](https://bitdrift.io/signup), con [texture di nubi](https://bitdrift.io/v/2646581781668229583/images/clouds.png); alternativa fotografica mostrata: [Unsplash](https://unsplash.com/photos/a-blue-sky-with-white-clouds-D8hpK_Jlhms). Nessun asset di questi siti è copiato o caricato sul sito: lo sfondo è CSS originale, senza richieste a terzi.

Skill usate: website-enterprise-delivery, ui-ux-pro-max (raccomandazione design system e stack React), tailwind-design-system, React best practices, accessibilità, web-design-guidelines e Playwright. Restano il carattere Hanken Grotesk e il blu DeliR. Non si aggiungono font, librerie o tracker.

Il fondo della landing passa dall’azzurro uniforme con linee diagonali a un campo atmosferico circoscritto alla prima parte, che sfuma nel bianco caldo. La luce della demo è morbida e priva di griglie. Motion: breve ingresso del prodotto su schermi da 640 px; deriva lenta dello sfondo controllabile dal pulsante esistente. Movimento ridotto, risparmio dati, scheda nascosta e uscita dal viewport mantengono le protezioni esistenti. I testi sono sempre leggibili e non attendono animazioni.

La subheadline approvata è identica su ogni dispositivo, con la traduzione IT nella versione italiana. Sotto 1024 px il video viene prima del testo descrittivo e della CTA: il prodotto resta visibile presto senza abbreviare il copy. DOM e ordine visivo mobile coincidono. Su desktop testo e CTA restano accanto alla demo. Tabella completa, contenuti commerciali, privacy e invio pilot non cambiano.

Verifica: lint e build; test sul copy approvato IT/EN a 320, 390, 820 e 1440 px, posizione del prodotto, assenza di overflow e ordine dei controlli; test di interazione, pause/reduced motion e dialog video. La preferenza Tab di WebKit può escludere i link: l’ordine DOM è verificato in entrambi i motori e il percorso Tab esplicito in Chromium. Le prove visuali restano controlli locali, non evidenza di aumento delle conversioni o conformità complessiva WCAG.

Pubblicazione manuale su IONOS dopo la revisione della PR. Le quattro modifiche locali preesistenti a Problem, ProcessBridge, ScrollExperience e SmoothScroll rimangono escluse.
