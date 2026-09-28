import { expect, test } from '@playwright/test';

test('critical production routes render', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Production route smoke runs once; cross-browser specs cover rendering');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/waitlist');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('form', { name: 'Richiesta aggiornamenti prodotto' })).toBeVisible();
  await page.goto('/pilot');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('form', { name: 'Raccontaci l’incarico' })).toBeVisible();
});
