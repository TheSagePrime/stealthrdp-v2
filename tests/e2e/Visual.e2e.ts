import { expect, takeSnapshot, test } from '@chromatic-com/playwright';

test.describe('StealthRDP v2 visual testing', () => {
  test('captures the homepage', async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /Your server/ })).toBeVisible();
    await takeSnapshot(page, testInfo);
  });

  test('captures the plans page', async ({ page }, testInfo) => {
    await page.goto('/plans');
    await expect(page.getByRole('heading', { level: 1, name: /Pick the resources/ })).toBeVisible();
    await takeSnapshot(page, testInfo);
  });
});