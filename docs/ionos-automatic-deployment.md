# Deploy automatico su IONOS

Ogni push a `main`, compreso quello generato dal merge di una PR, esegue `quality`. Se tutti i controlli passano, `deploy-ionos` pubblica su `https://delir.it` lo stesso artifact `dist` verificato. Le PR eseguono i controlli senza accesso SFTP o deploy. I rilasci sono serializzati; un commit già superato da un `main` più recente viene saltato prima dell'upload.

## Configurazione una tantum

1. In IONOS → Hosting → **SFTP e SSH**, aprire i dati dell'account già usato per `/public`. È sufficiente SFTP, non sono richiesti rsync o una shell sul server. Non creare un nuovo accesso se quello esistente è adatto.
2. In [GitHub → Settings → Secrets and variables → Actions → Secrets](https://github.com/Eng-suso/DeliR-landing/settings/secrets/actions), creare quattro **repository secrets**:

| Nome | Valore |
| --- | --- |
| `IONOS_SFTP_HOST` | Il server SFTP indicato da IONOS, senza `sftp://` |
| `IONOS_SFTP_USER` | Il nome utente SFTP |
| `IONOS_SFTP_PASSWORD` | La password SFTP esistente |
| `IONOS_SFTP_FINGERPRINT` | Impronta del server già verificato, formato OpenSSH `SHA256:...` |

Non inserire questi valori in chat, nel codice, in file `.env` versionati o nei log.

Il deploy usa la chiave ED25519. [IONOS pubblica le impronte del Webhosting](https://www.ionos.de/hilfe/hosting/ssh-zugaenge-einrichten-und-verwalten/uebersicht-der-ssh-fingerabdruecke-im-ionos-webhosting/): il valore ED25519 verificato il 13 ottobre 2026 è `SHA256:1gx2w8Rtv3wCgi7Jh8myf/KVd72cRQbow03UP8P095Q`. È una chiave pubblica del provider, non un segreto o la password dell'account; si può copiare questo valore nel Secret dedicato. In alternativa, confrontare l'impronta ED25519 della connessione già verificata di FileZilla/WinSCP con la fonte IONOS. Il deploy confronta l'impronta **prima** di inviare la password. Se il server presenta una chiave diversa, correggere il pin soltanto dopo aver verificato il cambiamento con IONOS; non disabilitare la verifica.

3. Nella scheda [**Variables**](https://github.com/Eng-suso/DeliR-landing/settings/variables/actions), creare:

| Nome | Valore |
| --- | --- |
| `IONOS_SFTP_DIRECTORY` | `/` se SFTP mostra già `assets`, `seo`, `api`; `/public` se occorre prima aprire `public` |
| `ENABLE_IONOS_DEPLOYMENTS` | `true`, dopo aver verificato accesso e directory |

Il percorso è quello **visto da SFTP**, non il percorso assoluto del sistema Linux. Il deploy rifiuta una directory che contiene `private` o un ulteriore `public` e non segue symlink.

4. Il frontend corrente deve già avere il `.htaccess` IONOS revisionato. Lo script lo preserva insieme a `api/` e ai file privati. Un cambiamento futuro di rotte/header richiede un aggiornamento separato del `.htaccess`; un'apertura della waitlist richiede comunque installazione privata/schema e verifica del backend.
5. Il job usa l'environment `ionos-production`. Per il comportamento automatico richiesto non configurare required reviewers su questo environment; eventuali regole già presenti vengono rispettate, non aggirate. Il vecchio environment Cloudflare `production` è separato.
6. Dopo il merge della PR che introduce questo job, osservare **Actions → Landing quality gates and deploy → deploy-ionos**. Se i Secrets vengono aggiunti dopo quel run, usare **Re-run all jobs** sull'ultimo run di `main`; non è necessario cambiare codice per pubblicare la stessa versione.

## Pubblicazione e ripristino

Prima vengono caricati i file in staging protetto. Il server deve negare via HTTP l'accesso a `.delir-deploy/probe.txt` (403 o 404) prima di qualunque sostituzione del frontend. Ogni file esistente sostituito viene spostato nella cartella di backup protetta del run; gli asset sono pubblicati prima dei documenti HTML e `release.json` è l'ultimo file. Non vengono cancellati gli asset delle versioni precedenti né svuotato `/public`.

Il controllo finale verifica SHA pubblico, home IT/EN, route principali, noindex di privacy/waitlist, asset iniziali, robots/sitemap e 404. In caso di errore lo script ripristina i file sostituiti nella stessa connessione SFTP. Non è uno switch atomico dell'intero sito: durante la sostituzione dei documenti esiste una breve finestra di aggiornamento. Un'interruzione del runner o della connessione può impedire il ripristino automatico; il backup resta disponibile su IONOS in `.delir-deploy/<sha-breve>-<run>-<tentativo>/backup/` per il recupero manuale. Non sono eseguite migrazioni del database.

I backup contengono solo i file pubblici del frontend gestiti dal deploy. Monitorare lo spazio e rimuovere manualmente soltanto i backup di rilasci superati dopo aver verificato il sito; non è configurata una cancellazione automatica. Staging e backup non sono caricati come artifact GitHub. La password viene usata in memoria e non viene scritta dal codice su disco.

## Build manuale

Da un checkout pulito e aggiornato di `main`:

```powershell
npm ci
Copy-Item .env.example .env.local
# Per la configurazione GA4 già approvata: VITE_ANALYTICS_READY=true in .env.local.
# VITE_WAITLIST_READY deve restare false fino alla verifica del backend.
npm run build
```

`dist/` è la build; `npm run preview` permette di controllarla localmente. La build manuale non è un deploy: per un caricamento manuale seguire [pubblicazione frontend](ionos-frontend-publication.md). Il deploy automatico usa invece le opzioni esplicite della CI e aggiunge `release.json` con il commit verificato.

Fonti: [IONOS — dati SFTP](https://www.ionos.it/aiuto/hosting/configurare-e-gestire-gli-accessi-ftp/dati-di-connessione-ftp/sftp-nel-web-hosting-company-name/), [GitHub — Secrets di Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions), [GitHub — environment di deploy](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).
