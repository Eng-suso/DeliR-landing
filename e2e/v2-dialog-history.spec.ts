import { expect, test } from '@playwright/test';

test('closing a video dialog and going back release scroll ownership', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Fine-pointer controller ownership runs in Chromium.');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2#product-03');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  const chapter = page.locator('#product-03');
  // A chapter link adds a history entry before the dialog opens (one recording per benefit, no scene selector).
  await page.getByRole('navigation', { name: 'Capitoli del prodotto' }).getByRole('link', { name: /Lacune/ }).click();
  await expect(page).toHaveURL(/#product-02$/);
  await expect(page.locator('html')).not.toHaveClass(/lenis-scrolling/);
  await page.locator('#product-02').getByRole('button', { name: 'Apri il video completo: Versioni che non tornano' }).click();
  await expect(page.getByRole('dialog', { name: 'Versioni che non tornano' })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/lenis-stopped/);
  // One recording per benefit: going back no longer swaps the film, so close the dialog first.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/#product-03$/);
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
  await expect(chapter).toBeFocused();
  await expect.poll(() => chapter.evaluate(element => Math.abs(element.getBoundingClientRect().top - Number.parseFloat(getComputedStyle(element).scrollMarginTop)))).toBeLessThan(3);
  await expect.poll(() => chapter.getByRole('heading').evaluate(element => element.getBoundingClientRect().top - document.querySelector('.hybrid-chapter-nav')!.getBoundingClientRect().bottom)).toBeGreaterThan(0);
  const position = await page.evaluate(() => scrollY);
  await page.mouse.move(1300, 700);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(position + 50);
});
