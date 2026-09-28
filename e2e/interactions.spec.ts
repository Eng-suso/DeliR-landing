import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('all primary CTA routes open at the top of the destination page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Valuta DeliR su un incarico reale' }).click();
  await expect(page).toHaveURL(/\/pilot$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);

  await page.goto('/');
  await page.locator('#early-access').scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'Valuta un incarico reale' }).click();
  await expect(page).toHaveURL(/\/pilot$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);

  await page.goto('/');
  await page.locator('#early-access').scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'Ricevi gli aggiornamenti' }).click();
  await expect(page).toHaveURL(/\/waitlist$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);
});

test('navigation anchors, view switch and FAQ controls respond', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  if (isMobile) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('link', { name: 'Prodotto', exact: true }).click();
  await expect(page).toHaveURL(/#product$/);
  await expect.poll(() => page.locator('#product').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeGreaterThanOrEqual(100);
  await expect.poll(() => page.locator('#product').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeLessThanOrEqual(120);

  await page.locator('#view-switch').scrollIntoViewIfNeeded();
  const clientView = page.getByRole('button', { name: 'Vista cliente' });
  await clientView.click();
  await expect(clientView).toHaveAttribute('aria-pressed', 'true');

  const faqButton = page.getByRole('button', { name: 'Per chi è pensato il pilot?' });
  await faqButton.click();
  await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: 'Per chi è pensato il pilot?' })).toContainText('Per consulenti BPM e Operations indipendenti');
});

test('mobile navigation remains operable after deep scrolling', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation check');
  await page.goto('/');
  await page.locator('#faq').scrollIntoViewIfNeeded();

  const toggle = page.locator('button[aria-controls="mobile-navigation"]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Candidati al pilot' })).toBeVisible();

  await page.getByRole('link', { name: 'Candidati al pilot' }).click();
  await expect(page).toHaveURL(/\/pilot$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(0);
});

test('background layers remain contiguous and error-free while scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Runtime background diagnostics run once in Chromium');
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#early-access')).toBeAttached();

  const sections = await page.locator('main > section').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
  }));
  for (let index = 1; index < sections.length; index += 1) {
    expect(Math.abs(sections[index].top - sections[index - 1].bottom)).toBeLessThanOrEqual(1);
  }

  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), Math.round(maxScroll * ratio));
    const rect = await page.getByTestId('page-background').boundingBox();
    expect(rect?.x).toBe(0);
    expect(rect?.y).toBe(0);
    expect(rect?.width).toBeGreaterThanOrEqual(await page.evaluate(() => window.innerWidth));
    expect(rect?.height).toBeGreaterThanOrEqual(await page.evaluate(() => window.innerHeight));
  }

  expect(runtimeErrors).toEqual([]);
});
