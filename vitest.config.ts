import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.{js,jsx,ts,tsx}'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{js,ts}'],
          exclude: ['src/hooks/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'ui',
          include: ['**/*.test.tsx', 'src/hooks/**/*.test.tsx'],
          exclude: ['**/*.visual.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            screenshotDirectory: 'vitest-test-results',
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'visual',
          include: ['**/*.visual.test.tsx'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: { width: 1024, height: 900 },
            expect: {
              toMatchScreenshot: {
                comparatorName: 'pixelmatch',
                comparatorOptions: {
                  threshold: 0.2,
                  allowedMismatchedPixelRatio: 0.005,
                },
              },
            },
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
    reporters: [
      'default',
      // conditional reporter
      process.env.CI ? 'github-actions' : {},
    ],
    env: {
      ...loadEnv('', process.cwd(), ''), // Expose .env variables to Node.js
    },
  },
  define: {
    'process.env': JSON.stringify(loadEnv('', process.cwd(), 'NEXT_PUBLIC_')), // Expose .env variables to browser
  },
});
