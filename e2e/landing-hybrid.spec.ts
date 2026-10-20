import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('hybrid exposes three benefits, V1 trust and existing demos across devices', async ({ page }, testInfo) => {
  const errors: string[] = [];
  const missingAssets: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.url().includes('/landing-v2/media/')) missingAssets.push(request.url()); });
  await page.goto('/v2');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hybrid-hero-benefits li')).toHaveCount(3);
  await expect(page.locator('.hero-description > p')).toHaveText('Smetti di passare settimane a ricostruire come lavora davvero il tuo cliente. DeliR trasforma la conoscenza dispersa in un As-Is verificato, confronta scenari To-Be e migliora continuamente i processi, così puoi fornire raccomandazioni migliori più rapidamente.');
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
      await benefit.scrollIntoViewIfNeeded();
      await expect(benefit).toBeVisible();
      // Read both boxes together: scroll anchoring can move a deferred section
      // between two separate browser round trips while resizing.
      const layout = await benefit.evaluate(element => {
        const media = element.querySelector('.product-screen-stage')!.getBoundingClientRect();
        const copy = element.querySelector('.hybrid-benefit-copy')!.getBoundingClientRect();
        return { mediaBottom: media.bottom, mediaX: media.x, copyTop: copy.top, copyX: copy.x };
      });
      if (width < 1024) expect(layout.mediaBottom).toBeLessThanOrEqual(layout.copyTop);
      else if (index === 1) expect(layout.mediaX).toBeGreaterThan(layout.copyX);
      else expect(layout.mediaX).toBeLessThan(layout.copyX);
    }
    await page.locator('#hero').scrollIntoViewIfNeeded();
    const hero = await page.locator('#hero').evaluate(element => ({
      actionBottom: element.querySelector('.hero-actions')!.getBoundingClientRect().bottom,
      visualTop: element.querySelector('.hero-visual')!.getBoundingClientRect().top,
      visualLeft: element.querySelector('.hero-visual')!.getBoundingClientRect().left,
      copyRight: Math.max(...['.hero-heading', '.hero-description', '.hero-actions'].map(selector => element.querySelector(selector)!.getBoundingClientRect().right)),
    }));
    if (width < 1024) expect(hero.actionBottom).toBeLessThanOrEqual(hero.visualTop);
    else expect(hero.copyRight).toBeLessThanOrEqual(hero.visualLeft);
    if ([375, 834, 1440].includes(width)) {
      // A full-page capture exceeds WebKit's image limit at the iPhone scale.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(`hybrid-${width}.png`) });
    }
  }
  // Follow the real product anchor before checking the lazy mobile poster.
  // Cropped images inside a skipped section cannot be scroll targets in WebKit.
  await page.setViewportSize({ width: 375, height: 900 });
  await page.locator('.hero-actions a[href="#caso"]').click();
  const firstBenefit = page.locator('#product-03');
  await firstBenefit.locator('.product-screen-stage').scrollIntoViewIfNeeded();
  await expect.poll(() => firstBenefit.locator('img').first().evaluate(img => (img as HTMLImageElement).naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0);
  await firstBenefit.screenshot({ path: testInfo.outputPath('hybrid-benefit-375.png') });
  expect(errors).toEqual([]);
  expect(missingAssets).toEqual([]);
  const prerender = await page.request.get('/seo/v2.it.html');
  expect(prerender.ok()).toBe(true);
  const html = await prerender.text();
  expect(html).toContain('noindex, follow');
  expect(html).toContain('hybrid-benefit-copy');
  expect(html).toContain('Il contesto del tuo cliente merita regole chiare.');
});

test('DeliR workflow links reach real scenes and keep preview navigation in V2', async ({ page }) => {
  await page.goto('/v2');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await expect(page.locator('#hero-title')).toHaveText('Mappa. Analizza. Simula. Migliora.');
  const path = page.getByRole('navigation', { name: 'Esplora il percorso DeliR' });
  await expect(path.getByRole('link')).toHaveCount(4);
  const targets = ['product-03', 'product-02', 'product-05', 'scene-review-to-be'];
  for (const [index, id] of targets.entries()) {
    const link = path.getByRole('link').nth(index);
    await link.focus();
    await link.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator(`#${id} video`)).toHaveCount(0);
  }
  await expect(page.locator('.hybrid-more')).toHaveAttribute('open', '');
  await page.getByRole('link', { name: 'DeliR home', exact: true }).click();
  await expect(page).toHaveURL(/\/v2#hero$/);
  await expect.poll(() => page.evaluate(() => document.querySelector('#hero-title')!.getBoundingClientRect().top - document.querySelector('.premium-navigation')!.getBoundingClientRect().bottom)).toBeGreaterThanOrEqual(0);
  await expect(page.locator('footer').getByRole('link', { name: 'Il prodotto', exact: true })).toHaveAttribute('href', '/v2#caso');
  await page.goto('/v2?lang=en');
  await expect(page.locator('.hero-description > p')).toHaveText('Stop spending weeks reconstructing how your client really works. DeliR turns scattered knowledge into a verified As-Is, compares To-Be scenarios, and continuously improves processes so you deliver better recommendations faster.');
  await page.getByRole('navigation', { name: 'Explore the DeliR workflow' }).getByRole('link', { name: /^Improve/ }).click();
  await expect(page).toHaveURL(/lang=en#scene-review-to-be$/);
  await expect(page.locator('#product-04-title')).toHaveText('Explain the changes you recommend.');
  await expect(page.getByRole('link', { name: 'DeliR home', exact: true })).toHaveAttribute('href', '/v2?lang=en#hero');
  await expect(page.locator('footer').getByRole('link', { name: 'Product', exact: true })).toHaveAttribute('href', '/v2?lang=en#caso');
  await expect(page.locator('footer').getByRole('link', { name: 'DeliR.', exact: true })).toHaveAttribute('href', '/v2?lang=en#hero');
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

test('V2 chapters follow reading position and motion respects the visitor preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2');
  await expect(page.locator('.hero-heading')).toHaveAttribute('data-v2-entered', 'true');
  await expect(page.locator('.hero-heading')).toHaveCSS('animation-name', 'delir-arrive');
  const chapter = page.getByRole('navigation', { name: 'Capitoli del prodotto' });
  await chapter.getByRole('link', { name: 'Lacune', exact: true }).click();
  await expect(page).toHaveURL(/#product-02$/);
  await expect(chapter.getByRole('link', { name: 'Lacune', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect.poll(() => page.locator('#product-02').evaluate(element => {
    const gap = element.getBoundingClientRect().top - document.querySelector('.hybrid-chapter-nav')!.getBoundingClientRect().bottom;
    return gap >= 10 && gap <= 32;
  })).toBe(true);
  await expect(page.locator('#product-02 .product-screen-stage')).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('#product-02 .product-screen-stage')).toHaveCSS('box-shadow', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-heading')).not.toHaveAttribute('data-v2-entered', 'true');
  await expect(page.locator('.hero-heading')).toHaveCSS('animation-name', 'none');
  await chapter.getByRole('link', { name: 'Scenari', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(chapter.getByRole('link', { name: 'Scenari', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect(page.locator('#product-05 video')).toHaveCount(0);
});

test('video plan uses available recordings and preserves language', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile-safari';
  await page.setViewportSize({ width: mobile ? 375 : 1440, height: 900 });
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
  const menu = page.locator('button[aria-controls="mobile-navigation"]');
  if (mobile) await menu.click();
  await page.getByRole('button', { name: 'English', exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/studio=1/);
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator('#video-plan-title')).toHaveText('The demos are already available.');
  if (mobile) await menu.click();
  await page.getByRole('link', { name: 'Hide video plan' }).click();
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator('#piano-video')).toHaveCount(0);
});

test('keyboard opens menus, supporting content, full demo and FAQ', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
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
  const film = page.locator('#hero-product-outcome');
  await film.scrollIntoViewIfNeeded();
  await expect(film.locator('video')).toHaveCount(0);
  await film.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect.poll(() => film.locator(':scope > div > video').evaluate(video => (video as HTMLVideoElement).readyState), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  const expand = film.getByRole('button', { name: 'Apri il video completo: DeliR in azione' });
  await expand.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'DeliR in azione' });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.locator('video').evaluate(video => (video as HTMLVideoElement).readyState), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
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
