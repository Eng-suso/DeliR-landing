import { expect, test } from '@playwright/test';

test('browser back from an open scene dialog releases scroll ownership', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Fine-pointer controller ownership runs in Chromium.');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2#product-03');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  const chapter = page.locator('#product-03');
  await chapter.getByRole('link', { name: 'Fonti e affermazioni', exact: true }).click();
  await expect(page).toHaveURL(/#scene-fonti-e-affermazioni$/);
  await expect(page.locator('html')).not.toHaveClass(/lenis-scrolling/);
  await chapter.getByRole('button', { name: 'Apri il video completo: Fonti e affermazioni' }).click();
  await expect(page.getByRole('dialog', { name: 'Fonti e affermazioni' })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/lenis-stopped/);
  await page.goBack();
  await expect(page).toHaveURL(/#product-03$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
  await expect(chapter).toBeFocused();
  await expect.poll(() => chapter.evaluate(element => Math.abs(element.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(element).scrollMarginTop)))).toBeLessThan(3);
  await expect.poll(() => chapter.getByRole('heading').evaluate(element => element.getBoundingClientRect().top - document.querySelector('.hybrid-chapter-nav')!.getBoundingClientRect().bottom)).toBeGreaterThan(0);
  const position = await page.evaluate(() => scrollY);
  await page.mouse.move(1300, 700);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(position + 50);
});
