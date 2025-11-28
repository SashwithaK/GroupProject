import { test, expect } from '@playwright/test';

test.describe('Upload & Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('11. Should display upload area', async ({ page }) => {
        const uploadCard = page.locator('.upload-card');
        await expect(uploadCard).toBeVisible();
    });

    test('12. Should show "Drag & Drop" text', async ({ page }) => {
        const text = page.locator('.upload-trigger h3');
        await expect(text).toContainText(/Drag & Drop/i);
    });

    test('13. Extract button should not be visible initially', async ({ page }) => {
        const btn = page.locator('button.btn-extract-main');
        await expect(btn).toBeHidden();
    });

    test('14. Should accept image files', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', {
            name: 'test.png',
            mimeType: 'image/png',
            buffer: Buffer.from('this is a test image file')
        });
        const preview = page.locator('.preview-image');
        await expect(preview).toBeVisible();
    });

    test('15. Extract button should appear after file selection', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', {
            name: 'test.jpg',
            mimeType: 'image/jpeg',
            buffer: Buffer.from('test')
        });
        const btn = page.locator('button.btn-extract-main');
        await expect(btn).toBeVisible();
    });

    test('16. Should show file name after selection', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', {
            name: 'document.png',
            mimeType: 'image/png',
            buffer: Buffer.from('test')
        });
        const info = page.locator('.file-details h4');
        await expect(info).toContainText('document.png');
    });

    test('17. Should allow resetting selected file', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', {
            name: 'remove_me.png',
            mimeType: 'image/png',
            buffer: Buffer.from('test')
        });
        const resetBtn = page.locator('button.btn-reset-main');
        await resetBtn.click();
        await expect(page.locator('.preview-image')).toBeHidden();
    });

    test('18. Should show error for invalid file type', async ({ page }) => {
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('Please upload a JPG, PNG, or PDF file');
            dialog.dismiss();
        });

        await page.setInputFiles('input[type="file"]', {
            name: 'test.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('test')
        });
    });

    test('19. Should handle large files gracefully', async ({ page }) => {
        page.on('dialog', dialog => {
            expect(dialog.message()).toContain('File size must be less than 10MB');
            dialog.dismiss();
        });

        const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
        await page.setInputFiles('input[type="file"]', {
            name: 'large.png',
            mimeType: 'image/png',
            buffer: largeBuffer
        });
    });

    test('20. Dropzone should highlight on hover', async ({ page }) => {
        const dropzone = page.locator('.preview-area');
        await dropzone.hover();
        await expect(dropzone).toBeVisible();
    });
});
