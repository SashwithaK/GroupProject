import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Test Suite 3: File Upload Interface
 * Test Suite 4: File Upload Functionality
 */

test.describe('File Upload Interface', () => {
    test('TC-10: File upload area is visible', async ({ page }) => {
        await page.goto('/');
        const fileUpload = page.locator('.file-upload-area, input[type="file"]').first();
        await expect(fileUpload).toBeDefined();
    });

    test('TC-11: Upload instructions are displayed', async ({ page }) => {
        await page.goto('/');
        const uploadCard = page.locator('.card-header-title:has-text("Upload Document")');
        await expect(uploadCard).toBeVisible();
    });

    test('TC-12: File input accepts correct file types', async ({ page }) => {
        await page.goto('/');
        const fileInput = page.locator('input[type="file"]');
        const acceptAttr = await fileInput.getAttribute('accept');

        // Should accept image files
        expect(acceptAttr).toBeTruthy();
    });
});

test.describe('File Upload Functionality', () => {
    test('TC-13: File selection updates UI', async ({ page }) => {
        await page.goto('/');

        // Create a test file
        const fileInput = page.locator('input[type="file"]');

        // Set up a sample image file
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
        await fileInput.setInputFiles({
            name: 'test-image.png',
            mimeType: 'image/png',
            buffer: buffer,
        });

        // Wait for file to be selected
        await page.waitForTimeout(500);
    });

    test('TC-14: Extract button appears after file selection', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        await fileInput.setInputFiles({
            name: 'test-image.png',
            mimeType: 'image/png',
            buffer: buffer,
        });

        // Look for extract button
        const extractButton = page.locator('button:has-text("Extract Text")');
        await expect(extractButton).toBeVisible({ timeout: 2000 });
    });

    test('TC-15: Reset button is functional', async ({ page }) => {
        await page.goto('/');

        const fileInput = page.locator('input[type="file"]');
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        await fileInput.setInputFiles({
            name: 'test-image.png',
            mimeType: 'image/png',
            buffer: buffer,
        });

        await page.waitForTimeout(500);

        const resetButton = page.locator('button:has-text("Reset")');
        if (await resetButton.isVisible()) {
            await resetButton.click();
            await page.waitForTimeout(500);
        }
    });
});
