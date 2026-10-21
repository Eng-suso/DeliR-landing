import { expect, test } from '@playwright/test';

test('the walkthrough dialog holds scroll ownership and releases it on close', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Fine-pointer controller ownership runs in Chromium.');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2#caso');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  const open = page.getByRole('button', { name: /Guarda il percorso completo/ });
  await open.scrollIntoViewIfNeeded();
  await expect(page.locator('html')).not.toHaveClass(/lenis-scrolling/);
  await open.click();
  await expect(page.getByRole('dialog', { name: 'Il percorso completo' })).toBeVisible();
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
