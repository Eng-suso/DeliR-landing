import { defineConfig, devices } from '@playwright/test';
const testOrigin = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const testPort = new URL(testOrigin).port || '4173';
const fixtureDirectory = process.env.PLAYWRIGHT_INTEREST_FIXTURE === 'true' ? 'dist-interest' : 'dist';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: testOrigin,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    reducedMotion: 'reduce',
    // General product checks use an explicit rejection, never grant analytics.
    // Privacy tests override this to exercise the first-visit banner.
    storageState: { cookies: [], origins: [{ origin: testOrigin, localStorage: [{
      name: 'delir-consent-v1', value: JSON.stringify({ version: 1, analytics: false, savedAt: Date.now(), expiresAt: Date.now() + 180 * 86400000 }),
    }] }] },
  },
  webServer: {
    command: `node node_modules/vite/bin/vite.js preview --configLoader runner --outDir ${fixtureDirectory} --host 127.0.0.1 --port ${testPort} --strictPort`,
    url: testOrigin,
    reuseExistingServer: !process.env.CI && !process.env.PLAYWRIGHT_BASE_URL,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
});
