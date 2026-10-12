import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
test.use({ storageState: { cookies: [], origins: [] } });

test('privacy and optional analytics respect first-visit rejection', async ({ page }) => {
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
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Accetta', exact: true })).toBeEnabled();
  await expect(dialog.getByRole('button', { name: 'Rifiuta', exact: true })).toBeFocused();
  await dialog.getByRole('button', { name: 'Gestisci preferenze' }).click();
  await expect(dialog.locator('#consent-necessary')).toContainText('Necessari — sempre attivi');
  await expect(dialog.locator('#consent-analytics')).not.toBeChecked();
  await expect(dialog.locator('#consent-analytics')).toBeEnabled();
  await expect(page.locator('#cookies')).toContainText('2 mesi');
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
  await expect(page.getByRole('dialog')).toBeVisible();
  const other = await context.newPage();
  await other.goto('/privacy');
  await other.getByRole('button', { name: 'Rifiuta', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await other.close();
});

test('Google loads only after acceptance and stops on withdrawal', async ({ page }) => {
  const requests: string[] = [];
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  page.on('request', request => { if (/googletagmanager|google-analytics/.test(request.url())) requests.push(request.url()); });
  await page.goto('/privacy?private_test=never-send#private-fragment');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(requests).toEqual([]);
  await page.getByRole('button', { name: 'Accetta', exact: true }).click();
  await expect(page.locator('#delir-ga4')).toHaveCount(1);
  await expect.poll(() => requests.length).toBe(1);
  const queue = await page.evaluate(() => (window as Window & { dataLayer: unknown[][] }).dataLayer);
  expect(JSON.stringify(queue)).not.toMatch(/never-send|private-fragment/);
  expect(queue.filter(row => row[0] === 'event' && row[1] === 'page_view')).toHaveLength(1);
  await page.getByRole('button', { name: 'Preferenze cookie' }).first().click();
  await page.getByRole('button', { name: 'Rifiuta', exact: true }).click();
  await expect(page.locator('#delir-ga4')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(requests).toHaveLength(1);
});
