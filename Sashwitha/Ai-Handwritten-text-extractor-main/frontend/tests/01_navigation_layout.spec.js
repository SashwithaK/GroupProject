import { test, expect } from '@playwright/test';

test.describe('Navigation & Layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('01. Should have correct page title', async ({ page }) => {
        await expect(page).toHaveTitle(/DataExtract AI \| Intelligent Processing/);
    });

    test('02. Should display main header', async ({ page }) => {
        const header = page.locator('.main-header');
        await expect(header).toBeVisible();
    });

    test('03. Should display application logo', async ({ page }) => {
        const logo = page.locator('.app-logo');
        await expect(logo).toBeVisible();
    });

    test('04. Should show "Upload & Extract" tab as active by default', async ({ page }) => {
        const tab = page.locator('button.nav-tab', { hasText: 'Upload & Extract' });
        await expect(tab).toHaveClass(/active/);
    });

    test('05. Should switch to "Database Manager" tab', async ({ page }) => {
        const tab = page.locator('button.nav-tab', { hasText: 'Database Manager' });
        await tab.click();
        await expect(tab).toHaveClass(/active/);
    });

    test('06. Should show correct header subtitle', async ({ page }) => {
        const subtitle = page.locator('.header-subtitle');
        await expect(subtitle).toContainText('Enterprise-Grade AI-Powered OCR System');
    });

    test('07. Should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const header = page.locator('.main-header');
        await expect(header).toBeVisible();
    });

    test('08. Should be responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        const container = page.locator('.app-container');
        await expect(container).toBeVisible();
    });

    test('09. Should have correct meta description', async ({ page }) => {
        const meta = page.locator('meta[name="viewport"]');
        await expect(meta).toHaveAttribute('content', /width=device-width/);
    });
});
