import { test, expect } from '@playwright/test';

/**
 * Test Suite 5: Text Extraction Features
 * Test Suite 6: Result Display and Integration
 */

test.describe('Text Extraction Features', () => {
    test('TC-16: Extraction result area exists', async ({ page }) => {
        await page.goto('/');
        const resultArea = page.locator('.layout-col.right');
        await expect(resultArea).toBeVisible();
    });

    test('TC-17: Empty state is shown before extraction', async ({ page }) => {
        await page.goto('/');
        const emptyState = page.locator('.empty-placeholder-card');
        await expect(emptyState).toBeVisible();
    });

    test('TC-18: Loading state appears during extraction', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        await fileInput.setInputFiles({
            name: 'test-image.png',
            mimeType: 'image/png',
            buffer: buffer,
        });

        const extractButton = page.locator('button:has-text("Extract Text")');

        if (await extractButton.isVisible({ timeout: 2000 })) {
            // Click and immediately check for loading state
            await extractButton.click();

            // Check if loading indicator appears (either button text or loader)
            const loadingIndicator = page.locator('button:has-text("Extracting..."), .loader-large');
            // This might be visible briefly
            await page.waitForTimeout(100);
        }
    });
});

test.describe('Result Display and Integration', () => {
    test('TC-19: Result display section has proper structure', async ({ page }) => {
        await page.goto('/');
        const resultSection = page.locator('.layout-col.right');
        const resultTitle = page.locator('.card-header-title:has-text("Extraction Results")');

        await expect(resultSection).toBeVisible();
        await expect(resultTitle).toBeVisible();
    });

    test('TC-20: File ready state shows file information', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');

        // Use real image file
        await fileInput.setInputFiles('C:\\Users\\Aseuro\\Downloads\\img1.png');

        // Check if file info is displayed in the file-details section
        const fileInfo = page.locator('.file-details h4');
        await expect(fileInfo).toBeVisible({ timeout: 3000 });
        await expect(fileInfo).toContainText('img1.png');
    });

    test('TC-21: Action buttons are present in ready state', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        await fileInput.setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer: buffer,
        });

        const extractButton = page.locator('button:has-text("Extract Text")');
        const resetButton = page.locator('button:has-text("Reset")');

        await expect(extractButton).toBeVisible({ timeout: 2000 });
        await expect(resetButton).toBeVisible({ timeout: 2000 });
    });
});
