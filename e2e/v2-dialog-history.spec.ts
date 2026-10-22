import { expect, test } from '@playwright/test';

test('the hero film dialog holds scroll ownership and releases it on close', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Fine-pointer controller ownership runs in Chromium.');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  const open = page.locator('#hero-product-outcome').getByRole('button', { name: 'Apri il video completo: DeliR in azione' });
  await open.click();
  await expect(page.getByRole('dialog', { name: 'DeliR in azione' })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/lenis-stopped/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
  await expect(open).toBeFocused();
  const position = await page.evaluate(() => scrollY);
  await page.mouse.move(1300, 700);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(position + 50);
});
