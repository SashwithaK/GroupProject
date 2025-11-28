import { test, expect } from '@playwright/test';

/**
 * Test Suite 1: Application Loading and Initialization
 * Test Suite 2: UI Components and Layout
 */

test.describe('Application Loading and Initialization', () => {
    test('TC-01: Application loads successfully', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/DataExtract AI \| Intelligent Processing/);
    });

    test('TC-02: Main header is visible on load', async ({ page }) => {
        await page.goto('/');
        const header = page.locator('.main-header');
        await expect(header).toBeVisible();
    });

    test('TC-03: Application logo is displayed', async ({ page }) => {
        await page.goto('/');
        const logo = page.locator('.app-logo');
        await expect(logo).toBeVisible();
    });

    test('TC-04: Default tab is "Upload & Extract"', async ({ page }) => {
        await page.goto('/');
        const uploadTab = page.locator('.nav-tab.active').first();
        await expect(uploadTab).toContainText('Upload & Extract');
    });
});

test.describe('UI Components and Layout', () => {
    test('TC-05: Navigation tabs are present', async ({ page }) => {
        await page.goto('/');
        const uploadTab = page.locator('button:has-text("Upload & Extract")');
        const databaseTab = page.locator('button:has-text("Database Manager")');

        await expect(uploadTab).toBeVisible();
        await expect(databaseTab).toBeVisible();
    });

    test('TC-06: Tab switching works correctly', async ({ page }) => {
        await page.goto('/');
        const databaseTab = page.locator('button:has-text("Database Manager")');
        await databaseTab.click();

        await expect(databaseTab).toHaveClass(/active/);
    });

    test('TC-07: Upload section is visible by default', async ({ page }) => {
        await page.goto('/');
        const uploadSection = page.locator('.extraction-layout');
        await expect(uploadSection).toBeVisible();
    });

    test('TC-08: Database badge shows count', async ({ page }) => {
        await page.goto('/');
        const badge = page.locator('.nav-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText(/\d+/);
    });

    test('TC-09: Header subtitle is displayed', async ({ page }) => {
        await page.goto('/');
        const subtitle = page.locator('.header-subtitle');
        await expect(subtitle).toBeVisible();
        await expect(subtitle).toContainText('Enterprise-Grade AI-Powered OCR System');
    });
});
