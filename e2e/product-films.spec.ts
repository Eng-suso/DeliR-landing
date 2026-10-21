import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('silent films respect reduced motion and play only after opt-in', async ({ page }) => {
  const filmRequests: string[] = [];
  page.on('request', (request) => { if (/\/product-clips\/.*\.(mp4|webm)$/.test(request.url())) filmRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const hero = page.locator('#hero-product-outcome');
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(0);
  expect(filmRequests).toEqual([]);
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  const video = hero.locator('video').first();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video.locator('track')).toHaveAttribute('src', '/product-clips/v3/hero.it.vtt');
  await hero.getByRole('button', { name: 'Pausa: DeliR in azione' }).click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(1);
  await hero.scrollIntoViewIfNeeded();
  await expect.poll(() => hero.locator('video').first().evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test('every benefit has one localized recording with working media', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Asset inventory runs once; playback is tested in every browser');
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await expect(page.locator('[data-product-module]')).toHaveCount(5);
  await page.locator('.hybrid-more > summary').click();
  const ids = new Set(['hero']);
  for (const chapter of await page.locator('[data-product-module]').all()) {
    await chapter.scrollIntoViewIfNeeded();
    // One recording per benefit: no scene selector.
    await expect(chapter.getByRole('group')).toHaveCount(0);
    const film = chapter.locator('[data-clip]');
    await expect(film).toHaveCount(1);
    const id = await film.getAttribute('data-clip');
    expect(id).toBeTruthy();
    ids.add(id!);
    await expect(film.locator('img')).toHaveAttribute('alt', /\S/);
  }
  expect([...ids].sort()).toEqual(['contesto', 'decisioni', 'evidenze', 'hero', 'lacune', 'scenari']);
  for (const id of ids) {
    for (const file of ['it.mp4', 'en.mp4', 'it.vtt', 'en.vtt'].map(extension => `${id}.${extension}`)) {
      const response = await request.head(`/product-clips/v3/${file}`);
      expect(response.ok(), `${file} is available`).toBe(true);
      if (file.endsWith('.mp4')) expect(response.headers()['content-type']).toContain('video/');
    }
  }
});

test('selected scene and fullscreen dialog remain accessible in English', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Close navigation menu' }).click();
  const chapter = page.locator('#product-05');
  await page.getByRole('navigation', { name: 'Product chapters' }).getByRole('link', { name: 'Scenarios', exact: true }).click();
  const expand = chapter.getByRole('button', { name: 'Open full video: Simulation and scenarios' });
  await expand.click();
  const dialog = page.getByRole('dialog', { name: 'Simulation and scenarios' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('track')).toHaveAttribute('src', '/product-clips/v3/scenari.en.vtt');
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
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const hero = page.locator('#hero-product-outcome');
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect(hero.getByRole('status')).toContainText('Video non disponibile');
  await expect(hero.locator('img')).toBeVisible();
  await expect(hero.getByRole('button', { name: 'Riproduci: DeliR in azione' })).toBeDisabled();
});

test('desktop autoplay retains visited clips and responds to reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Desktop autoplay policy runs once');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const hero = page.locator('#hero-product-outcome');
  await hero.scrollIntoViewIfNeeded();
  await expect.poll(() => hero.locator('video').first().evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await page.locator('#product-03').scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.product-film > div > video')).toHaveCount(0);
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(0);
});

test('visible films and their full-video dialog autoplay on desktop and mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  await expect(page.locator('.landing-page')).toHaveAttribute('data-motion', 'full');
  const hero = page.locator('#hero-product-outcome');
  await hero.scrollIntoViewIfNeeded();
  const inlineVideo = hero.locator(':scope > div > video');
  await expect.poll(() => inlineVideo.evaluate((video: HTMLVideoElement) => video.currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
  expect(await inlineVideo.evaluate((video: HTMLVideoElement) => video.muted && video.playsInline)).toBe(true);
  await hero.getByRole('button', { name: 'Pausa: DeliR in azione' }).click();
  await expect.poll(() => inlineVideo.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await hero.getByRole('button', { name: 'Apri il video completo: DeliR in azione' }).click();
  const dialog = page.getByRole('dialog', { name: 'DeliR in azione' });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect.poll(() => inlineVideo.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

test('a newly reached benefit starts its film without pressing play', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#product-03');
  await expect(page.locator('.landing-page')).toHaveAttribute('data-motion', 'full');
  const firstFilm = page.locator('#product-03 .product-film');
  await firstFilm.scrollIntoViewIfNeeded();
  await expect.poll(() => firstFilm.locator(':scope > div > video').evaluate((video: HTMLVideoElement) => video.currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
  await page.getByRole('navigation', { name: 'Capitoli del prodotto' }).getByRole('link', { name: /Lacune/ }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('lenis-scrolling'))).toBe(false);
  const selected = page.locator('#product-02 [data-clip="lacune"]');
  await selected.scrollIntoViewIfNeeded();
  await expect.poll(() => selected.locator(':scope > div > video').evaluate((video: HTMLVideoElement) => video.currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
});
test('Save-Data keeps visible films opt-in even with motion enabled', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Save-Data policy runs once');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
  });
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const hero = page.locator('#hero-product-outcome');
  await hero.scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(0);
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect.poll(() => hero.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
});

test('hero uses the localized recording and shows complete centered sentences', async ({ page, isMobile, browserName }) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const hero = page.locator('#hero-product-outcome');
  await hero.waitFor();
  await expect(hero).toHaveAttribute('data-clip', 'hero-loop');
  await expect(hero.locator(':scope > p')).toHaveText('Dalle informazioni del cliente a un processo chiaro.');
  await expect(page.locator('section[aria-labelledby="hero-title"]').getByRole('heading', { level: 2 })).toHaveCount(0);
  await hero.scrollIntoViewIfNeeded();
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect.poll(() => hero.locator('video').first().evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain('/product-clips/v3/hero.it.mp4');
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
    expect(await video.evaluate((element: HTMLVideoElement) => element.videoWidth)).toBe(1600);
    expect(await video.evaluate((element: HTMLVideoElement) => element.videoHeight)).toBe(900);
  } else {
    expect(await video.evaluate((element: HTMLVideoElement) => element.videoWidth)).toBeGreaterThan(0);
  }
  await expect(video.locator('source')).toHaveCount(1);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain('/product-clips/v3/hero.en.mp4');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => Math.round(element.duration))).toBe(24);
  await hero.getByRole('button', { name: 'Pause: DeliR in action' }).click();
  await video.evaluate((element: HTMLVideoElement) => { element.currentTime = 6; });
  await expect(hero.locator(':scope > p')).toHaveText('Review the model alongside its sources.');
});

test('direct English entry and language switch select localized posters and full videos', async ({ page, isMobile }) => {
  await page.goto('/?lang=en');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const hero = page.locator('#hero-product-outcome');
  for (const language of ['en', 'it'] as const) {
    const title = language === 'it' ? 'DeliR in azione' : 'DeliR in action';
    const expand = hero.getByRole('button', { name: `${language === 'it' ? 'Apri il video completo' : 'Open full video'}: ${title}` });
    // Language switches replace the film. Wait for the localized instance,
    // rather than the shared BPMN poster on the outgoing one.
    await expect(expand).toBeVisible();
    await expect(hero.locator('img')).toHaveAttribute('alt', /BPMN/);
    await hero.scrollIntoViewIfNeeded();
    // The new recordings already frame each scene; retain the entire image on mobile.
    const framing = await hero.locator('img').evaluate(image => {
      const frame = image.parentElement!.getBoundingClientRect();
      const media = image.getBoundingClientRect();
      return { width: media.width / frame.width, left: media.left - frame.left };
    });
    expect(framing.width).toBeLessThanOrEqual(1);
    expect(framing.left).toBeGreaterThanOrEqual(0);
    await expand.focus();
    await expand.press('Enter');
    const dialog = page.getByRole('dialog', { name: title });
    const video = dialog.locator('video');
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain(`/product-clips/v3/hero.${language}.mp4`);
    await expect(video.locator('track')).toHaveAttribute('src', `/product-clips/v3/hero.${language}.vtt`);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(expand).toBeFocused();
    if (language === 'en') {
      if (isMobile) await page.getByRole('button', { name: 'Open navigation menu' }).click();
      await page.getByRole('button', { name: 'Italiano', exact: true }).click();
      if (isMobile) await page.getByRole('button', { name: 'Chiudi il menu' }).click();
    }
  }
});
