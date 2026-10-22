# Welcome email after a waitlist sign-up

Each new waitlist address receives one plain-text email from `contact@delir.it`, in Italian and English, with the link to the full product demo. The demo is the waitlist reward: it lives on the unlisted, noindex page `/demo` (4:47) and is not shown on the confirmation. The email is worded for the practice type and timing the visitor declared. It answers the visitor's request and is not a newsletter: there is no tracking pixel and no tracked link.

Each accepted pilot application receives one confirmation email, greeting the applicant by name, with the same `/demo` link. It uses the same SMTP settings and the same `welcome_mail_enabled` switch.

## Rules

- **Only new addresses:** repeat sign-ups get the same public answer and no email, so membership is never revealed.
- **Only after the notice:** the email goes only to people shown the notice that announces it (`product-interest-2026-10-22`).
- **The sign-up never depends on the email:** the browser gets its answer first, then the server sends. Every outcome writes a fixed code to `/private/delir/diagnostic.log`, never an address or a server reply.
- **Existing rate limits apply:** 5 per IP and 100 overall every 15 minutes.

## Turning it on (two steps)

The release pipeline installs the private library only when it is missing (#23); it never overwrites it. The frontend must therefore keep the earlier notice version until the server accepts the new one.

1. **On IONOS (manual):**
   - Upload `server/ionos/waitlist.php` to `/private/delir/waitlist.php`.
   - In `/private/delir/config.php`, add the keys shown in `server/ionos/config.example.php`, with `smtp_password` set to the `contact@delir.it` mailbox password and `welcome_mail_enabled => true`. Never put the password in Git, VITE_* or a chat.
   - Check the SMTP host and port in the IONOS panel; the defaults are `smtp.ionos.it:465`.
   - Check that SPF and DKIM for `delir.it` are active in the IONOS DNS settings.
2. **In the repository:** set `VITE_WELCOME_MAIL_READY: 'true'` in the production build env (`.github/workflows/quality.yml`). The site then sends the new notice version, shows the sentence in the privacy notice and mentions the email on the confirmation.

Until both steps are done, production behaves exactly as before.

## Check after activation

Sign up with a mailbox you control. Expect the email within a minute and the code `interest_welcome_mail_sent` in `/private/delir/diagnostic.log`. Sign up again with the same address: no second email.

## Diagnostic codes

| Code | Meaning | What to do |
| --- | --- | --- |
| `interest_welcome_mail_sent` / `pilot_confirmation_sent` | The SMTP server accepted the message | If it does not arrive, check spam, then SPF and DKIM |
| `interest_welcome_mail_not_due` | Accepted sign-up with no email: the address was already on the list, or the page showed the earlier notice | Test with an address never used before |
| `interest_welcome_mail_disabled` / `pilot_confirmation_disabled` | `welcome_mail_enabled` is not `true` in `config.php` | Set it to `true` (boolean, not a string) |
| `…_failed_configuration_invalid` | An SMTP key is missing, empty or still a placeholder | Complete the keys from `config.example.php` |
| `…_failed_connection_failed` | No TLS connection to `smtp_host:smtp_port` | Check host and port (`smtp.ionos.it`, 465) |
| `…_failed_rejected_auth` | Wrong mailbox user or password | Re-enter the `contact@delir.it` password |
| `…_failed_rejected_sender` / `_recipient` / `_message` | The server refused the sender, the recipient or the message | Check that `mail_from` is the authenticated mailbox |

The pilot confirmation and the step-level codes need the 2026-10-22 evening version of both private files: upload `server/ionos/waitlist.php` and `server/ionos/pilot.php` to `/private/delir/`, replacing the existing ones. The pipeline never overwrites them. An older `waitlist.php` logs only `interest_welcome_mail_failed`, links the video file instead of `/demo` and sends no pilot confirmation.
