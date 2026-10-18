import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('V2 has seven planned slots, responsive layouts and no premature video requests', async ({ page }, testInfo) => {
  const missingAssets: string[] = [];
  const errors: string[] = [];
  page.on('request', request => { if (request.url().includes('/landing-v2/media/')) missingAssets.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/v2');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Software di Process Intelligence/);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-video-slot]')).toHaveCount(7);
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  for (const width of [320, 375, 414, 768, 834, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport + 1);
    const table = page.locator('.v2-comparison-table');
    if (width >= 1024) await expect(table).toBeVisible(); else await expect(table).toBeHidden();
    const cards = page.locator('.v2-comparison-cards');
    if (width < 1024) await expect(cards).toBeVisible(); else await expect(cards).toBeHidden();
    await expect(cards.locator('[data-v2-differentiator]')).toHaveCount(6);
    const extraProofs = page.locator('.v2-proof-mobile-details');
    const closingVisual = page.locator('.v2-final-visual');
    if (width < 768) { await expect(extraProofs).toBeVisible(); await expect(closingVisual).toBeVisible(); }
    else { await expect(extraProofs).toBeHidden(); await expect(closingVisual).toBeHidden(); }
    if (width < 1024) await expect(page.locator('.v2-problem [data-video-slot]')).toBeHidden();
    else await expect(page.locator('.v2-problem [data-video-slot]')).toBeVisible();
    for (const [index, benefit] of (await page.locator('.v2-benefit').all()).entries()) {
      const mediaBox = await benefit.locator('[data-video-slot]').boundingBox();
      const copyBox = await benefit.locator('.v2-benefit-copy').boundingBox();
      if (width < 1024) expect(mediaBox!.y + mediaBox!.height).toBeLessThanOrEqual(copyBox!.y);
      else if (index === 1) expect(mediaBox!.x).toBeGreaterThan(copyBox!.x);
      else expect(mediaBox!.x).toBeLessThan(copyBox!.x);
    }
    const ratio = await page.locator('.v2-media-frame').first().evaluate(element => {
      const rect = element.getBoundingClientRect();
      return rect.width / rect.height;
    });
    expect(ratio).toBeCloseTo(width < 768 ? 184 / 107 : 637 / 530, 1);
    if (width === 1440) {
      const frame = await page.locator('.v2-hero .v2-media-frame').boundingBox();
      expect(frame!.width).toBeCloseTo(637, 0);
    }
    if ([375, 414, 834, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath(`v2-${width}.png`) });
  }
  expect(missingAssets).toEqual([]);
  expect(errors).toEqual([]);
  const prerender = await page.request.get('/seo/v2.it.html');
  expect(prerender.ok()).toBe(true);
  expect(await prerender.text()).toContain('noindex, follow');
});

test('video plan and language are linkable and keep each other selected', async ({ page }) => {
  await page.goto('/v2');
  await page.getByRole('link', { name: 'Mostra piano video' }).click();
  await expect(page).toHaveURL(/studio=1/);
  await expect(page.locator('.v2-shot-card')).toHaveCount(7);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('button', { name: 'English', exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/studio=1/);
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByText('/landing-v2/media/hero.desktop.en.mp4', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Hide video plan' }).click();
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator('.v2-shot-card')).toHaveCount(0);
});

test('mobile navigation, skip link and FAQ work with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/v2');
  await expect(page.locator('#hero-v2-title')).toBeVisible();
  const skip = page.locator('a[href="#main-content"]');
  await skip.focus();
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  const toggle = page.locator('button[aria-controls="mobile-navigation-v2"]');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#mobile-navigation-v2').getByRole('link', { name: 'Il prodotto', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#caso$/);
  const question = page.locator('#faq button').first();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator(`#${await question.getAttribute('aria-controls')}`)).toBeVisible();
});

test('V2 and studio have no automatic WCAG A/AA violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Run axe in Chromium; responsive behavior runs in every browser.');
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/v2?studio=1');
    await expect(page.locator('[data-video-slot]')).toHaveCount(7);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations).toEqual([]);
  }
});
