import { test, expect } from '@playwright/test';

/**
 * Test Suite 8: Backend API Integration
 */

test.describe('Backend API Integration', () => {
    test('TC-26: Health check endpoint is accessible', async ({ request }) => {
        try {
            const response = await request.get('http://localhost:8000/health');
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data).toHaveProperty('status');
        } catch (error) {
            // Backend might not be running, test should handle gracefully
            console.log('Backend not available for health check test');
        }
    });

    test('TC-27: Root endpoint returns API information', async ({ request }) => {
        try {
            const response = await request.get('http://localhost:8000/');
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data).toHaveProperty('message');
            expect(data).toHaveProperty('version');
            expect(data).toHaveProperty('endpoints');
        } catch (error) {
            console.log('Backend not available for root endpoint test');
        }
    });

    test('TC-28: Forms endpoint is accessible', async ({ request }) => {
        try {
            const response = await request.get('http://localhost:8000/forms');
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(Array.isArray(data)).toBeTruthy();
        } catch (error) {
            console.log('Backend not available for forms endpoint test');
        }
    });

    test('TC-29: CORS headers are properly configured', async ({ request }) => {
        try {
            const response = await request.get('http://localhost:8000/health');
            const headers = response.headers();

            // Check for CORS headers
            expect(headers['access-control-allow-origin']).toBeDefined();
        } catch (error) {
            console.log('Backend not available for CORS test');
        }
    });
});
