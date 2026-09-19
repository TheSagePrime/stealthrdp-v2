import { expect, test } from '@playwright/test';

test.describe('I18n routing', () => {
  test('uses English on the default route', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('uses French on the localized route', async ({ page }) => {
    await page.goto('/fr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });
});
