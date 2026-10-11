import { expect, test } from '@playwright/test';

test('initial HTML contains translated content, metadata and evidence-based FAQ', async ({ request }) => {
  for (const language of ['it', 'en']) {
    const response = await request.get(`/seo/home.${language}.html`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<html lang="${language}">`);
    expect(html).not.toContain('<div id="root"></div>');
    expect(html).not.toMatch(/ style="/);
    expect(html).toContain(`href="https://delir.it/${language === 'en' ? '?lang=en' : ''}"`);
    const json = html.match(/<script id="delir-structured-data" type="application\/ld\+json">(.*?)<\/script>/)?.[1];
    expect(json).toBeTruthy();
    const faq = JSON.parse(json!)['@graph'].find((item: { '@type': string }) => item['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(10);
    for (const question of faq.mainEntity) expect(html).toContain(question.name.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;'));
  }
});

test('without JavaScript, content remains readable and forms cannot leak data through GET', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/seo/home.it.html`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#faq-panel-9')).toBeVisible();
    await page.goto(`${baseURL}/seo/pilot.en.html`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('form')).toBeHidden();
    await expect(page.locator('noscript a[href="mailto:contact@delir.it"]')).toBeVisible();
  } finally {
    await context.close();
  }
});
