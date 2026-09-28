import { expect, test } from '@playwright/test';

test('la CTA principale invia una candidatura pilot qualificata', async ({ page }) => {
  let submittedBody: Record<string, string> | undefined;
  await page.route('**/api/pilot', async (route) => {
    submittedBody = route.request().postDataJSON() as Record<string, string>;
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Valuta DeliR su un incarico reale' }).click();
  await expect(page).toHaveURL(/\/pilot$/);

  await page.getByLabel('Nome e cognome').fill('Jane Doe');
  await page.getByLabel('Email di lavoro').fill('JANE@COMPANY.COM');
  await page.getByLabel('Tipo di attività').selectOption('independent');
  await page.getByLabel('Tempistica dell’incarico').selectOption('active');
  await page.getByLabel('Processo o problema da analizzare').fill('Analizzare il processo di acquisto indiretto e confrontare scenari di miglioramento.');
  await page.getByRole('button', { name: 'Invia l’incarico per la valutazione' }).click();

  await expect(page.getByRole('heading', { name: 'Candidatura ricevuta.' })).toBeVisible();
  expect(submittedBody).toMatchObject({
    name: 'Jane Doe', email: 'jane@company.com', practice: 'independent', timing: 'active', source: 'delir-pilot-application',
  });
});

test('la candidatura mostra errori di validazione e di server', async ({ page }) => {
  await page.route('**/api/pilot', (route) => route.fulfill({ status: 500 }));
  await page.goto('/pilot');

  await page.getByRole('button', { name: 'Invia l’incarico per la valutazione' }).click();
  await expect(page.getByText('Inserisci il tuo nome.')).toBeVisible();
  await expect(page.getByLabel('Nome e cognome')).toBeFocused();

  await page.getByLabel('Nome e cognome').fill('Jane Doe');
  await page.getByLabel('Email di lavoro').fill('jane@company.com');
  await page.getByLabel('Tipo di attività').selectOption('boutique');
  await page.getByLabel('Tempistica dell’incarico').selectOption('next-90-days');
  await page.getByLabel('Processo o problema da analizzare').fill('Valutare il processo procure-to-pay e simulare due scenari di intervento.');
  await page.getByRole('button', { name: 'Invia l’incarico per la valutazione' }).click();

  await expect(page.getByRole('alert')).toContainText('Non siamo riusciti a inviare la candidatura');
  await expect(page.getByText('Candidatura ricevuta.')).toHaveCount(0);
});

test('la waitlist resta disponibile come percorso secondario', async ({ page }) => {
  await page.route('**/api/waitlist', (route) => route.fulfill({ status: 201 }));
  await page.goto('/waitlist');
  await page.getByLabel('Nome', { exact: true }).fill('Jane');
  await page.getByLabel('Cognome').fill('Doe');
  await page.getByLabel('Email di lavoro').fill('jane@company.com');
  await page.getByLabel('Ruolo professionale').fill('Consulente BPM');
  await page.getByRole('button', { name: 'Ricevi gli aggiornamenti' }).click();
  await expect(page.getByRole('heading', { name: 'Sei nella lista' })).toBeVisible();
});

test('il selettore lingua passa l’interfaccia in inglese e persiste', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('button', { name: 'English' }).last().click();
  await expect(page.getByRole('heading', { name: 'From engagement to quantified recommendation.' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'From engagement to quantified recommendation.' })).toBeVisible();
});
