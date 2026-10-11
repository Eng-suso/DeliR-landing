import { expect, test } from '@playwright/test';

test('hero makes the offer and an email enquiry available', async ({ page }) => {
  await page.goto('/');
  await page.locator('#hero-title').waitFor();
  const hero = page.locator('section[aria-labelledby="hero-title"]');
  for (const term of ['Pilot a pagamento per milestone', 'Perimetro e criteri concordati', 'Primo contatto senza dati del cliente']) await expect(hero.getByText(term)).toBeVisible();
  await expect(hero.getByRole('link', { name: 'Parliamo del tuo progetto' })).toHaveAttribute('href', /^mailto:delir\.team@gmail\.com\?subject=/);
  await hero.getByRole('link', { name: 'Vedi il prodotto' }).click();
  await expect(page).toHaveURL(/#caso$/);
  await page.goto('/pilot');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Valuta un pilot DeliR sul tuo incarico.');
  await expect(page.getByRole('form')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Firma e avvio' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Consegna al process owner' })).toBeVisible();
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
  const faq = page.getByRole('button', { name: 'Quanto dura e quali output ricevo?' });
  await faq.click();
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: 'Quanto dura e quali output ricevo?' })).toBeVisible();
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
  await page.locator('#confronto table a[href="#comparison-evidence-review"]').first().click();
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
