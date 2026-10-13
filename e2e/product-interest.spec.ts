import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Separate enabled fixture: the deployable build must stay closed until IONOS
// installation is verified. Never enable production solely to test the form.
test.skip(process.env.PLAYWRIGHT_INTEREST_FIXTURE !== 'true', 'Requires the isolated active-intake fixture');

test('product-use request validates, preserves errors, and confirms explicit acceptance', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/waitlist.php', async route => {
    attempts++;
    expect(route.request().postDataJSON()).toEqual({
      email: 'demo@example.test', practice: 'independent', timing: '',
      source: 'delir-product-interest', noticeVersion: 'product-interest-2026-10-12',
    });
    await route.fulfill(attempts === 1
      ? { status: 200, contentType: 'text/html', body: '<html>Wrong endpoint</html>' }
      : { status: 201, contentType: 'application/json', body: '{"accepted":true}' });
  });
  await page.goto('/');
  await page.locator('#hero').getByRole('link', { name: 'Voglio provare DeliR' }).click();
  await expect(page).toHaveURL(/\/waitlist$/);
  const submit = page.getByRole('button', { name: 'Voglio provare DeliR' });
  await submit.click();
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  expect(attempts).toBe(0);
  await page.getByLabel('Email', { exact: true }).fill('demo@example.test');
  await page.getByLabel('Tipo di attività').selectOption('independent');
  await expect(page.getByLabel(/Quando vorresti usarlo/)).not.toHaveAttribute('required');
  await submit.click();
  await expect(page.getByRole('alert')).toContainText('non è stata confermata');
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('demo@example.test');
  await expect(page.getByRole('heading', { name: 'Richiesta ricevuta.' })).toHaveCount(0);
  await submit.click();
  await expect(page.getByRole('heading', { name: 'Richiesta ricevuta.' })).toBeFocused();
  expect(attempts).toBe(2);
  await expect(page.getByRole('form')).toHaveCount(0);
});

test('optional timing and English request flow remain usable on small screens', async ({ page }) => {
  await page.route('**/api/waitlist.php', async route => {
    expect(route.request().postDataJSON()).toMatchObject({ practice: 'consulting-team', timing: 'active' });
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"accepted":true}' });
  });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/waitlist?lang=en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Want to use DeliR in your work?');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Email', { exact: true }).fill('demo@example.test');
  await page.getByLabel('Practice type').selectOption('consulting-team');
  await page.getByLabel(/When would you use it/).selectOption('active');
  await page.getByRole('button', { name: 'I want to try DeliR' }).click();
  await expect(page.getByRole('heading', { name: 'Request received.' })).toBeFocused();
});

test('Calendly remains an outbound link and form/booking requests leak no automatic data', async ({ page }, testInfo) => {
  const external: string[] = [];
  page.on('request', request => { if (/calendly\.com|googletagmanager|google-analytics/.test(request.url())) external.push(request.url()); });
  await page.goto('/#conversation');
  await expect(page.locator('#conversation').getByRole('link', { name: 'Prenota un confronto senza impegno' })).toHaveAttribute('href', 'https://calendly.com/example/intro');
  expect(external).toEqual([]);
  await page.goto('/waitlist');
  await expect(page.getByRole('form')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Prenota un confronto senza impegno' })).toHaveAttribute('href', 'https://calendly.com/example/intro');
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('product-interest-form.png'), fullPage: true });
  expect(external).toEqual([]);
});
