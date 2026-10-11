import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('critical production routes render', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Production route smoke runs once; cross-browser specs cover rendering');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/waitlist');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Le iscrizioni agli aggiornamenti non sono ancora aperte.' })).toBeVisible();
  await expect(page.getByRole('form')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.goto('/pilot');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('form')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Verifica i dati' })).toBeEnabled();
  await page.goto('/security-data');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sicurezza e dati');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sicurezza e dati');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://delir.it/security-data');
  await page.goto('/enterprise-readiness');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pagina non trovata');
});

test('production CSP permits fonts and video interactions', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'CSP regression runs once in Chromium');
  const policy = readFileSync('public/_headers', 'utf8').match(/^\s+Content-Security-Policy: (.+)$/m)?.[1].trim();
  expect(policy).toBeTruthy();
  await page.route('**/*', async route => {
    if (route.request().isNavigationRequest() && route.request().resourceType() === 'document') {
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': policy! } });
    } else await route.continue();
  });
  await page.addInitScript(() => {
    const violations: string[] = [];
    document.addEventListener('securitypolicyviolation', event => violations.push(event.violatedDirective));
    Object.assign(window, { cspViolations: violations });
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('#hero-product-outcome');
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect.poll(() => hero.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  await hero.getByRole('button', { name: 'Pausa: DeliR in azione' }).click();
  expect(await page.evaluate(() => Reflect.get(window, 'cspViolations'))).toEqual([]);
});
