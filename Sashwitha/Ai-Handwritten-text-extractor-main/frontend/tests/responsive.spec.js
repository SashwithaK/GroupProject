import { test, expect } from '@playwright/test';

/**
 * Test Suite 9: Responsive Design and Cross-Browser
 */

test.describe('Responsive Design and Cross-Browser', () => {
    test('TC-30: Desktop layout renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');

        const header = page.locator('.main-header');
        await expect(header).toBeVisible();

        const layout = page.locator('.extraction-layout');
        await expect(layout).toBeVisible();
    });

    test('TC-31: Tablet layout is responsive', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        const header = page.locator('.main-header');
        await expect(header).toBeVisible();

        // App should still be functional
        const uploadTab = page.locator('button:has-text("Upload & Extract")');
        await expect(uploadTab).toBeVisible();
    });

    test('TC-32: Mobile layout adapts properly', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        const header = page.locator('.main-header');
        await expect(header).toBeVisible();

        // Navigation should be accessible
        const navContainer = page.locator('.nav-container');
        await expect(navContainer).toBeVisible();
    });

    test('TC-33: Elements are clickable on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        const databaseTab = page.locator('button:has-text("Database Manager")');
        await databaseTab.click();

        await expect(databaseTab).toHaveClass(/active/);
    });

    test('TC-34: Cross-browser compatibility - Layout consistency', async ({ page, browserName }) => {
        await page.goto('/');

        // Test that core elements render in all browsers
        const header = page.locator('.main-header');
        const uploadSection = page.locator('.extraction-layout');

        await expect(header).toBeVisible();
        await expect(uploadSection).toBeVisible();

        console.log(`Test passed on ${browserName}`);
    });
});
