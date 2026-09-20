import { expect, takeSnapshot, test } from '@chromatic-com/playwright';

test.describe('Web foundation visual testing', () => {
  test('captures the public foundation homepage', async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Build useful websites people can discover.',
      }),
    ).toBeVisible();
    await takeSnapshot(page, testInfo);
  });

  test('captures the localized foundation route', async ({ page }, testInfo) => {
    await page.goto('/fr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByText('Web foundation manifest')).toBeVisible();
    await takeSnapshot(page, testInfo);
  });
});
