import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('hybrid exposes three benefits, V1 trust and existing demos across devices', async ({ page }, testInfo) => {
  const errors: string[] = [];
  const missingAssets: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.url().includes('/landing-v2/media/')) missingAssets.push(request.url()); });
  await page.goto('/v2');
  await expect(page.locator('.landing-hybrid[data-client-ready="true"]')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hybrid-hero-benefits li')).toHaveCount(3);
  await expect(page.locator('.hero-description > p')).toHaveText('Smetti di passare settimane a ricostruire come lavora davvero il tuo cliente.');
  await expect(page.locator('.hybrid-benefit')).toHaveCount(3);
  await expect(page.locator('#product-interest, #pilot-summary')).toHaveCount(0);
  await expect(page.locator('#fiducia')).toContainText('Prima di utilizzare dati reali');
  await expect(page.locator('#pilot')).toContainText('Conosci perimetro e prezzo prima di iniziare');
  await expect(page.locator('.hybrid-more')).not.toHaveAttribute('open', '');
  await expect(page.locator('.hybrid-comparison')).not.toHaveAttribute('open', '');
  await expect(page.locator('#piano-video')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  for (const width of [320, 375, 414, 768, 834, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const [index, benefit] of (await page.locator('.hybrid-benefit').all()).entries()) {
      await expect(benefit).toBeVisible();
      const media = await benefit.locator('.product-screen-stage').boundingBox();
      const copy = await benefit.locator('.hybrid-benefit-copy').boundingBox();
      if (width < 1024) expect(media!.y + media!.height).toBeLessThanOrEqual(copy!.y);
      else if (index === 1) expect(media!.x).toBeGreaterThan(copy!.x);
      else expect(media!.x).toBeLessThan(copy!.x);
    }
    const actions = await page.locator('.hero-actions').boundingBox();
    const visual = await page.locator('.hero-visual').boundingBox();
    if (width < 1024) expect(actions!.y + actions!.height).toBeLessThanOrEqual(visual!.y);
    if ([375, 834, 1440].includes(width)) {
      // A full-page capture exceeds WebKit's image limit at the iPhone scale.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(`hybrid-${width}.png`) });
      const firstBenefit = page.locator('#product-03');
      await firstBenefit.scrollIntoViewIfNeeded();
      await expect.poll(() => firstBenefit.locator('img').first().evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await firstBenefit.screenshot({ path: testInfo.outputPath(`hybrid-benefit-${width}.png`) });
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  }
  expect(errors).toEqual([]);
  expect(missingAssets).toEqual([]);
  const prerender = await page.request.get('/seo/v2.it.html');
  expect(prerender.ok()).toBe(true);
  const html = await prerender.text();
  expect(html).toContain('noindex, follow');
  expect(html).toContain('hybrid-benefit-copy');
  expect(html).toContain('Il contesto del tuo cliente merita regole chiare.');
});

test('supporting scenes and comparison remain deep linkable', async ({ page }) => {
  await page.goto('/v2#scene-memoria');
  await expect(page.locator('.hybrid-more')).toHaveAttribute('open', '');
  await expect(page.locator('#scene-memoria')).toBeVisible();
  await page.goto('/v2?lang=en#scene-review-to-be');
  await expect(page.locator('#scene-review-to-be')).toBeVisible();
  await expect(page.locator('#product-04-title')).toHaveText('Explain the changes you recommend.');
  await page.goto('/v2?lang=it#confronto');
  await expect(page.locator('.hybrid-comparison')).toHaveAttribute('open', '');
  await expect(page.locator('#confronto table')).toBeVisible();
  await page.locator('#confronto').getByRole('link', { name: /DeliR · Trova lacune/ }).click();
  await expect(page.locator('#scene-lacuna-aperta')).toBeVisible();
});

test('video plan uses available recordings and preserves language', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v2');
  await page.getByRole('link', { name: 'Mostra piano video' }).click();
  await expect(page).toHaveURL(/studio=1/);
  await expect(page.locator('.hybrid-plan-card')).toHaveCount(4);
  await expect(page.locator('#piano-video')).toContainText('Nessun nuovo video è obbligatorio');
  for (const link of await page.locator('.hybrid-plan-card a').all()) {
    const response = await page.request.head((await link.getAttribute('href'))!);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('video/');
  }
  await page.getByRole('button', { name: 'English', exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/studio=1/);
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator('#video-plan-title')).toHaveText('The demos are already available.');
  await page.getByRole('link', { name: 'Hide video plan' }).click();
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator('#piano-video')).toHaveCount(0);
});

test('keyboard opens menus, supporting content, full demo and FAQ', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/v2');
  const skip = page.locator('a[href="#main-content"]');
  await skip.focus();
  await page.keyboard.press('Enter');
  const toggle = page.locator('button[aria-controls="mobile-navigation"]');
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const expand = page.locator('#hero-product-outcome').getByRole('button', { name: 'Apri il video completo: DeliR in azione' });
  await expand.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'DeliR in azione' });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.locator('video').evaluate(video => (video as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(expand).toBeFocused();
  const more = page.locator('.hybrid-more > summary');
  await more.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#product-01-title')).toBeVisible();
  const question = page.locator('#faq button').first();
  await question.focus(); await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
});

test('hybrid studio and expanded content have no automatic A/AA violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Responsive and keyboard checks cover both browsers; axe runs in Chromium.');
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/v2?studio=1');
    await page.locator('.hybrid-more > summary').click();
    await page.locator('.hybrid-comparison > summary').click();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations).toEqual([]);
  }
});
