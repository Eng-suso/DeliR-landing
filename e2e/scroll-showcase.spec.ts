import { expect, test } from '@playwright/test';

test('landing remains usable from narrow phones through desktop', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Viewport matrix runs once in Chromium');

  for (const [name, width, height] of [
    ['narrow-phone', 320, 720],
    ['phone', 390, 844],
    ['tablet', 820, 1024],
    ['laptop', 1280, 800],
    ['desktop', 1440, 900],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Vedi il prodotto' })).toBeVisible();

    const state = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      heroImageLoaded: [...document.querySelectorAll('main figure img')].some((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0),
    }));
    expect(state.documentWidth, `${name} has no horizontal overflow`).toBeLessThanOrEqual(state.viewportWidth + 1);
    expect(state.heroImageLoaded, `${name} renders the product screenshot`).toBe(true);

    const screenshot = await page.screenshot({ path: testInfo.outputPath(`${name}-hero.png`) });
    await testInfo.attach(`${name}-hero`, { body: screenshot, contentType: 'image/png' });
  }
});

test('benefits are readable while scrolling and navigation reaches their real product screens', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Scroll behavior runs once in Chromium');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(true);

  const labels = ['Evidenze', 'Lacune', 'Contesto', 'Decisioni', 'Scenari'];
  await expect(page.locator('[data-product-benefit="true"]')).toHaveCount(4);
  await expect(page.locator('[data-product-module]:not([hidden])')).toHaveCount(1);
  let previousImage = '';
  for (let index = 0; index < labels.length; index += 1) {
    const chapter = page.locator('[data-product-module]').nth(index);
    await page.getByRole('navigation', { name: 'Benefici DeliR' }).getByRole('link', { name: labels[index], exact: true }).click();
    await chapter.scrollIntoViewIfNeeded();
    await expect(chapter).toHaveAttribute('data-product-module', labels[index]);
    const image = chapter.locator('img');
    await expect.poll(() => image.evaluate((element) => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
    const source = await image.getAttribute('src');
    expect(source).toBeTruthy();
    expect(source).not.toBe(previousImage);
    previousImage = source ?? '';
    if (index === 0) {
      await testInfo.attach('evidence-benefit', { body: await chapter.screenshot({ path: testInfo.outputPath('evidence-benefit.png') }), contentType: 'image/png' });
    }
  }
  await testInfo.attach('desktop-fifth-screen', { body: await page.screenshot(), contentType: 'image/png' });
});
