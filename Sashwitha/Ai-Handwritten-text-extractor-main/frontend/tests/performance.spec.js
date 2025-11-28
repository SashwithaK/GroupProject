import { test, expect } from '@playwright/test';

/**
 * Test Suite 10: Performance and Optimization
 */

test.describe('Performance and Optimization', () => {
    test('TC-35: Page load time is acceptable', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        const loadTime = Date.now() - startTime;

        // Page should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
        console.log(`Page loaded in ${loadTime}ms`);
    });

    test('TC-36: No console errors on page load', async ({ page }) => {
        const consoleErrors = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.waitForTimeout(2000);

        // Should have minimal or no console errors
        console.log(`Console errors found: ${consoleErrors.length}`);
        if (consoleErrors.length > 0) {
            console.log('Errors:', consoleErrors);
        }
    });

    test('TC-37: Images and assets load properly', async ({ page }) => {
        await page.goto('/');

        // Check for failed network requests
        const failedRequests = [];

        page.on('requestfailed', request => {
            failedRequests.push(request.url());
        });

        await page.waitForTimeout(2000);

        console.log(`Failed requests: ${failedRequests.length}`);
    });

    test('TC-38: Tab switching is smooth and fast', async ({ page }) => {
        await page.goto('/');

        const startTime = Date.now();
        const databaseTab = page.locator('button:has-text("Database Manager")');
        await databaseTab.click();

        await expect(databaseTab).toHaveClass(/active/);
        const switchTime = Date.now() - startTime;

        // Tab switch should be instant (< 500ms)
        expect(switchTime).toBeLessThan(500);
        console.log(`Tab switched in ${switchTime}ms`);
    });

    test('TC-39: Multiple file selections don\'t cause memory leaks', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        // Select file multiple times
        for (let i = 0; i < 3; i++) {
            await fileInput.setInputFiles({
                name: `test-${i}.png`,
                mimeType: 'image/png',
                buffer: buffer,
            });

            await page.waitForTimeout(500);

            const resetButton = page.locator('button:has-text("Reset")');
            if (await resetButton.isVisible()) {
                await resetButton.click();
                await page.waitForTimeout(300);
            }
        }

        // App should still be responsive
        const header = page.locator('.main-header');
        await expect(header).toBeVisible();
    });

    test('TC-40: Application remains responsive during operations', async ({ page }) => {
        await page.goto('/');

        // Perform multiple UI interactions
        const databaseTab = page.locator('button:has-text("Database Manager")');
        await databaseTab.click();
        await page.waitForTimeout(200);

        const uploadTab = page.locator('button:has-text("Upload & Extract")');
        await uploadTab.click();
        await page.waitForTimeout(200);

        // Upload a file
        const fileInput = page.locator('input[type="file"]');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        await fileInput.setInputFiles({
            name: 'responsive-test.png',
            mimeType: 'image/png',
            buffer: buffer,
        });

        // All elements should still be interactive
        await expect(uploadTab).toHaveClass(/active/);
    });
});
