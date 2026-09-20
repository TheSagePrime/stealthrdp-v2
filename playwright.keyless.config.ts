import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ?? '3008';
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '*.keyless.e2e.ts',
  timeout: 30 * 1000,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  expect: { timeout: 15 * 1000 },
  webServer: {
    command: process.env.CI
      ? "pglite-server -m 100 --run 'run-s db:migrate start'"
      : "pglite-server -m 100 --run 'run-s db:migrate dev:next'",
    url: baseURL,
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 2 * 1000 },
    env: {
      BROWSER_TO_TERMINAL_ENABLED: 'false',
      NEXT_PUBLIC_SENTRY_ENABLED: 'false',
      NEXT_PUBLIC_APP_URL: baseURL,
      PORT,
    },
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
