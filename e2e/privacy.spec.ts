import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('IONOS privacy notice and preferences are accessible with analytics closed', async ({ page }) => {
  const googleRequests: string[] = [];
  page.on('request', request => {
    if (/google-analytics|googletagmanager|doubleclick/.test(request.url())) googleRequests.push(request.url());
  });
  await page.goto('/privacy?private_test=must-not-be-transmitted');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy e cookie' })).toBeVisible();
  await expect(page.locator('#email')).toContainText('non è configurato un inoltro automatico a Gmail');
  await expect(page.locator('#retention')).toContainText('12 mesi');
  await expect(page.locator('main')).not.toContainText('Bozza aggiornata');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.getByRole('button', { name: 'Preferenze cookie' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Accetta', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Chiudi', exact: true })).toBeFocused();
  await dialog.getByRole('button', { name: 'Gestisci preferenze' }).click();
  await expect(dialog.locator('#consent-necessary')).toContainText('Necessari — sempre attivi');
  await expect(dialog.locator('#consent-analytics')).not.toBeChecked();
  await expect(dialog.locator('#consent-analytics')).toBeDisabled();
  expect((await new AxeBuilder({ page }).include('dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('delir-consent-v1')!).analytics)).toBe(false);
  await page.reload();
  await expect(dialog).not.toBeVisible();
  await page.goto('/privacy?lang=en');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy and cookies' })).toBeVisible();
  await expect(page.locator('#email')).toContainText('no automatic forwarding to Gmail');
  expect(googleRequests).toEqual([]);
});


test('a consent choice from another tab closes an already open dialog', async ({ page, context }) => {
  await page.goto('/privacy');
  await page.getByRole('button', { name: 'Preferenze cookie' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const other = await context.newPage();
  await other.goto('/privacy');
  await other.getByRole('button', { name: 'Preferenze cookie' }).first().click();
  await other.getByRole('button', { name: 'Chiudi', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await other.close();
});
