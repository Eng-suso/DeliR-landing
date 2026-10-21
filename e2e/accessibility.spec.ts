import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/pilot', '/waitlist', '/security-data', '/security-data?lang=en', '/comparison-sources', '/comparison-sources?lang=en']) {
  test(`${path} has no automatic WCAG A/AA violations`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe is run once in Chromium; browser rendering is covered separately');
    await page.goto(path);
    await page.getByRole('heading', { level: 1 }).waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
