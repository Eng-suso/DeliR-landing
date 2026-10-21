import { expect, test } from '@playwright/test';

for (const language of ['it', 'en']) {
  test(`comparison criteria open their product evidence by keyboard (${language})`, async ({ page }) => {
    await page.goto(`/?lang=${language}#confronto`);
    const disclosure = page.locator('#confronto details');
    await disclosure.locator('summary').click();
    const criteria = page.locator('#confronto [data-differentiator]');
    await expect(criteria).toHaveCount(6);
    for (let index = 0; index < 6; index++) {
      await disclosure.locator('summary').scrollIntoViewIfNeeded();
      const link = criteria.nth(index).getByRole('link');
      const target = await link.getAttribute('href');
      expect(target).toMatch(/^#(scene-|caso$)/);
      await link.focus();
      await link.press('Enter');
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator(target!)).toBeInViewport();
      if (target!.startsWith('#scene-')) {
        await expect(page.locator(`${target}[data-clip]`)).toBeVisible();
      }
    }
  });
}

test('hero prioritizes the waitlist while the paid pilot remains visible and available', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await page.locator('#hero-title').waitFor();
  const hero = page.locator('section[aria-labelledby="hero-title"]');
  for (const term of ['Conosci perimetro e prezzo prima di iniziare', 'Paghi solo quando ogni milestone viene consegnata', 'Puoi fermarti in qualsiasi momento, senza impegni a lungo termine']) await expect(page.locator('#pilot').getByText(term)).toBeVisible();
  await expect(hero.getByRole('link', { name: 'Entra nella lista d’attesa' })).toHaveAttribute('href', '/waitlist');
  await expect(hero.getByRole('link', { name: 'Avvia un pilot' })).toHaveAttribute('href', '/pilot#application');
  await expect(page.locator('#pilot').getByRole('link', { name: 'Testa DeliR sul tuo progetto' })).toHaveAttribute('href', '/pilot#application');
  await hero.getByRole('link', { name: 'Vedi il prodotto' }).click();
  await expect(page).toHaveURL(/#caso$/);
  await page.goto('/pilot');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Testa DeliR sul tuo progetto.');
  await expect(page.getByRole('form')).toBeVisible();
  await expect(page.getByLabel('Nome e cognome')).toBeEnabled();
});

test('product chapters and buying questions remain accessible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await page.locator('#caso').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-product-module]')).toHaveCount(5);
  const chapter = page.locator('#product-03');
  await expect(chapter.locator('img')).toHaveAttribute('alt', /pannello delle evidenze/);
  await chapter.getByRole('button', { name: /Apri il video completo/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Dalle fonti al processo' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('video')).toHaveAttribute('controls', '');
  await dialog.getByRole('button', { name: 'Chiudi il video' }).click();
  const faq = page.getByRole('button', { name: /Cosa succede se il cliente dimentica informazioni importanti o le fonti si contraddicono/ });
  await faq.click();
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: 'Cosa succede se il cliente dimentica informazioni importanti o le fonti si contraddicono?' })).toBeVisible();
});

test('mobile navigation remains operable after deep scrolling', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation check');
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible(); await page.locator('#faq').scrollIntoViewIfNeeded();
  const toggle = page.locator('button[aria-controls="mobile-navigation"]');
  await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Pilot', exact: true }).click();
  await expect(page).toHaveURL(/#pilot$/); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('landing has no runtime errors', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Runtime check runs once');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible(); await page.locator('#early-access').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1); expect(errors).toEqual([]);
});

test('chapters and scenes support keyboard navigation and direct links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await page.locator('.hybrid-more > summary').click();
  const decisionLink = page.getByRole('navigation', { name: 'Esplora il percorso DeliR' }).getByRole('link', { name: /^Migliora/ });
  await decisionLink.focus(); await decisionLink.press('Enter');
  await expect(page).toHaveURL(/#scene-decisioni$/);
  const chapter = page.locator('#product-04');
  await expect(chapter.getByRole('heading', { name: 'Spiega le modifiche che raccomandi.' })).toBeVisible();
  await expect(page.locator('#scene-decisioni')).toBeInViewport();
  const expand = chapter.getByRole('button', { name: /Apri il video completo/ });
  await expand.focus(); await expand.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Modifiche spiegate, fino al cliente' });
  await expect(dialog).toBeVisible(); await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible(); await expect(expand).toBeFocused();
  // A scene link published before v3 opens the recording that now covers that step.
  await page.goto('/#scene-review-as-is');
  await expect(page).toHaveURL(/#scene-evidenze$/);
  await page.locator('#scene-evidenze').waitFor();
  await expect(page.locator('#scene-evidenze')).toBeInViewport();
  await page.reload(); await page.locator('#scene-evidenze').waitFor(); await expect(page.locator('#scene-evidenze')).toBeInViewport();
});

test('mobile menu closes with Escape and restores focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile keyboard check');
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const toggle = page.getByRole('button', { name: 'Apri il menu' }); await toggle.click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Il prodotto' }).focus();
  await page.keyboard.press('Escape'); await expect(toggle).toHaveAttribute('aria-expanded', 'false'); await expect(toggle).toBeFocused();
});

test('shared evidence links lead to the dedicated sources page', async ({ page }) => {
  await page.goto('/#comparison-evidence-review');
  await expect(page).toHaveURL(/\/comparison-sources#comparison-evidence-review$/);
  await expect(page.locator('#comparison-evidence-review')).toBeInViewport();
  await expect(page.locator('#comparison-evidence-review')).toBeFocused();
  await page.getByRole('link', { name: /Torna al confronto/ }).click();
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await expect(page.locator('#confronto details')).toHaveCount(1);
  await page.locator('#confronto a[href="/comparison-sources#comparison-evidence-review"]').first().click();
  await expect(page).toHaveURL(/\/comparison-sources#comparison-evidence-review$/);
  await expect(page.locator('#comparison-evidence-review')).toBeInViewport();
});

test('reading motion respects the visitor preference and exposes no decorative background loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await expect(page.getByTestId('page-background')).toHaveCount(0);
  await expect(page.locator('.landing-hybrid')).toHaveAttribute('data-motion', 'full');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Check the visitor-visible result, independent of observer bookkeeping.
  await expect(page.locator('.hero-heading')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-heading')).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-heading')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});
