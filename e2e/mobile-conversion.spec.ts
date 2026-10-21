import { expect, test } from '@playwright/test';

for (const language of ['it', 'en']) {
  test(`mobile shows product proof early and preserves the full comparison (${language})`, async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/?lang=${language}`);
      await page.locator('#hero-product-outcome img').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const shape = await page.evaluate(() => ({
        top: document.querySelector('.hero-actions a')!.getBoundingClientRect().top,
        height: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      expect(shape.top).toBeLessThan(600);
      expect(shape.height).toBeLessThan(20000);
      expect(shape.overflow).toBe(false);
      await expect(page.locator('.v2-quick-action')).toHaveAttribute('href', language === 'it' ? '/waitlist' : '/waitlist?lang=en');
      await expect(page.locator('#pilot')).toBeVisible();
      await expect(page.locator('#confronto table th[scope="col"]')).toHaveCount(8);
      await expect(page.locator('#caso [role="tab"]')).toHaveCount(4);
      await expect(page.locator('#caso video')).toHaveCount(0);
      await page.goto(`/?lang=${language}#simulation`);
      await expect(page.locator('#caso [role="tabpanel"] [data-product-video]')).toHaveAttribute('data-product-video', 'simulation');
      await expect(page.locator('#caso [role="tabpanel"]')).toBeInViewport();
      const open = page.locator('#caso').getByRole('button', { name: /Guarda il percorso completo|Watch the full walkthrough/ });
      await open.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('dialog').locator('video')).toHaveAttribute('controls', '');
      await page.keyboard.press('Escape');
      await expect(open).toBeFocused();
    }
  });
}
