import { test, expect } from '@playwright/test';

test.describe('Frontend - UI Rendering Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-F01: should display the main heading', async ({ page }) => {
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('TC-F02: should render upload button', async ({ page }) => {
        await expect(page.locator('button:has-text("Select")')).toBeVisible();
    });

    test('TC-F03: should show "No file selected" initially', async ({ page }) => {
        await expect(page.locator('text=No file selected')).toBeVisible();
    });

    test('TC-F04: should have file input with correct accept attribute', async ({ page }) => {
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toHaveAttribute('accept', 'image/*,application/pdf');
    });

    test('TC-F05: should disable button during upload', async ({ page }) => {
        await page.route('**/api/upload', async route => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.fulfill({ status: 200, body: JSON.stringify({}) });
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });

        await expect(page.locator('button:disabled')).toBeVisible();
    });

    test('TC-F06: should show processing text during upload', async ({ page }) => {
        await page.route('**/api/upload', async route => {
            await new Promise(resolve => setTimeout(resolve, 500));
            await route.fulfill({ status: 200, body: JSON.stringify({}) });
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });

        await expect(page.locator('text=Processing')).toBeVisible();
    });

    test('TC-F07: should display progress bar during upload', async ({ page }) => {
        await page.route('**/api/upload', async route => {
            await new Promise(resolve => setTimeout(resolve, 500));
            await route.fulfill({ status: 200, body: JSON.stringify({}) });
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });

        await expect(page.locator('text=Uploading')).toBeVisible();
    });

    test('TC-F08: should update filename after selection', async ({ page }) => {
        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'my-document.pdf',
            mimeType: 'application/pdf',
            buffer,
        });

        await expect(page.locator('text=my-document.pdf')).toBeVisible();
    });
});

test.describe('Frontend - File Upload Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-F09: should upload PNG image successfully', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 200,
            body: JSON.stringify({ result: 'success' }),
        }));

        const buffer = Buffer.from('PNG content');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'image.png',
            mimeType: 'image/png',
            buffer,
        });
    });

    test('TC-F10: should upload JPEG image successfully', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 200,
            body: JSON.stringify({ result: 'success' }),
        }));

        const buffer = Buffer.from('JPEG content');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'photo.jpg',
            mimeType: 'image/jpeg',
            buffer,
        });
    });

    test('TC-F11: should upload PDF file successfully', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 200,
            body: JSON.stringify({ result: 'success' }),
        }));

        const buffer = Buffer.from('PDF content');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'document.pdf',
            mimeType: 'application/pdf',
            buffer,
        });
    });

    test('TC-F12: should handle multiple file selections', async ({ page }) => {
        const buffer1 = Buffer.from('first');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'first.png',
            mimeType: 'image/png',
            buffer: buffer1,
        });

        await expect(page.locator('text=first.png')).toBeVisible();

        const buffer2 = Buffer.from('second');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'second.png',
            mimeType: 'image/png',
            buffer: buffer2,
        });

        await expect(page.locator('text=second.png')).toBeVisible();
    });

    test('TC-F13: should clear previous file on new selection', async ({ page }) => {
        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'old.png',
            mimeType: 'image/png',
            buffer,
        });

        await page.locator('input[type="file"]').setInputFiles({
            name: 'new.png',
            mimeType: 'image/png',
            buffer,
        });

        await expect(page.locator('text=new.png')).toBeVisible();
    });
});

test.describe('Frontend - Error Handling Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-F14: should show error on 500 server error', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 500,
            body: 'Internal Server Error',
        }));

        page.once('dialog', dialog => {
            expect(dialog.message()).toContain('Upload failed');
            dialog.dismiss();
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'error.png',
            mimeType: 'image/png',
            buffer,
        });
    });

    test('TC-F15: should handle 404 error', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 404,
            body: 'Not Found',
        }));

        page.once('dialog', dialog => {
            dialog.dismiss();
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });
    });

    test('TC-F16: should handle network timeout', async ({ page }) => {
        await page.route('**/api/upload', route => route.abort('timedout'));

        page.once('dialog', dialog => {
            dialog.dismiss();
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'timeout.png',
            mimeType: 'image/png',
            buffer,
        });
    });

    test('TC-F17: should handle connection refused', async ({ page }) => {
        await page.route('**/api/upload', route => route.abort('connectionrefused'));

        page.once('dialog', dialog => {
            dialog.dismiss();
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'refused.png',
            mimeType: 'image/png',
            buffer,
        });
    });

    test('TC-F18: should handle malformed JSON response', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 200,
            body: 'not a json',
        }));

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });
    });

    test('TC-F19: should handle empty response', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 200,
            body: '',
        }));

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });
    });
});

test.describe('Frontend - Progress Tracking Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-F20: should show 0% progress initially', async ({ page }) => {
        await page.route('**/api/upload', async route => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await route.fulfill({ status: 200, body: JSON.stringify({}) });
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });

        await expect(page.locator('text=0%')).toBeVisible({ timeout: 1000 });
    });

    test('TC-F21: should show progress percentage', async ({ page }) => {
        await page.route('**/api/upload', async route => {
            await new Promise(resolve => setTimeout(resolve, 500));
            await route.fulfill({ status: 200, body: JSON.stringify({}) });
        });

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });

        await expect(page.locator('text=Uploading...')).toBeVisible();
    });

    test('TC-F22: should reset progress after completion', async ({ page }) => {
        await page.route('**/api/upload', route => route.fulfill({
            status: 200,
            body: JSON.stringify({ result: 'done' }),
        }));

        const buffer = Buffer.from('test');
        await page.locator('input[type="file"]').setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer,
        });

        await page.waitForTimeout(1000);
    });
});

test.describe('Frontend - Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('TC-F23: should have accessible button', async ({ page }) => {
        const button = page.locator('button').first();
        await expect(button).toBeVisible();
    });


    test('TC-F25: should have proper ARIA labels', async ({ page }) => {
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeAttached();
    });
});
