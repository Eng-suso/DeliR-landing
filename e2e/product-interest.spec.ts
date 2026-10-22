import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Separate enabled fixture: the deployable build must stay closed until IONOS
// installation is verified. Never enable production solely to test the form.
test.skip(process.env.PLAYWRIGHT_INTEREST_FIXTURE !== 'true', 'Requires the isolated active-intake fixture');

test('waitlist validates, preserves errors, and confirms explicit acceptance', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/waitlist.php', async route => {
    attempts++;
    expect(route.request().postDataJSON()).toEqual({
      email: 'demo@example.test', practice: 'independent', timing: '',
      source: 'delir-product-interest', noticeVersion: 'product-interest-2026-10-22',
    });
    await route.fulfill(attempts === 1
      ? { status: 200, contentType: 'text/html', body: '<html>Wrong endpoint</html>' }
      : { status: 201, contentType: 'application/json', body: '{"accepted":true}' });
  });
  await page.goto('/');
  await page.locator('#hero').getByRole('link', { name: 'Entra nella lista d’attesa' }).click();
  await expect(page).toHaveURL(/\/waitlist$/);
  const submit = page.getByRole('button', { name: 'Iscriviti e ricevi la demo' });
  await submit.click();
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  expect(attempts).toBe(0);
  await page.getByLabel('Email', { exact: true }).fill('demo@example.test');
  await page.getByLabel('Tipo di attività').selectOption('independent');
  await expect(page.getByLabel(/Quando pensi che lo useresti/)).not.toHaveAttribute('required');
  await submit.click();
  await expect(page.getByRole('alert')).toContainText('non è stata confermata');
  await expect(page.getByLabel('Email', { exact: true })).toHaveValue('demo@example.test');
  await expect(page.getByRole('heading', { name: 'Sei nella lista d’attesa.' })).toHaveCount(0);
  await submit.click();
  await expect(page.getByRole('heading', { name: 'Sei nella lista d’attesa.' })).toBeFocused();
  expect(attempts).toBe(2);
  await expect(page.getByText(/ti ho inviato una email di conferma con il link alla demo/)).toBeVisible();
  await expect(page.getByRole('form')).toHaveCount(0);
  // The demo is the email reward: nothing plays on the confirmation.
  await expect(page.locator('[data-product-video]')).toHaveCount(0);
});

test('the demo page linked from the welcome email plays the full demo and stays out of the index', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('La demo completa di DeliR (4:47)');
  const player = page.locator('[data-product-video="walkthrough"]');
  await player.getByRole('button', { name: /Riproduci: La demo completa del prodotto/ }).click();
  await expect.poll(() => player.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
  await page.goto('/demo?lang=en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The full DeliR demo (4:47)');
});

test('optional timing and English waitlist flow remain usable on small screens', async ({ page }) => {
  await page.route('**/api/waitlist.php', async route => {
    expect(route.request().postDataJSON()).toMatchObject({ practice: 'consulting-team', timing: 'active' });
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"accepted":true}' });
  });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/waitlist?lang=en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Join the DeliR waitlist.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Email', { exact: true }).fill('demo@example.test');
  await page.getByLabel('Practice type').selectOption('consulting-team');
  await page.getByLabel(/When do you think you would use it/).selectOption('active');
  await page.getByRole('button', { name: 'Join and get the demo' }).click();
  await expect(page.getByRole('heading', { name: 'You’re on the waitlist.' })).toBeFocused();
  await expect(page.getByText(/I sent you a confirmation email with the link to the full product demo/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('waitlist keeps pilot as an explicit alternative and sends no automatic external data', async ({ page }, testInfo) => {
  const external: string[] = [];
  page.on('request', request => { if (/calendly\.com|googletagmanager|google-analytics/.test(request.url())) external.push(request.url()); });
  await page.goto('/waitlist');
  await expect(page.getByRole('form')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Valuta un pilot' })).toHaveAttribute('href', '/pilot#application');
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('waitlist-form.png'), fullPage: true });
  expect(external).toEqual([]);
});
