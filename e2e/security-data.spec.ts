import { expect, test } from '@playwright/test';

for (const language of ['it', 'en'] as const) {
  test(`${language}: trust section leads to data details without sharing client files`, async ({ page }) => {
    const it = language === 'it';
    await page.goto(`/?lang=${language}`);
    await page.locator('.landing-page[data-client-ready="true"]').waitFor();
    const trust = page.locator('#fiducia');
    await trust.scrollIntoViewIfNeeded();
    await expect(trust.getByRole('heading', { level: 2 })).toHaveText(it ? 'Il contesto del tuo cliente merita regole chiare.' : 'Your client’s context deserves clear rules.');
    const detailLink = trust.getByRole('link', { name: it ? 'Approfondisci sicurezza e dati' : 'Explore Security & Data' });
    await detailLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/security-data${it ? '$' : '\\?lang=en$'}`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(it ? 'Sicurezza e dati' : 'Security & Data');
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('main dl > div')).toHaveCount(8);
    await expect(page.getByText(it ? 'Non è ancora confermato dove verranno gestiti i dati dei pilot.' : 'Where pilot data will be handled has not been confirmed yet.', { exact: false })).toBeVisible();
    await expect(page.getByRole('form')).toHaveCount(0);
    await expect(page.getByRole('link', { name: it ? 'Parliamo dei requisiti del tuo cliente' : 'Discuss your client’s requirements', exact: true })).toHaveAttribute('href', /^mailto:/);
    await page.getByRole('link', { name: it ? 'Leggi privacy e cookie' : 'Read privacy and cookies', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/privacy${it ? '$' : '\\?lang=en$'}`));
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await page.goBack();
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(it ? 'Sicurezza e dati' : 'Security & Data');
    await page.getByRole('link', { name: it ? 'Vai al contenuto' : 'Skip to content', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
}
