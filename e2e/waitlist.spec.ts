import { expect, test } from '@playwright/test';

test('pilot previews a fillable form without transmitting data before activation', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') requests.push(request.url()); });
  await page.goto('/');
  await page.locator('.premium-hero').getByRole('link', { name: 'Testa DeliR sul tuo progetto' }).click();
  await expect(page).toHaveURL(/\/pilot#application$/);
  await expect(page.locator('#application')).toBeInViewport();
  await expect(page.locator('#application')).toBeFocused();
  await page.getByRole('button', { name: 'Verifica i dati' }).click();
  await expect(page.getByLabel('Nome e cognome')).toBeFocused();
  await expect(page.getByText('Inserisci il tuo nome.', { exact: true })).toBeVisible();
  await page.getByLabel('Nome e cognome').fill('Demo User');
  await page.getByLabel('Email di lavoro').fill('demo@example.test');
  await page.getByLabel('Tipo di attività').selectOption('independent');
  await page.getByLabel('Tempistica dell’incarico').selectOption('active');
  await page.getByLabel('Processo o problema da analizzare').fill('Review a fictional procurement approval process.');
  await page.getByRole('button', { name: 'Verifica i dati' }).click();
  await expect(page.getByText('I dati sono pronti, ma l’invio non è ancora disponibile. La richiesta non è stata trasmessa.')).toBeVisible();
  await expect(page.getByText('Candidatura ricevuta.', { exact: true })).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('waitlist does not collect data before privacy and delivery are ready', async ({ page }) => {
  await page.goto('/waitlist');
  await expect(page.getByRole('form')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Esplora DeliR' })).toBeVisible();
});

test('language choice is shareable and persists after reload', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('button', { name: 'English' }).last().click();
  await expect(page).toHaveURL(/\?lang=en/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Process Intelligence Software for Efficient and Effective Operations.');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Sources, BPMN/);
  await page.goto('/pilot?lang=en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Test DeliR on Your Project.');
  await expect(page).toHaveTitle(/DeliR pilot/);
});
