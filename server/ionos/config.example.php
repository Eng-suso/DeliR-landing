<?php
declare(strict_types=1);

// Copy to /private/delir/config.php on IONOS, outside the domain's /public.
// Fill there, never in Git, VITE_*, a chat message or the public directory.
return [
    'enabled' => false,
    'waitlist_enabled' => false,
    'origins' => ['https://delir.it'],
    'db_host' => 'REPLACE_ON_SERVER',
    'db_port' => 3306,
    'db_name' => 'REPLACE_ON_SERVER',
    'db_user' => 'REPLACE_ON_SERVER',
    'db_password' => 'REPLACE_ON_SERVER',
    // Generate on the server: php -r 'echo bin2hex(random_bytes(32));'
    'rate_secret' => 'REPLACE_ON_SERVER',
    // Welcome email with the product walkthrough, sent once to each new waitlist address.
    // SMTP of the IONOS mailbox: check host and port in the IONOS panel (Email → settings).
    'welcome_mail_enabled' => false,
    'smtp_host' => 'smtp.ionos.it',
    'smtp_port' => 465,
    'smtp_user' => 'contact@delir.it',
    'smtp_password' => 'REPLACE_ON_SERVER',
    'mail_from' => 'contact@delir.it',
];
