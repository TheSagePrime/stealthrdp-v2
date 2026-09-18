import { expect, test } from '@playwright/test';

test.describe('Foundation sanity', () => {
  test('renders the Sage Prime foundation surface', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Make the next product feel like it belongs to us.',
      }),
    ).toBeVisible();
    await expect(page.getByText('Foundation manifest')).toBeVisible();
  });
});
