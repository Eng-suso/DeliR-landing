import { expect, test } from '@playwright/test';

for (const language of ['it', 'en']) {
  test(`comparison criteria open their product evidence by keyboard (${language})`, async ({ page }) => {
    await page.goto(`/?lang=${language}#confronto`);
    const criteria = page.locator('#confronto [data-differentiator]');
    await expect(criteria).toHaveCount(6);
    for (let index = 0; index < 6; index++) {
      const link = criteria.nth(index).getByRole('link');
      const target = await link.getAttribute('href');
      expect(target).toMatch(/^#(scene-|caso$)/);
      await link.focus();
      await link.press('Enter');
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator(target!)).toBeInViewport();
      if (target!.startsWith('#scene-')) {
        await expect(page.locator(`[href="${target}"][aria-current="true"]`)).toHaveCount(1);
      }
    }
  });
}

test('hero makes the offer and an email enquiry available', async ({ page }) => {
  await page.goto('/');
  await page.locator('#hero-title').waitFor();
  const hero = page.locator('section[aria-labelledby="hero-title"]');
  for (const term of ['Conosci perimetro e prezzo prima di iniziare', 'Paghi solo quando ogni milestone viene consegnata', 'Puoi fermarti in qualsiasi momento, senza impegni a lungo termine']) await expect(hero.getByText(term)).toBeVisible();
  await expect(hero.getByRole('link', { name: 'Testa DeliR sul tuo progetto' })).toHaveAttribute('href', /^mailto:delir\.team@gmail\.com\?subject=/);
  await hero.getByRole('link', { name: 'Vedi il prodotto' }).click();
  await expect(page).toHaveURL(/#caso$/);
  await page.goto('/pilot');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Valuta un pilot DeliR sul tuo incarico.');
  await expect(page.getByRole('form')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Definisci il progetto' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Verifica e decidi' })).toBeVisible();
});

test('product chapters and buying questions remain accessible', async ({ page }) => {
  await page.goto('/');
  await page.locator('#caso').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-product-module]')).toHaveCount(5);
  const chapter = page.locator('#product-03');
  await expect(chapter.locator('img')).toHaveAttribute('alt', /canvas BPMN/);
  await chapter.getByRole('button', { name: /Apri il video completo/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Evidenze sul processo' });
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
  await page.goto('/'); await page.locator('#faq').scrollIntoViewIfNeeded();
  const toggle = page.locator('button[aria-controls="mobile-navigation"]');
  await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Pilot', exact: true }).click();
  await expect(page).toHaveURL(/#pilot$/); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('landing has no runtime errors', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Runtime check runs once');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/'); await page.locator('#early-access').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1); expect(errors).toEqual([]);
});

test('chapters and scenes support keyboard navigation and direct links', async ({ page }) => {
  await page.goto('/');
  const decisionLink = page.getByRole('navigation', { name: 'Benefici DeliR' }).getByRole('link', { name: 'Decisioni', exact: true });
  await decisionLink.focus(); await decisionLink.press('Enter');
  await expect(page).toHaveURL(/#product-04$/);
  const chapter = page.locator('#product-04');
  await expect(chapter.getByRole('heading', { name: 'Spiega le modifiche che raccomandi.' })).toBeInViewport();
  const expand = chapter.getByRole('button', { name: /Apri il video completo/ });
  await expand.focus(); await expand.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Review TO-BE' });
  await expect(dialog).toBeVisible(); await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible(); await expect(expand).toBeFocused();
  await page.goto('/#scene-review-as-is');
  await page.locator('#scene-review-as-is').waitFor();
  await expect(page.locator('#scene-review-as-is')).toBeInViewport();
  await page.reload(); await page.locator('#scene-review-as-is').waitFor(); await expect(page.locator('#scene-review-as-is')).toBeInViewport();
});

test('mobile menu closes with Escape and restores focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile keyboard check');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Apri il menu' }); await toggle.click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Il prodotto' }).focus();
  await page.keyboard.press('Escape'); await expect(toggle).toHaveAttribute('aria-expanded', 'false'); await expect(toggle).toBeFocused();
});

test('shared evidence links open the source panel directly', async ({ page }) => {
  await page.goto('/#comparison-evidence-review');
  await page.locator('#comparison-evidence-review').waitFor();
  await expect(page.locator('#comparison-evidence-review')).toBeInViewport();
  await expect(page.locator('#comparison-evidence-review').locator('xpath=ancestor::details')).toHaveAttribute('open', '');
  await page.locator('#confronto summary').click();
  await expect(page.locator('#confronto details')).not.toHaveAttribute('open', '');
  await page.locator('#confronto a[href="#comparison-evidence-review"]:visible').first().click();
  await expect(page.locator('#comparison-evidence-review')).toBeInViewport();
});

test('animated background can be paused with the keyboard and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const control = page.getByRole('button', { name: 'Ferma lo sfondo animato' });
  const ribbons = page.getByTestId('page-background').locator('.flow-motion');
  await expect(ribbons).toHaveCSS('animation-play-state', 'running');
  await control.focus(); await control.press('Enter');
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await expect(ribbons).toHaveCSS('animation-play-state', 'paused');
  await control.press('Enter');
  await expect(ribbons).toHaveCSS('animation-play-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(ribbons).toHaveCSS('animation-name', 'none');
});
