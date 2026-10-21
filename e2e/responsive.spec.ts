import { expect, test } from '@playwright/test';

for (const path of ['/', '/pilot', '/waitlist', '/security-data', '/security-data?lang=en']) {
  test(`${path} has no horizontal overflow`, async ({ page }) => {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  });
}

test('mobile navigation opens, remains operable, and closes after selection', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation check');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Apri il menu' });
  await toggle.click();
  const menu = page.locator('#mobile-navigation');
  await expect(menu.getByRole('link', { name: 'Il prodotto' })).toBeVisible();
  await menu.getByRole('link', { name: 'Il prodotto' }).click();
  await expect(page.getByRole('button', { name: 'Apri il menu' })).toHaveAttribute('aria-expanded', 'false');
});

test('comparison keeps every product visible without horizontal scrolling', async ({ page }) => {
  await page.goto('/#confronto');
  await page.locator('.landing-page[data-client-ready="true"]').waitFor();
  const comparison = page.locator('#confronto');
  await comparison.scrollIntoViewIfNeeded();
  await expect(comparison.locator('table')).toBeVisible();
  await expect(comparison.locator('thead .comparison-product-name')).toHaveText(['DeliR', 'LucidFlow', 'PRIME BPM', 'Bizagi', 'Visio', 'Miro', 'ChatGPT / Claude']);
  await expect(comparison.locator('.comparison-rating--partial').first()).toHaveAccessibleName(/Parziale/);
  await expect(comparison.locator('.comparison-rating--unknown').first()).toHaveAccessibleName(/Da verificare/);
  await expect(comparison.locator('[data-comparison-card]')).toHaveCount(0);
  const rows = comparison.locator('tbody tr');
  await expect(rows).toHaveCount(7);
  for (const row of await rows.all()) {
    await expect(row).toBeVisible();
    await expect(row.locator('a')).toHaveCount(7);
    for (const cell of await row.locator('a').all()) {
      const box = await cell.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual((page.viewportSize()?.width ?? 0) + 1);
    }
  }
  const scrollers = await comparison.evaluate(section => [section, ...section.querySelectorAll('*')].filter(element => element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 1 && ['auto', 'scroll'].includes(getComputedStyle(element).overflowX)).length);
  expect(scrollers).toBe(0);
});
