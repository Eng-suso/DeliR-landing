import { expect, test } from '@playwright/test';

test('a reveal retries blocked autoplay without overriding an explicit pause', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'The deterministic autoplay-policy fixture runs once.');
  await page.setViewportSize({ width: 375, height: 600 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const probe = { blocked: 0 };
    Object.defineProperty(window, '__delirAutoplayProbe', { value: probe });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      const reveal = this.closest('.hero-visual');
      if (reveal && Number(getComputedStyle(reveal).opacity) < .99) {
        probe.blocked++;
        this.pause();
        return Promise.reject(new DOMException('Autoplay requires a visible parent', 'NotAllowedError'));
      }
      return play.call(this);
    };
  });
  await page.goto('/');
  await expect(page.locator('.hero-visual')).toHaveCSS('opacity', '0');
  const film = page.locator('#hero-product-outcome');
  await film.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => (window as Window & { __delirAutoplayProbe: { blocked: number } }).__delirAutoplayProbe.blocked)).toBeGreaterThan(0);
  const video = film.locator(':scope > div > video');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await film.getByRole('button', { name: 'Pausa: DeliR in azione' }).click();
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await film.scrollIntoViewIfNeeded();
  await expect(page.locator('.hero-visual')).toHaveCSS('opacity', '1');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});
