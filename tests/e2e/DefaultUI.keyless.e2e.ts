import { expect, test } from '@playwright/test';

test.describe('Public web default UI', () => {
  test('renders the responsive web foundation and public health boundary', async ({
    page,
    request,
  }, testInfo) => {
    const response = await page.goto('/');

    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Build useful websites people can discover.',
      }),
    ).toBeVisible();
    await expect(page.getByText('Web foundation manifest')).toBeVisible();
    await expect(page.locator('.module-list > li')).toHaveCount(3);
    await expect(page.getByRole('link', { name: 'Inspect content feed' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Check runtime' })).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(0);

    const health = await request.get('/api/health');
    expect(health.ok()).toBe(true);
    await expect(health.json()).resolves.toEqual({
      status: 'ok',
      service: 'web-starter',
    });

    await page.screenshot({
      path: testInfo.outputPath('default-ui.png'),
      fullPage: true,
    });
  });

  test('renders the localized public route without provider credentials', async ({ page }) => {
    const response = await page.goto('/fr');
    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByText('Web foundation manifest')).toBeVisible();
  });
});
