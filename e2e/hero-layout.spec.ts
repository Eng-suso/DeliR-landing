import { expect, test } from '@playwright/test';

const approved = {
  it: 'Smetti di passare settimane a ricostruire come lavora davvero il tuo cliente.',
  en: 'Stop spending weeks reconstructing how your client really works.',
};

for (const language of ['it', 'en'] as const) {
  test(`hero preserves approved copy and readable product order (${language})`, async ({ page, browserName }) => {
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/?lang=${language}`);
      await page.locator('.landing-page[data-client-ready="true"]').waitFor();
      await expect(page.locator('.hero-description > p')).toHaveText(approved[language]);
      await expect(page.locator('.hybrid-hero-benefits li')).toHaveCount(3);
      const reassurance = language === 'it' ? 'Iscrizione gratuita · Nessun obbligo d’acquisto · Nessun documento del cliente richiesto' : 'Free signup · No purchase obligation · No client documents needed';
      await expect(page.locator('.hero-actions > p').first()).toHaveText(reassurance);
      await expect(page.locator('#early-access .btn-primary + p')).toHaveText(reassurance);
      await expect(page.locator('.hero-description')).toBeVisible();
      const geometry = await page.evaluate(() => {
        const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
        const visual = box('.hero-visual'), description = box('.hero-description'), heading = box('.hero-heading'), actions = box('.hero-actions');
        return { visualTop: visual.top, visualBottom: visual.bottom, visualLeft: visual.left, descriptionTop: description.top, actionsTop: actions.top, actionsBottom: actions.bottom, headingLeft: heading.left, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      expect(geometry.overflow).toBe(false);
      if (width < 1024) {
        expect(geometry.actionsTop).toBeLessThan(650);
        expect(geometry.visualTop).toBeGreaterThanOrEqual(geometry.actionsBottom);
      } else expect(geometry.visualLeft).toBeGreaterThan(geometry.headingLeft);
    }
    // Mobile DOM order follows the visible CTA and then the media controls.
    await page.setViewportSize({ width: 390, height: 900 });
    const expand = page.locator('#hero-product-outcome').getByRole('button', { name: /Apri il video completo|Open full video/ });
    // WebKit's native Tab preference can omit links. DOM sequence must still
    // match the visual sequence, without positive tabindex overrides.
    expect(await expand.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('.hero-actions a')!) & Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
    if (browserName === 'chromium') {
      await page.locator('.hero-actions a').last().focus();
      await page.keyboard.press('Tab');
      await expect(page.locator('#hero-product-outcome').getByRole('button', { name: /Riproduci:|Pausa:|Play:|Pause:/ })).toBeFocused();
    }
  });
}
