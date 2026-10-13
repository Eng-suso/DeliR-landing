import { expect, test } from '@playwright/test';

const approved = {
  it: 'Smetti di passare settimane a ricostruire come lavora davvero il tuo cliente. DeliR trasforma la conoscenza dispersa in un As-Is verificato, confronta scenari To-Be e migliora continuamente i processi, così puoi fornire raccomandazioni migliori più rapidamente.',
  en: 'Stop spending weeks reconstructing how your client really works. DeliR turns scattered knowledge into a verified As-Is, compares To-Be scenarios, and continuously improves processes so you deliver better recommendations faster.',
};

for (const language of ['it', 'en'] as const) {
  test(`hero preserves approved copy and readable product order (${language})`, async ({ page, browserName }) => {
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/?lang=${language}`);
      await page.locator('.landing-page[data-client-ready="true"]').waitFor();
      await expect(page.locator('.hero-description')).toHaveText(approved[language]);
      await expect(page.locator('.hero-description')).toBeVisible();
      const geometry = await page.evaluate(() => {
        const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
        const visual = box('.hero-visual'), description = box('.hero-description'), heading = box('.hero-heading');
        return { visualTop: visual.top, visualBottom: visual.bottom, visualLeft: visual.left, descriptionTop: description.top, headingLeft: heading.left, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      expect(geometry.overflow).toBe(false);
      if (width < 1024) {
        expect(geometry.visualTop).toBeLessThan(600);
        expect(geometry.descriptionTop).toBeGreaterThanOrEqual(geometry.visualBottom);
      } else expect(geometry.visualLeft).toBeGreaterThan(geometry.headingLeft);
    }
    // Mobile DOM order follows the visible media controls and then the CTA.
    await page.setViewportSize({ width: 390, height: 900 });
    const expand = page.locator('#hero-product-outcome').getByRole('button', { name: /Apri il video completo|Open full video/ });
    // WebKit's native Tab preference can omit links. DOM sequence must still
    // match the visual sequence, without positive tabindex overrides.
    expect(await expand.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('.hero-actions a')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    if (browserName === 'chromium') {
      await expand.focus();
      await page.keyboard.press('Tab');
      await expect(page.locator('.hero-actions a').first()).toBeFocused();
    }
  });
}
