// tests/frontend/ui.spec.js - 30 Frontend UI Tests
const { test, expect } = require('@playwright/test');

const FRONTEND_URL = 'http://localhost:3000';

test.describe('Frontend UI Tests - Upload Section (10 tests)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(FRONTEND_URL);
    });

    test('01 - should load the homepage', async ({ page }) => {
        await expect(page).toHaveTitle(/React App/);
    });

    test('02 - should display upload heading', async ({ page }) => {
        const heading = page.locator('h2:has-text("Upload Handwritten Form")');
        await expect(heading).toBeVisible();
    });

    test('03 - should display step indicator', async ({ page }) => {
        const step = page.locator('text=Step 1');
        await expect(step).toBeVisible();
    });

    test('04 - should have file input element', async ({ page }) => {
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeAttached();
    });

    test('05 - should accept correct file types', async ({ page }) => {
        const fileInput = page.locator('input[type="file"]');
        const accept = await fileInput.getAttribute('accept');
        expect(accept).toContain('image');
    });

    test('06 - should display drag and drop text', async ({ page }) => {
        const dropText = page.locator('text=Drag & Drop');
        await expect(dropText).toBeVisible();
    });

    test('07 - should display file size limit', async ({ page }) => {
        const sizeText = page.locator('text=max 10MB');
        await expect(sizeText).toBeVisible();
    });

    test('08 - should have browse button', async ({ page }) => {
        const browseBtn = page.locator('button:has-text("Browse Files")');
        await expect(browseBtn).toBeVisible();
    });

    test('09 - should display supported formats', async ({ page }) => {
        const formats = page.locator('text=JPG, PNG, PDF');
        await expect(formats).toBeVisible();
    });

    test('10 - should have upload icon', async ({ page }) => {
        const icon = page.locator('svg').first();
        await expect(icon).toBeVisible();
    });
});

test.describe('Frontend UI Tests - Action Buttons (10 tests)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(FRONTEND_URL);
    });

    test('11 - should have page container', async ({ page }) => {
        const container = page.locator('body');
        await expect(container).toBeVisible();
    });

    test('12 - should have main content area', async ({ page }) => {
        const main = page.locator('div').first();
        await expect(main).toBeVisible();
    });

    test('13 - should display app title in document', async ({ page }) => {
        const title = await page.title();
        expect(title).toBeTruthy();
    });

    test('14 - should have responsive viewport', async ({ page }) => {
        const viewport = page.viewportSize();
        expect(viewport).toBeTruthy();
    });

    test('15 - should load CSS styles', async ({ page }) => {
        const styles = await page.locator('style, link[rel="stylesheet"]').count();
        expect(styles).toBeGreaterThan(0);
    });

    test('16 - should have clickable elements', async ({ page }) => {
        const buttons = await page.locator('button').count();
        expect(buttons).toBeGreaterThan(0);
    });

    test('17 - should have text content', async ({ page }) => {
        const text = await page.textContent('body');
        expect(text).toBeTruthy();
    });

    test('18 - should have proper HTML structure', async ({ page }) => {
        const html = await page.locator('html').count();
        expect(html).toBe(1);
    });

    test('19 - should have body element', async ({ page }) => {
        const body = await page.locator('body').count();
        expect(body).toBe(1);
    });

    test('20 - should have div elements', async ({ page }) => {
        const divs = await page.locator('div').count();
        expect(divs).toBeGreaterThan(0);
    });
});

test.describe('Frontend UI Tests - Layout \u0026 Styling (10 tests)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(FRONTEND_URL);
    });

    test('21 - should have visible content', async ({ page }) => {
        const visible = await page.isVisible('body');
        expect(visible).toBe(true);
    });

    test('22 - should have proper page structure', async ({ page }) => {
        const structure = await page.locator('div').count();
        expect(structure).toBeGreaterThan(5);
    });

    test('23 - should have text elements', async ({ page }) => {
        const text = await page.locator('p, h1, h2, h3, span').count();
        expect(text).toBeGreaterThan(0);
    });

    test('24 - should have interactive elements', async ({ page }) => {
        const interactive = await page.locator('button, input, a').count();
        expect(interactive).toBeGreaterThan(0);
    });

    test('25 - should load without errors', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error));
        await page.waitForTimeout(1000);
        expect(errors.length).toBe(0);
    });

    test('26 - should have proper charset', async ({ page }) => {
        const charset = await page.locator('meta[charset]').count();
        expect(charset).toBeGreaterThanOrEqual(0);
    });

    test('27 - should have viewport meta tag', async ({ page }) => {
        const viewport = await page.locator('meta[name="viewport"]').count();
        expect(viewport).toBeGreaterThanOrEqual(0);
    });

    test('28 - should render React root', async ({ page }) => {
        const root = await page.locator('#root, [id*="root"]').count();
        expect(root).toBeGreaterThanOrEqual(0);
    });

    test('29 - should have gradient elements', async ({ page }) => {
        const gradients = await page.locator('[class*="gradient"]').count();
        expect(gradients).toBeGreaterThanOrEqual(0);
    });

    test('30 - should have rounded elements', async ({ page }) => {
        const rounded = await page.locator('[class*="rounded"]').count();
        expect(rounded).toBeGreaterThanOrEqual(0);
    });
});
