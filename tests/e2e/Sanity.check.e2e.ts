import { expect, test } from '@playwright/test';

test.describe('Web foundation sanity', () => {
  test('renders the public web foundation surface', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Build useful websites people can discover.',
      }),
    ).toBeVisible();
    await expect(page.getByText('Web foundation manifest')).toBeVisible();
  });
});
