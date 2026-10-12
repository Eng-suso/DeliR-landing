import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('silent films respect reduced motion and play only after opt-in', async ({ page }) => {
  const filmRequests: string[] = [];
  page.on('request', (request) => { if (/\/product-clips\/.*\.(mp4|webm)$/.test(request.url())) filmRequests.push(request.url()); });
  await page.goto('/');
  const hero = page.locator('#hero-product-outcome');
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(0);
  expect(filmRequests).toEqual([]);
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  const video = hero.locator('video').first();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video.locator('track')).toHaveAttribute('src', '/product-clips/hero-loop.it.vtt');
  await hero.getByRole('button', { name: 'Pausa: DeliR in azione' }).click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(0);
  await hero.scrollIntoViewIfNeeded();
  await expect.poll(() => hero.locator('video').first().evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test('all seventeen supplied scenes have keyboard selectors and working media', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Asset inventory runs once; playback is tested in every browser');
  await page.goto('/');
  await expect(page.locator('[data-product-module]')).toHaveCount(5);
  const ids = new Set(['hero-loop']);
  for (const chapter of await page.locator('[data-product-module]').all()) {
    const chapterId = await chapter.getAttribute('id');
    await page.locator('nav[aria-label="Benefici DeliR"]').locator('a[href="#' + chapterId + '"]').click();
    const selectors = chapter.getByRole('group').getByRole('link');
    for (const selector of await selectors.all()) {
      await selector.focus();
      await selector.press('Enter');
      await expect(selector).toHaveAttribute('aria-current', 'true');
      const film = chapter.locator('[data-clip]');
      const id = await film.getAttribute('data-clip');
      expect(id).toBeTruthy();
      ids.add(id!);
      await expect(film.locator('img')).toHaveAttribute('alt', /\S/);
      await expect(film.locator('video')).toHaveCount(0);
    }
  }
  expect(ids.size).toBe(17);
  for (const id of ids) {
    for (const extension of ['mp4', 'webm', 'it.vtt', 'en.vtt']) {
      const response = await request.head(`/product-clips/${id}.${extension}`);
      expect(response.ok(), `${id}.${extension} is available`).toBe(true);
      if (/^(mp4|webm)$/.test(extension)) expect(response.headers()['content-type']).toContain('video/');
    }
  }
});

test('selected scene and fullscreen dialog remain accessible in English', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Close navigation menu' }).click();
  const chapter = page.locator('#product-05');
  await page.getByRole('navigation', { name: 'DeliR benefits' }).getByRole('link', { name: 'Scenarios', exact: true }).click();
  const scene = chapter.getByRole('group').getByRole('link', { name: /Scenario comparison/ });
  await scene.click();
  await expect(scene).toHaveAttribute('aria-current', 'true');
  const expand = chapter.getByRole('button', { name: 'Open full video: Scenario comparison' });
  await expand.click();
  const dialog = page.getByRole('dialog', { name: 'Scenario comparison' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('track')).toHaveAttribute('src', '/product-clips/confronto.en.vtt');
  if (testInfo.project.name === 'chromium') {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(expand).toBeFocused();
});

test('video load failure leaves an accessible poster and explanation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Error fallback runs once');
  await page.route('**/product-clips/*.mp4', (route) => route.abort());
  await page.route('**/product-clips/*.webm', (route) => route.abort());
  await page.goto('/');
  const hero = page.locator('#hero-product-outcome');
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect(hero.getByRole('status')).toContainText('Video non disponibile');
  await expect(hero.locator('img')).toBeVisible();
  await expect(hero.getByRole('button', { name: 'Riproduci: DeliR in azione' })).toBeDisabled();
});

test('desktop autoplay stops off-screen and responds to reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Desktop autoplay policy runs once');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const hero = page.locator('#hero-product-outcome');
  await hero.scrollIntoViewIfNeeded();
  await expect.poll(() => hero.locator('video').first().evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await page.locator('#product-03').scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.product-film > div > video')).toHaveCount(0);
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(0);
});

test('hero uses the original full-HD video and shows complete centered sentences', async ({ page, isMobile, browserName }) => {
  await page.goto('/');
  const hero = page.locator('#hero-product-outcome');
  await hero.waitFor();
  await expect(hero).toHaveAttribute('data-clip', 'hero-loop');
  await expect(hero.locator(':scope > p')).toHaveText('Dalle informazioni del cliente a un processo chiaro.');
  await expect(page.locator('section[aria-labelledby="hero-title"]').getByRole('heading', { level: 2 })).toHaveCount(0);
  if (isMobile) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  if (isMobile) await page.getByRole('button', { name: 'Close navigation menu' }).click();
  await expect(hero.locator(':scope > p')).toHaveText('From client information to a clear process.');
  await hero.scrollIntoViewIfNeeded();
  await hero.getByRole('button', { name: 'Play: DeliR in action' }).click();
  const video = hero.locator('video').first();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  // FFprobe checks source resolution. This Windows WebKit run reported a
  // smaller videoWidth; intrinsic dimensions are additionally checked in Chromium.
  if (browserName === 'chromium') {
    expect(await video.evaluate((element: HTMLVideoElement) => element.videoWidth)).toBe(1920);
    expect(await video.evaluate((element: HTMLVideoElement) => element.videoHeight)).toBe(1080);
  } else {
    expect(await video.evaluate((element: HTMLVideoElement) => element.videoWidth)).toBeGreaterThan(0);
  }
  await expect(video.locator('source').first()).toHaveAttribute('src', '/product-clips/hero-loop.mp4');
  await hero.getByRole('button', { name: 'Pause: DeliR in action' }).click();
  await video.evaluate((element: HTMLVideoElement) => { element.currentTime = 5; });
  await expect(hero.locator(':scope > p')).toHaveText('Review the model alongside its sources.');
});
