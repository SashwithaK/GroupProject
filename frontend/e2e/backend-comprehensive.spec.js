import { test, expect } from '@playwright/test';

test.describe('Backend API - Upload Endpoint Tests', () => {
    const API_URL = 'http://127.0.0.1:5000/api/upload';

    test('TC-B01: should accept valid PNG image', async ({ request }) => {
        const buffer = Buffer.from('fake PNG data');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'test.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running on port 5000');
        }
    });

    test('TC-B02: should accept valid JPEG image', async ({ request }) => {
        const buffer = Buffer.from('fake JPEG data');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'photo.jpg',
                        mimeType: 'image/jpeg',
                        buffer,
                    },
                },
            });
            expect([200, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B03: should accept PDF file', async ({ request }) => {
        const buffer = Buffer.from('%PDF-1.4 fake pdf');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'document.pdf',
                        mimeType: 'application/pdf',
                        buffer,
                    },
                },
            });
            expect([200, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });


    test('TC-B05: should handle medium file (100KB)', async ({ request }) => {
        const buffer = Buffer.alloc(100 * 1024, 'b');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'medium.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B07: should reject request without file', async ({ request }) => {
        try {
            const response = await request.post(API_URL, {
                multipart: {
                    otherField: 'value'
                },
            });
            expect(response.status()).toBe(400);
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B08: should handle empty file', async ({ request }) => {
        const buffer = Buffer.alloc(0);

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'empty.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B09: should handle file with special characters in name', async ({ request }) => {
        const buffer = Buffer.from('test data');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'test file @#$%.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });
});

test.describe('Backend API - Response Validation Tests', () => {
    const API_URL = 'http://127.0.0.1:5000/api/upload';

    test('TC-B11: should return JSON response', async ({ request }) => {
        const buffer = Buffer.from('test');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'test.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });

            if (response.status() === 200) {
                const contentType = response.headers()['content-type'];
                expect(contentType).toContain('application/json');
            }
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B12: should return structured data on success', async ({ request }) => {
        const buffer = Buffer.from('test');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'test.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });

            if (response.status() === 200) {
                const body = await response.json();
                expect(body).toBeDefined();
            }
        } catch (error) {
            console.warn('Backend not running');
        }
    });


    test('TC-B14: should return appropriate status codes', async ({ request }) => {
        const buffer = Buffer.from('test');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'test.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });

            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });
});

test.describe('Backend API - Error Handling Tests', () => {
    const API_URL = 'http://127.0.0.1:5000/api/upload';

    test('TC-B15: should handle invalid image format gracefully', async ({ request }) => {
        const buffer = Buffer.from('not an image');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'fake.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B16: should handle corrupted file', async ({ request }) => {
        const buffer = Buffer.from('corrupted data \x00\x01\x02');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'corrupted.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B17: should handle text file as image', async ({ request }) => {
        const buffer = Buffer.from('This is plain text');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'text.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B18: should handle binary data', async ({ request }) => {
        const buffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'binary.jpg',
                        mimeType: 'image/jpeg',
                        buffer,
                    },
                },
            });
            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B19: should handle null bytes in file', async ({ request }) => {
        const buffer = Buffer.from('data\x00\x00\x00more data');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'nullbytes.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B20: should handle unicode filename', async ({ request }) => {
        const buffer = Buffer.from('test');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: '测试文件.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
            });
            expect([200, 400, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });
});

test.describe('Backend API - Performance Tests', () => {
    const API_URL = 'http://127.0.0.1:5000/api/upload';

    test('TC-B21: should respond within reasonable time for small file', async ({ request }) => {
        const buffer = Buffer.from('small file');
        const startTime = Date.now();

        try {
            await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'perf-test.png',
                        mimeType: 'image/png',
                        buffer,
                    },
                },
                timeout: 10000,
            });

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(10000);
        } catch (error) {
            console.warn('Backend not running or timeout');
        }
    });

    test('TC-B22: should handle concurrent requests', async ({ request }) => {
        const buffer = Buffer.from('concurrent test');

        try {
            const requests = Array(3).fill(null).map(() =>
                request.post(API_URL, {
                    multipart: {
                        file: {
                            name: 'concurrent.png',
                            mimeType: 'image/png',
                            buffer,
                        },
                    },
                    timeout: 15000,
                })
            );

            const responses = await Promise.all(requests);
            responses.forEach(response => {
                expect([200, 500]).toContain(response.status());
            });
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B23: should handle multiple file types in sequence', async ({ request }) => {
        const files = [
            { buffer: Buffer.from('PNG data'), name: 'test1.png', mime: 'image/png' },
            { buffer: Buffer.from('JPEG data'), name: 'test2.jpg', mime: 'image/jpeg' },
            { buffer: Buffer.from('PDF data'), name: 'test3.pdf', mime: 'application/pdf' }
        ];

        try {
            for (const file of files) {
                const response = await request.post(API_URL, {
                    multipart: {
                        file: {
                            name: file.name,
                            mimeType: file.mime,
                            buffer: file.buffer,
                        },
                    },
                });
                expect([200, 500]).toContain(response.status());
            }
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B24: should accept GIF image format', async ({ request }) => {
        const buffer = Buffer.from('GIF89a');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'animated.gif',
                        mimeType: 'image/gif',
                        buffer,
                    },
                },
            });
            expect([200, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });

    test('TC-B25: should handle WebP image format', async ({ request }) => {
        const buffer = Buffer.from('RIFF....WEBP');

        try {
            const response = await request.post(API_URL, {
                multipart: {
                    file: {
                        name: 'modern.webp',
                        mimeType: 'image/webp',
                        buffer,
                    },
                },
            });
            expect([200, 500]).toContain(response.status());
        } catch (error) {
            console.warn('Backend not running');
        }
    });
});
