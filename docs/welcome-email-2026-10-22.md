# Welcome email after a waitlist sign-up

Each new waitlist address receives one plain-text email from `contact@delir.it`, in Italian and English, with the link to the full product walkthrough (`/product-videos/walkthrough.mp4`, 4:47). The email answers the visitor's request. It is not a newsletter: there is no tracking pixel and no tracked link.

## Rules

- **Only new addresses:** repeat sign-ups get the same public answer and no email, so membership is never revealed.
- **Only after the notice:** the email goes only to people shown the notice that announces it (`product-interest-2026-10-22`).
- **The sign-up never depends on the email:** the browser gets its answer first, then the server sends. A delivery failure writes the fixed code `interest_welcome_mail_failed` to the private diagnostic log, with no address or content.
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
