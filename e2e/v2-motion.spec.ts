import { expect, test } from '@playwright/test';

for (const width of [375, 834, 1440]) {
  test(`V2 reveals reset in both directions without problem-copy collisions at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/v2');
    await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const row = page.locator('.hybrid-problem-sequence li').nth(1);
    const bounds = await row.evaluate(element => {
      let top = 0;
      for (let node: HTMLElement | null = element as HTMLElement; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
      return { top, height: (element as HTMLElement).offsetHeight };
    });
    const position = async (y: number) => { await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y); };
    // Scroll positions are a geometry fixture; do not depend on a particular wheel device.
    await position(bounds.top - 1100);
    await expect(row).toHaveAttribute('data-v2-visibility', 'below');
    await expect(row).toHaveCSS('opacity', '0');
    await position(bounds.top - 210);
    await expect(row).toHaveAttribute('data-v2-visibility', 'visible');
    await expect.poll(() => row.evaluate(element => {
      const opacity = Number(getComputedStyle(element).opacity);
      return opacity > 0 && opacity < 1;
    }), { intervals: [16] }).toBe(true);
    await expect(row).toHaveCSS('opacity', '1');
    await expect(row).toHaveCSS('transform', 'none');
    await position(bounds.top + bounds.height + 160);
    await expect(row).toHaveAttribute('data-v2-visibility', 'above');
    await expect(row).toHaveCSS('opacity', '0');
    await position(bounds.top - 210);
    await expect(row).toHaveAttribute('data-v2-visibility', 'visible');
    await expect(row).toHaveCSS('opacity', '1');
    await position(bounds.top - 1100);
    await expect(row).toHaveAttribute('data-v2-visibility', 'below');
    await expect(row).toHaveCSS('opacity', '0');

    // Reproduce the screenshot: bottom of the navy problem section under the header.
    const conclusion = page.locator('.hybrid-problem-conclusion');
    await conclusion.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(conclusion).toHaveCSS('opacity', '1');
    const gap = await conclusion.evaluate(element => {
      const intro = document.querySelector('.hybrid-problem-intro')!.getBoundingClientRect();
      const rows = document.querySelector('.hybrid-problem-sequence')!.getBoundingClientRect();
      return element.getBoundingClientRect().top - Math.max(intro.bottom, rows.bottom);
    });
    expect(gap).toBeGreaterThanOrEqual(28);
    await page.screenshot({ path: testInfo.outputPath(`problem-bottom-${width}.png`) });

    // Offscreen keyboard targets become fully visible immediately on focus.
    const question = page.locator('#faq button').first();
    await question.focus();
    await expect(question).toBeFocused();
    const questionRow = question.locator('..');
    await expect(questionRow).toHaveCSS('opacity', '1');
    await expect(questionRow).toHaveCSS('transform', 'none');
    await expect(questionRow).toHaveCSS('transition-duration', '0s');
    await page.keyboard.press('Enter');
    await expect(question).toHaveAttribute('aria-expanded', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('[data-v2-visibility]')).toHaveCount(0);
    await expect(row).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

test('V2 prerender remains readable without JavaScript or an animation observer', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/seo/v2.it.html`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.locator('.hybrid-problem-conclusion').scrollIntoViewIfNeeded();
    await expect(page.locator('.hybrid-problem-conclusion')).toHaveCSS('opacity', '1');
    await expect(page.locator('[data-v2-visibility]')).toHaveCount(0);
    await page.locator('#faq-panel-9').scrollIntoViewIfNeeded();
    await expect(page.locator('#faq-panel-9')).toBeVisible();
  } finally { await context.close(); }
});

test('V2 Save-Data visitors get static content even with normal motion preference', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2');
  await expect(page.locator('.landing-hybrid')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
  await expect(page.locator('.product-film > div > video')).toHaveCount(0);
  await page.locator('.hybrid-problem-conclusion').scrollIntoViewIfNeeded();
  await expect(page.locator('.hybrid-problem-conclusion')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-v2-visibility]')).toHaveCount(0);
});
