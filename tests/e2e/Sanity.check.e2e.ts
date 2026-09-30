import { expect, test } from '@playwright/test';

test.describe('StealthRDP v2 sanity', () => {
  test('renders the StealthRDP homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /Your server/ })).toBeVisible();
    await expect(page.getByText('Infrastructure that doesn’t flinch')).toBeVisible();
  });
});