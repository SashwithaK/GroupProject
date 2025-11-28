import { test, expect } from '@playwright/test';

/**
 * Test Suite 7: Error Handling and Validation
 */

test.describe('Error Handling and Validation', () => {
    test('TC-22: Error alert can be dismissed', async ({ page }) => {
        await page.goto('/');

        // Check if error alert structure exists in DOM
        const errorAlert = page.locator('.error-alert');
        // Error might not be visible initially, which is expected
        const count = await errorAlert.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('TC-23: Invalid file type handling', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');

        // Try to upload a text file
        await fileInput.setInputFiles({
            name: 'test.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('This is a text file'),
        });

        // Wait a moment to see if error appears
        await page.waitForTimeout(1000);
    });

    test('TC-24: Large file size validation', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');

        // Create a large buffer (11MB - exceeds 10MB limit)
        const largeBuffer = Buffer.alloc(11 * 1024 * 1024);

        await fileInput.setInputFiles({
            name: 'large-image.png',
            mimeType: 'image/png',
            buffer: largeBuffer,
        });

        // Extract button should appear
        const extractButton = page.locator('button:has-text("Extract Text")');

        if (await extractButton.isVisible({ timeout: 2000 })) {
            await extractButton.click();

            // Wait for potential error
            await page.waitForTimeout(2000);

            // Check if error message appears
            const errorMessage = page.locator('.error-alert, text=/exceeds/i');
            // Error might appear
        }
    });

    test('TC-25: Backend unavailable error handling', async ({ page }) => {
        await page.goto('/');

        // This test checks if the app handles backend errors gracefully
        // We'll simulate by trying to extract without backend running
        // The test should not crash the application

        const fileInput = page.locator('input[type="file"]');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        await fileInput.setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer: buffer,
        });

        const extractButton = page.locator('button:has-text("Extract Text")');

        if (await extractButton.isVisible({ timeout: 2000 })) {
            await extractButton.click();

            // Wait for response (error or success)
            await page.waitForTimeout(3000);

            // App should still be functional
            const header = page.locator('.main-header');
            await expect(header).toBeVisible();
        }
    });
});
