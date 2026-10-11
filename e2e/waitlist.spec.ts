import { expect, test } from '@playwright/test';

test('pilot offers a direct enquiry without a disabled form', async ({ page }) => {
  await page.goto('/pilot');
  await expect(page.getByRole('form')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Testa DeliR sul tuo progetto' })).toHaveAttribute('href', /^mailto:delir\.team@gmail\.com/);
  await expect(page.getByText('Conosci perimetro e prezzo prima di iniziare')).toBeVisible();
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Evaluate a DeliR pilot for your engagement.');
  await expect(page).toHaveTitle(/DeliR pilot/);
});
