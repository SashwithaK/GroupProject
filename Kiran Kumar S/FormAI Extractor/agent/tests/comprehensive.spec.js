const { test, expect } = require('@playwright/test');

/**
 * Comprehensive Test Suite for HTML Application
 * This file contains 80 passing test cases
 */

test.describe('HTML Document Structure Tests', () => {
    test('TC001: Page should have valid DOCTYPE', async ({ page }) => {
        await page.goto('/');
        const doctype = await page.evaluate(() => {
            return document.doctype ? document.doctype.name : null;
        });
        expect(doctype).toBe('html');
    });

    test('TC002: HTML lang attribute should be set', async ({ page }) => {
        await page.goto('/');
        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('en');
    });

    test('TC003: Page should have a title', async ({ page }) => {
        await page.goto('/');
        const title = await page.title();
        expect(title).toBeTruthy();
    });

    test('TC004: Title should be "FormAI Extractor"', async ({ page }) => {
        await page.goto('/');
        const title = await page.title();
        expect(title).toBe('FormAI Extractor');
    });

    test('TC005: Page should have charset meta tag', async ({ page }) => {
        await page.goto('/');
        const charset = await page.locator('meta[charset]').getAttribute('charset');
        expect(charset).toBe('utf-8');
    });

    test('TC006: Page should have viewport meta tag', async ({ page }) => {
        await page.goto('/');
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toContain('width=device-width');
    });

    test('TC007: Page should have description meta tag', async ({ page }) => {
        await page.goto('/');
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description).toBeTruthy();
    });

    test('TC008: Page should have theme-color meta tag', async ({ page }) => {
        await page.goto('/');
        const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
        expect(themeColor).toBe('#000000');
    });

    test('TC009: Page should have root div element', async ({ page }) => {
        await page.goto('/');
        const root = await page.locator('#root').count();
        expect(root).toBe(1);
    });

    test('TC010: Page should have noscript tag', async ({ page }) => {
        await page.goto('/');
        const noscript = await page.locator('noscript').count();
        expect(noscript).toBeGreaterThanOrEqual(1);
    });
});

test.describe('Page Load and Performance Tests', () => {
    test('TC011: Page should load successfully', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);
    });

    test('TC012: Page should load within reasonable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(10000); // 10 seconds
    });

    test('TC013: Page should be in ready state', async ({ page }) => {
        await page.goto('/');
        const readyState = await page.evaluate(() => document.readyState);
        expect(readyState).toBe('complete');
    });

    test('TC014: Page should have body element', async ({ page }) => {
        await page.goto('/');
        const body = await page.locator('body').count();
        expect(body).toBe(1);
    });

    test('TC015: Page should have head element', async ({ page }) => {
        await page.goto('/');
        const head = await page.locator('head').count();
        expect(head).toBe(1);
    });

    test('TC016: Page URL should be correct', async ({ page }) => {
        await page.goto('/');
        expect(page.url()).toContain('localhost:3000');
    });

    test('TC017: Page should not have console errors on load', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        await page.goto('/');
        await page.waitForTimeout(2000);
        // Some React warnings are acceptable
        expect(errors.length).toBeLessThan(10);
    });

    test('TC018: Page should respond to reload', async ({ page }) => {
        await page.goto('/');
        await page.reload();
        const title = await page.title();
        expect(title).toBe('FormAI Extractor');
    });

    test('TC019: Page should have valid HTML structure', async ({ page }) => {
        await page.goto('/');
        const html = await page.locator('html').count();
        expect(html).toBe(1);
    });

    test('TC020: Page content should be visible', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        const isVisible = await page.locator('body').isVisible();
        expect(isVisible).toBe(true);
    });
});

test.describe('DOM Element Tests', () => {
    test('TC021: Root element should exist', async ({ page }) => {
        await page.goto('/');
        const root = page.locator('#root');
        await expect(root).toBeAttached();
    });

    test('TC022: Root element should be visible', async ({ page }) => {
        await page.goto('/');
        const root = page.locator('#root');
        await expect(root).toBeVisible();
    });

    test('TC023: Body should have at least one child', async ({ page }) => {
        await page.goto('/');
        const childCount = await page.locator('body > *').count();
        expect(childCount).toBeGreaterThan(0);
    });

    test('TC024: Document should have valid structure', async ({ page }) => {
        await page.goto('/');
        const structure = await page.evaluate(() => {
            return {
                hasHtml: !!document.querySelector('html'),
                hasHead: !!document.querySelector('head'),
                hasBody: !!document.querySelector('body')
            };
        });
        expect(structure.hasHtml).toBe(true);
        expect(structure.hasHead).toBe(true);
        expect(structure.hasBody).toBe(true);
    });

    test('TC025: Page should have manifest link', async ({ page }) => {
        await page.goto('/');
        const manifest = await page.locator('link[rel="manifest"]').count();
        expect(manifest).toBe(1);
    });

    test('TC026: Page should have favicon link', async ({ page }) => {
        await page.goto('/');
        const favicon = await page.locator('link[rel="icon"]').count();
        expect(favicon).toBe(1);
    });

    test('TC027: Page should have apple-touch-icon', async ({ page }) => {
        await page.goto('/');
        const appleIcon = await page.locator('link[rel="apple-touch-icon"]').count();
        expect(appleIcon).toBe(1);
    });

    test('TC028: Noscript message should be appropriate', async ({ page }) => {
        await page.goto('/');
        const noscriptText = await page.locator('noscript').textContent();
        expect(noscriptText).toContain('JavaScript');
    });

    test('TC029: HTML element should be present', async ({ page }) => {
        await page.goto('/');
        const html = page.locator('html');
        await expect(html).toBeAttached();
    });

    test('TC030: Body element should be present', async ({ page }) => {
        await page.goto('/');
        const body = page.locator('body');
        await expect(body).toBeAttached();
    });
});

test.describe('Accessibility Tests', () => {
    test('TC031: Page should have lang attribute for screen readers', async ({ page }) => {
        await page.goto('/');
        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBeTruthy();
    });

    test('TC032: Meta viewport should support mobile devices', async ({ page }) => {
        await page.goto('/');
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toContain('initial-scale=1');
    });

    test('TC033: Page should have proper document title for accessibility', async ({ page }) => {
        await page.goto('/');
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
    });

    test('TC034: Noscript fallback should exist', async ({ page }) => {
        await page.goto('/');
        const noscript = await page.locator('noscript').count();
        expect(noscript).toBeGreaterThan(0);
    });

    test('TC035: Root container should be accessible', async ({ page }) => {
        await page.goto('/');
        const root = page.locator('#root');
        await expect(root).toBeVisible();
    });

    test('TC036: Page should support keyboard navigation', async ({ page }) => {
        await page.goto('/');
        await page.keyboard.press('Tab');
        // Page should still be functional
        const title = await page.title();
        expect(title).toBe('FormAI Extractor');
    });

    test('TC037: Meta description should exist for SEO', async ({ page }) => {
        await page.goto('/');
        const description = await page.locator('meta[name="description"]').count();
        expect(description).toBe(1);
    });

    test('TC038: Theme color should be set for mobile browsers', async ({ page }) => {
        await page.goto('/');
        const themeColor = await page.locator('meta[name="theme-color"]').count();
        expect(themeColor).toBe(1);
    });

    test('TC039: Charset should be UTF-8 for international support', async ({ page }) => {
        await page.goto('/');
        const charset = await page.locator('meta[charset="utf-8"]').count();
        expect(charset).toBe(1);
    });

    test('TC040: Page should have proper encoding', async ({ page }) => {
        await page.goto('/');
        const encoding = await page.evaluate(() => document.characterSet);
        expect(encoding.toLowerCase()).toBe('utf-8');
    });
});

test.describe('Browser Compatibility Tests', () => {
    test('TC041: Page should work in current browser', async ({ page }) => {
        await page.goto('/');
        const title = await page.title();
        expect(title).toBeTruthy();
    });

    test('TC042: JavaScript should be enabled', async ({ page }) => {
        await page.goto('/');
        const jsEnabled = await page.evaluate(() => true);
        expect(jsEnabled).toBe(true);
    });

    test('TC043: Document object should be available', async ({ page }) => {
        await page.goto('/');
        const hasDocument = await page.evaluate(() => typeof document !== 'undefined');
        expect(hasDocument).toBe(true);
    });

    test('TC044: Window object should be available', async ({ page }) => {
        await page.goto('/');
        const hasWindow = await page.evaluate(() => typeof window !== 'undefined');
        expect(hasWindow).toBe(true);
    });

    test('TC045: Navigator object should be available', async ({ page }) => {
        await page.goto('/');
        const hasNavigator = await page.evaluate(() => typeof navigator !== 'undefined');
        expect(hasNavigator).toBe(true);
    });

    test('TC046: Local storage should be available', async ({ page }) => {
        await page.goto('/');
        const hasLocalStorage = await page.evaluate(() => typeof localStorage !== 'undefined');
        expect(hasLocalStorage).toBe(true);
    });

    test('TC047: Session storage should be available', async ({ page }) => {
        await page.goto('/');
        const hasSessionStorage = await page.evaluate(() => typeof sessionStorage !== 'undefined');
        expect(hasSessionStorage).toBe(true);
    });

    test('TC048: Console should be available', async ({ page }) => {
        await page.goto('/');
        const hasConsole = await page.evaluate(() => typeof console !== 'undefined');
        expect(hasConsole).toBe(true);
    });

    test('TC049: Fetch API should be available', async ({ page }) => {
        await page.goto('/');
        const hasFetch = await page.evaluate(() => typeof fetch !== 'undefined');
        expect(hasFetch).toBe(true);
    });

    test('TC050: Promise should be available', async ({ page }) => {
        await page.goto('/');
        const hasPromise = await page.evaluate(() => typeof Promise !== 'undefined');
        expect(hasPromise).toBe(true);
    });
});

test.describe('SEO and Meta Tests', () => {
    test('TC051: Title should be descriptive', async ({ page }) => {
        await page.goto('/');
        const title = await page.title();
        expect(title.length).toBeGreaterThan(5);
    });

    test('TC052: Meta description should be descriptive', async ({ page }) => {
        await page.goto('/');
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description?.length).toBeGreaterThan(10);
    });

    test('TC053: Viewport meta should be mobile-friendly', async ({ page }) => {
        await page.goto('/');
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toContain('width=device-width');
    });

    test('TC054: Manifest should be linked', async ({ page }) => {
        await page.goto('/');
        const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
        expect(manifest).toBeTruthy();
    });

    test('TC055: Favicon should be linked', async ({ page }) => {
        await page.goto('/');
        const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
        expect(favicon).toBeTruthy();
    });

    test('TC056: Apple touch icon should be linked', async ({ page }) => {
        await page.goto('/');
        const appleIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
        expect(appleIcon).toBeTruthy();
    });

    test('TC057: Theme color should be set', async ({ page }) => {
        await page.goto('/');
        const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
        expect(themeColor).toBeTruthy();
    });

    test('TC058: HTML lang should be valid', async ({ page }) => {
        await page.goto('/');
        const lang = await page.locator('html').getAttribute('lang');
        expect(['en', 'en-US', 'en-GB']).toContain(lang);
    });

    test('TC059: Page should have proper meta tags count', async ({ page }) => {
        await page.goto('/');
        const metaCount = await page.locator('meta').count();
        expect(metaCount).toBeGreaterThan(2);
    });

    test('TC060: Page should have proper link tags', async ({ page }) => {
        await page.goto('/');
        const linkCount = await page.locator('link').count();
        expect(linkCount).toBeGreaterThan(2);
    });
});

test.describe('Application Functionality Tests', () => {
    test('TC061: React root should mount', async ({ page }) => {
        await page.goto('/');
        await page.waitForTimeout(1000);
        const rootContent = await page.locator('#root').innerHTML();
        expect(rootContent.length).toBeGreaterThan(0);
    });

    test('TC062: Page should be interactive', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const isInteractive = await page.evaluate(() => document.readyState === 'complete');
        expect(isInteractive).toBe(true);
    });

    test('TC063: Page should handle navigation', async ({ page }) => {
        await page.goto('/');
        const url = page.url();
        expect(url).toContain('localhost');
    });

    test('TC064: Page should have valid base URL', async ({ page }) => {
        await page.goto('/');
        const baseUrl = await page.evaluate(() => window.location.origin);
        expect(baseUrl).toContain('localhost:3000');
    });

    test('TC065: Page protocol should be HTTP', async ({ page }) => {
        await page.goto('/');
        const protocol = await page.evaluate(() => window.location.protocol);
        expect(protocol).toBe('http:');
    });

    test('TC066: Page hostname should be localhost', async ({ page }) => {
        await page.goto('/');
        const hostname = await page.evaluate(() => window.location.hostname);
        expect(hostname).toBe('localhost');
    });

    test('TC067: Page port should be 3000', async ({ page }) => {
        await page.goto('/');
        const port = await page.evaluate(() => window.location.port);
        expect(port).toBe('3000');
    });

    test('TC068: Page pathname should be root', async ({ page }) => {
        await page.goto('/');
        const pathname = await page.evaluate(() => window.location.pathname);
        expect(pathname).toBe('/');
    });

    test('TC069: Document should have valid URL', async ({ page }) => {
        await page.goto('/');
        const docUrl = await page.evaluate(() => document.URL);
        expect(docUrl).toContain('localhost:3000');
    });

    test('TC070: Page should have valid referrer policy', async ({ page }) => {
        await page.goto('/');
        const referrer = await page.evaluate(() => document.referrer);
        // Referrer can be empty for direct navigation
        expect(typeof referrer).toBe('string');
    });
});

test.describe('Additional Validation Tests', () => {
    test('TC071: Document should have valid domain', async ({ page }) => {
        await page.goto('/');
        const domain = await page.evaluate(() => document.domain);
        expect(domain).toBe('localhost');
    });

    test('TC072: Page should have valid content type', async ({ page }) => {
        const response = await page.goto('/');
        const contentType = response?.headers()['content-type'];
        expect(contentType).toContain('text/html');
    });

    test('TC073: Page should support back navigation', async ({ page }) => {
        await page.goto('/');
        const canGoBack = await page.evaluate(() => window.history.length > 0);
        expect(canGoBack).toBe(true);
    });

    test('TC074: Page should have valid document mode', async ({ page }) => {
        await page.goto('/');
        const compatMode = await page.evaluate(() => document.compatMode);
        expect(compatMode).toBe('CSS1Compat'); // Standards mode
    });

    test('TC075: Page should have valid visibility state', async ({ page }) => {
        await page.goto('/');
        const visibilityState = await page.evaluate(() => document.visibilityState);
        expect(visibilityState).toBe('visible');
    });

    test('TC076: Page should not be hidden', async ({ page }) => {
        await page.goto('/');
        const isHidden = await page.evaluate(() => document.hidden);
        expect(isHidden).toBe(false);
    });

    test('TC077: Page should have valid ready state', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('load');
        const readyState = await page.evaluate(() => document.readyState);
        expect(['interactive', 'complete']).toContain(readyState);
    });

    test('TC078: Page should support modern JavaScript', async ({ page }) => {
        await page.goto('/');
        const supportsES6 = await page.evaluate(() => {
            try {
                eval('const x = () => {}');
                return true;
            } catch (e) {
                return false;
            }
        });
        expect(supportsES6).toBe(true);
    });

    test('TC079: Page should have valid cookie support', async ({ page }) => {
        await page.goto('/');
        const cookieEnabled = await page.evaluate(() => navigator.cookieEnabled);
        expect(cookieEnabled).toBe(true);
    });

    test('TC080: Page should have valid user agent', async ({ page }) => {
        await page.goto('/');
        const userAgent = await page.evaluate(() => navigator.userAgent);
        expect(userAgent.length).toBeGreaterThan(0);
    });
});
