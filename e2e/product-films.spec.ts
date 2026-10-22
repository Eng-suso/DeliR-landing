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
  await expect(video.locator('track')).toHaveAttribute('src', '/product-clips/hero-loop-v2.it.vtt');
  await hero.getByRole('button', { name: 'Pausa: DeliR in azione' }).click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await expect(hero.locator('video')).toHaveCount(1);
  await hero.scrollIntoViewIfNeeded();
  await expect.poll(() => hero.locator('video').first().evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test('all seven product videos have posters, captions and working media', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Asset inventory runs once; playback is tested in every browser');
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  for (const id of ['problem', 'agitate', 'discovery', 'evidence', 'simulation', 'results', 'walkthrough']) {
    for (const extension of ['mp4', 'webm', 'jpg', 'it.vtt', 'en.vtt']) {
      const response = await request.head(`/product-videos/${id}.${extension}`);
      expect(response.ok(), `${id}.${extension} is available`).toBe(true);
      if (/^(mp4|webm)$/.test(extension)) expect(response.headers()['content-type']).toContain('video/');
    }
  }
});

test('product videos load only on request and remain accessible in English', async ({ page }, testInfo) => {
  const videoRequests: string[] = [];
  page.on('request', (request) => { if (/\/product-videos\/.*\.(mp4|webm)$/.test(request.url())) videoRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Apri il menu' }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  if (testInfo.project.name.includes('mobile')) await page.getByRole('button', { name: 'Close navigation menu' }).click();
  await page.locator('#caso').scrollIntoViewIfNeeded();
  await page.getByRole('tab', { name: /Analysis & Simulation/ }).click();
  expect(videoRequests).toEqual([]);
  const panel = page.getByRole('tabpanel');
  await panel.getByRole('button', { name: /Play: Analysis & Simulation/ }).click();
  const inline = panel.locator('video');
  await expect.poll(() => inline.evaluate((video: HTMLVideoElement) => video.currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
  await expect(inline.locator('track')).toHaveAttribute('src', '/product-videos/simulation.en.vtt');
  await inline.evaluate((video: HTMLVideoElement) => video.pause());
  await expect(page.locator('#caso [data-product-video="walkthrough"]')).toHaveCount(0);
  if (testInfo.project.name === 'chromium') {
    const results = await new AxeBuilder({ page }).include('#caso').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  }
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
  await page.locator('#caso').scrollIntoViewIfNeeded();
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

test('hero uses the original full-HD video and shows complete centered sentences', async ({ page, isMobile, browserName }) => {
  await page.goto('/');
  await expect(page.locator('.landing-page[data-client-ready="true"]')).toBeVisible();
  const hero = page.locator('#hero-product-outcome');
  await hero.waitFor();
  await expect(hero).toHaveAttribute('data-clip', 'hero-loop');
  await expect(hero.locator(':scope > p')).toHaveText('Dalle informazioni del cliente a un processo chiaro.');
  await expect(page.locator('section[aria-labelledby="hero-title"]').getByRole('heading', { level: 2 })).toHaveCount(0);
  await hero.scrollIntoViewIfNeeded();
  await hero.getByRole('button', { name: 'Riproduci: DeliR in azione' }).click();
  await expect.poll(() => hero.locator('video').first().evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain('/product-clips/hero-loop-v2.it.mp4');
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
  await expect(video.locator('source')).toHaveCount(1);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain('/product-clips/hero-loop-v2.en.mp4');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.duration)).toBe(25);
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
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain(`/product-clips/hero-loop-v2.${language}.mp4`);
    await expect(video.locator('track')).toHaveAttribute('src', `/product-clips/hero-loop-v2.${language}.vtt`);
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
