import { expect, test } from '@playwright/test';

test.describe('StealthRDP v2 public UI', () => {
  test('renders the responsive homepage and public health boundary', async ({ page, request }, testInfo) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: /Your server/ })).toBeVisible();
    await expect(page.getByText('Plans priced for the work')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Client Area' })).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(0);

    const health = await request.get('/api/health');
    expect(health.ok()).toBe(true);
    await expect(health.json()).resolves.toEqual({
      status: 'ok',
      service: 'stealthrdp-v2',
    });

    await page.screenshot({
      path: testInfo.outputPath('default-ui.png'),
      fullPage: true,
    });
  });

  test('preserves a legacy .html blog article route through proxy routing', async ({ page }) => {
    const response = await page.goto('/blog/top-6-vps-management-tools-for-small-businesses.html');
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('VPS');
  });

  test('renders a core commercial route without provider credentials', async ({ page }) => {
    const response = await page.goto('/plans');
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: /Pick the resources/ })).toBeVisible();
    await expect(page.getByText('Bronze USA')).toBeVisible();
  });
});