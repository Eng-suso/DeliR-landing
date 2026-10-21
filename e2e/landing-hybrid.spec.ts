import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('hybrid exposes the product videos, V1 trust and demos across devices', async ({ page }, testInfo) => {
  const errors: string[] = [];
  const missingAssets: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.url().includes('/landing-v2/media/')) missingAssets.push(request.url()); });
  await page.goto('/v2');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hybrid-hero-benefits li')).toHaveCount(3);
  await expect(page.locator('.hero-description > p')).toHaveText('Smetti di passare settimane a ricostruire come lavora davvero il tuo cliente.');
  await expect(page.locator('#caso .pv-card')).toHaveCount(2);
  await expect(page.locator('#caso [role="tab"]')).toHaveCount(4);
  await expect(page.locator('#product-interest, #pilot-summary')).toHaveCount(0);
  await expect(page.locator('#fiducia')).toContainText('Prima di utilizzare dati reali');
  await expect(page.locator('#pilot')).toContainText('Conosci perimetro e prezzo prima di iniziare');
  await expect(page.locator('#caso video')).toHaveCount(0);
  await expect(page.locator('#confronto table')).toBeVisible();
  await expect(page.locator('#confronto')).not.toHaveJSProperty('tagName', 'DETAILS');
  await expect(page.locator('#piano-video')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  for (const width of [320, 375, 414, 768, 834, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const card of await page.locator('#caso .pv-card, #caso .pv-panel').all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      // Read the boxes together: scroll anchoring can move a deferred section
      // between two separate browser round trips while resizing.
      const layout = await card.evaluate(element => {
        const player = element.querySelector('.pv-player')!.getBoundingClientRect();
        return { ratio: player.width / player.height, right: player.right, width: element.getBoundingClientRect().width };
      });
      // The whole 16:9 recording stays visible: no crop at any width.
      expect(Math.abs(layout.ratio - 16 / 9)).toBeLessThan(0.03);
      expect(layout.right).toBeLessThanOrEqual(width + 1);
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
  const firstVideo = page.locator('#caso [data-product-video="problem"]');
  await firstVideo.scrollIntoViewIfNeeded();
  await expect.poll(() => firstVideo.locator('img').evaluate(img => (img as HTMLImageElement).naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0);
  await page.locator('#caso').screenshot({ path: testInfo.outputPath('product-videos-375.png') });
  expect(errors).toEqual([]);
  expect(missingAssets).toEqual([]);
  const prerender = await page.request.get('/seo/v2.it.html');
  expect(prerender.ok()).toBe(true);
  const html = await prerender.text();
  expect(html).toContain('noindex, follow');
  expect(html).toContain('pv-tabs');
  expect(html).toContain('Il contesto del tuo cliente merita regole chiare.');
});

test('DeliR workflow links open their product video and keep preview navigation in V2', async ({ page }) => {
  await page.goto('/v2');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await expect(page.locator('#hero-title')).toHaveText('Mappa. Analizza. Simula. Migliora.');
  const path = page.getByRole('navigation', { name: 'Esplora il percorso DeliR' });
  await expect(path.getByRole('link')).toHaveCount(4);
  const targets = ['evidence', 'discovery', 'simulation', 'results'];
  for (const [index, id] of targets.entries()) {
    const link = path.getByRole('link').nth(index);
    await link.focus();
    await link.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator('#caso [role="tabpanel"] [data-product-video]')).toHaveAttribute('data-product-video', id);
    await expect(page.locator('#caso [role="tabpanel"]')).toBeInViewport();
    await expect(page.locator('#caso video')).toHaveCount(0);
  }
  await page.getByRole('link', { name: 'DeliR home', exact: true }).click();
  await expect(page).toHaveURL(/\/v2#hero$/);
  await expect.poll(() => page.evaluate(() => document.querySelector('#hero-title')!.getBoundingClientRect().top - document.querySelector('.premium-navigation')!.getBoundingClientRect().bottom)).toBeGreaterThanOrEqual(0);
  await expect(page.locator('footer').getByRole('link', { name: 'Il prodotto', exact: true })).toHaveAttribute('href', '/v2#caso');
  await page.goto('/v2?lang=en');
  await expect(page.locator('.hero-description > p')).toHaveText('Stop spending weeks reconstructing how your client really works.');
  await page.getByRole('navigation', { name: 'Explore the DeliR workflow' }).getByRole('link', { name: /^Improve/ }).click();
  await expect(page).toHaveURL(/lang=en#results$/);
  await expect(page.getByRole('tab', { name: /Results & Deliverables/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('link', { name: 'DeliR home', exact: true })).toHaveAttribute('href', '/v2?lang=en#hero');
  await expect(page.locator('footer').getByRole('link', { name: 'Product', exact: true })).toHaveAttribute('href', '/v2?lang=en#caso');
  await expect(page.locator('footer').getByRole('link', { name: 'DeliR.', exact: true })).toHaveAttribute('href', '/v2?lang=en#hero');
});

test('earlier scene links and comparison remain deep linkable', async ({ page }) => {
  await page.goto('/v2#scene-memoria');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await expect(page.getByRole('tab', { name: /Risultati e consegna/ })).toHaveAttribute('aria-selected', 'true');
  await page.goto('/v2?lang=en#scene-confronto');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await expect(page.getByRole('tab', { name: /Analysis & Simulation/ })).toHaveAttribute('aria-selected', 'true');
  await page.goto('/v2?lang=it#confronto');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await expect(page.locator('#confronto table')).toBeVisible();
  await expect(page.locator('#confronto table')).toBeVisible();
  await page.locator('#confronto').getByRole('link', { name: /DeliR · Trova lacune/ }).click();
  await expect(page).toHaveURL(/#discovery$/);
  await expect(page.getByRole('tab', { name: /Process Discovery/ })).toHaveAttribute('aria-selected', 'true');
});

test('V2 product steps switch in place and motion respects the visitor preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  await expect(page.locator('.hero-heading')).toHaveAttribute('data-v2-visibility', 'visible');
  await expect(page.locator('.hero-heading')).toHaveCSS('transition-duration', '0.56s, 0.56s');
  const steps = page.getByRole('tablist', { name: 'Passaggi del prodotto' });
  await steps.getByRole('tab', { name: /Evidenze e BPMN/ }).click();
  await expect(steps.getByRole('tab', { name: /Evidenze e BPMN/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('BPMN 2.0');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-heading')).not.toHaveAttribute('data-v2-visibility', /.+/);
  await expect(page.locator('.hero-heading')).toHaveCSS('animation-name', 'none');
  await steps.getByRole('tab', { name: /Evidenze e BPMN/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(steps.getByRole('tab', { name: /Analisi e simulazione/ })).toBeFocused();
  await expect(steps.getByRole('tab', { name: /Analisi e simulazione/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#caso video')).toHaveCount(0);
});

test('V2 keeps repeated anchors, history and mobile conversion usable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v2');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
  const quickAction = page.locator('.v2-quick-action');
  await expect(quickAction).toBeVisible();
  await expect(quickAction).toHaveAttribute('href', '/waitlist');
  await expect(page.locator('#metodo')).toHaveCSS('content-visibility', 'visible');
  const product = page.locator('.hero-actions a[href="#caso"]');
  await product.click();
  await expect(page).toHaveURL(/#caso$/);
  await expect(page.locator('#caso')).toBeFocused();
  await expect.poll(() => page.locator('#caso').evaluate(element => {
    const gap = element.getBoundingClientRect().top - document.querySelector('.premium-navigation')!.getBoundingClientRect().bottom;
    return Math.abs(gap - 24);
  })).toBeLessThan(2);
  // Repeating the same product link returns to the section from anywhere.
  await page.evaluate(() => window.scrollBy({ top: 900, behavior: 'instant' }));
  await page.locator('.hero-actions a[href="#caso"]').evaluate(link => (link as HTMLAnchorElement).click());
  await expect.poll(() => page.locator('#caso').evaluate(element => Math.abs(element.getBoundingClientRect().top - document.querySelector('.premium-navigation')!.getBoundingClientRect().bottom - 24))).toBeLessThan(2);
  await page.getByRole('tab', { name: /Process Discovery/ }).scrollIntoViewIfNeeded();
  await expect(page.locator('#caso')).toBeInViewport();
  await expect(page.locator('.premium-navigation')).toHaveAttribute('data-scrolled', 'true');
  await quickAction.click();
  await expect(page).toHaveURL(/\/waitlist$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('video plan uses available recordings and preserves language', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile-safari';
  await page.setViewportSize({ width: mobile ? 375 : 1440, height: 900 });
  await page.goto('/v2');
  await expect(page.getByRole('complementary', { name: 'Produzione video' })).toHaveCount(0);
  await expect(page).not.toHaveTitle(/anteprima|preview/i);
  await page.goto('/v2?studio=1');
  await page.locator('.landing-hybrid[data-client-ready="true"]').waitFor();
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
  await page.getByRole('link', { name: 'Back to the landing page' }).click();
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator('#piano-video')).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: 'Video production' })).toHaveCount(0);
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
  await expect.poll(() => film.locator(':scope > div > video').evaluate(video => (video as HTMLVideoElement).currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
  const pause = film.getByRole('button', { name: 'Pausa: DeliR in azione' });
  if (await pause.isVisible()) await pause.click();
  await film.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect.poll(() => film.locator(':scope > div > video').evaluate(video => (video as HTMLVideoElement).readyState), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  const expand = film.getByRole('button', { name: 'Apri il video completo: DeliR in azione' });
  await expand.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'DeliR in azione' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('video')).toHaveAttribute('loop', '');
  await expect.poll(() => dialog.locator('video').evaluate(video => (video as HTMLVideoElement).readyState), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(expand).toBeFocused();
  const walkthrough = page.getByRole('button', { name: /Guarda il percorso completo/ });
  await walkthrough.focus(); await page.keyboard.press('Enter');
  const full = page.getByRole('dialog', { name: 'Il percorso completo' });
  await expect(full).toBeVisible();
  await expect(full.locator('video')).toHaveAttribute('controls', '');
  await page.keyboard.press('Escape');
  await expect(full).not.toBeVisible();
  const question = page.locator('#faq button').first();
  await question.focus(); await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
});

test('hybrid studio and expanded content have no automatic A/AA violations', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Responsive and keyboard checks cover both browsers; axe runs in Chromium.');
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/v2?studio=1');
    await page.locator('#caso .pv-description > summary').first().click();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations).toEqual([]);
  }
});
