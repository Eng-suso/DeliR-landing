import { expect, test } from '@playwright/test';

for (const language of ['it', 'en']) {
  test(`mobile shows product proof early and preserves the full comparison (${language})`, async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/?lang=${language}`);
      await page.locator('#hero-product-outcome img').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const shape = await page.evaluate(() => ({
        top: document.querySelector('#hero-product-outcome')!.getBoundingClientRect().top,
        height: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      expect(shape.top).toBeLessThan(600);
      expect(shape.height).toBeLessThan(13000);
      expect(shape.overflow).toBe(false);
      await expect(page.locator('#pilot-summary')).toBeVisible();
      await expect(page.locator('#confronto table th[scope="col"]')).toHaveCount(8);
      await expect(page.locator('[data-product-module]:not([hidden])')).toHaveCount(1);
      await page.goto(`/?lang=${language}#scene-confronto`);
      await expect(page.locator('#product-05')).toBeVisible();
      await expect(page.locator('#scene-confronto')).toBeInViewport();
      const expand = page.locator('#scene-confronto').getByRole('button', { name: /Apri il video completo|Open full video/ });
      await expand.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog').locator('video')).toHaveAttribute('controls', '');
      await page.keyboard.press('Escape');
      await expect(expand).toBeFocused();
    }
  });
}
