import { expect, takeSnapshot, test } from '@chromatic-com/playwright';

test.describe('Foundation visual testing', () => {
  test('captures the foundation homepage', async ({ page }, testInfo) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Make the next product feel like it belongs to us.',
      }),
    ).toBeVisible();

    await takeSnapshot(page, testInfo);
  });

  test('captures the localized foundation route', async ({ page }, testInfo) => {
    await page.goto('/fr');

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByText('Foundation manifest')).toBeVisible();

    await takeSnapshot(page, testInfo);
  });
});
