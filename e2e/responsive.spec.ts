import { expect, test } from '@playwright/test';

for (const path of ['/', '/pilot', '/waitlist']) {
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
  await expect(page.getByRole('link', { name: 'Come funziona' })).toBeVisible();
  await page.getByRole('link', { name: 'Come funziona' }).click();
  await expect(page.getByRole('button', { name: 'Apri il menu' })).toHaveAttribute('aria-expanded', 'false');
});
