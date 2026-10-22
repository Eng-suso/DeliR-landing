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
      expect(target).toMatch(/^#(discovery|evidence|simulation|results|caso)$/);
      await link.focus();
      await link.press('Enter');
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator(target!)).toBeInViewport();
      if (target !== '#caso') {
        await expect(page.locator(`#caso [role="tab"][aria-selected="true"]`)).toHaveCount(1);
        await expect(page.locator('#caso [role="tabpanel"] [data-product-video]')).toHaveAttribute('data-product-video', target!.slice(1));
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

test('product videos and buying questions remain accessible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await page.locator('#caso').scrollIntoViewIfNeeded();
  await expect(page.locator('#caso [data-product-video]')).toHaveCount(3);
  await page.getByRole('tab', { name: /Evidenze e BPMN/ }).click();
  const panel = page.getByRole('tabpanel');
  await panel.getByRole('button', { name: /Riproduci: Evidenze e BPMN/ }).click();
  await expect(panel.locator('video')).toHaveAttribute('controls', '');
  await panel.locator('summary', { hasText: 'Cosa mostra il video' }).click();
  await expect(panel.getByText(/ogni versione/)).toBeVisible();
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

test('product steps support keyboard navigation and direct links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const decisionLink = page.getByRole('navigation', { name: 'Esplora il percorso DeliR' }).getByRole('link', { name: /^Migliora/ });
  await decisionLink.focus(); await decisionLink.press('Enter');
  await expect(page).toHaveURL(/#results$/);
  const results = page.getByRole('tab', { name: /Risultati e consegna/ });
  await expect(results).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#results')).toBeInViewport();
  await results.focus(); await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: /Analisi e simulazione/ })).toBeFocused();
  await expect(page.getByRole('tab', { name: /Analisi e simulazione/ })).toHaveAttribute('aria-selected', 'true');
  // A link shared before the videos still opens the matching step.
  await page.goto('/#scene-review-as-is');
  await page.locator('#scene-review-as-is').waitFor({ state: 'attached' });
  await expect(page.getByRole('tab', { name: /Evidenze e BPMN/ })).toHaveAttribute('aria-selected', 'true');
  await page.reload(); await expect(page.getByRole('tab', { name: /Evidenze e BPMN/ })).toHaveAttribute('aria-selected', 'true');
});
