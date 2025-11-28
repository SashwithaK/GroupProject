# Playwright Test Suite Walkthrough

This document guides you through the Playwright test suite created for your Handwriting Reading AI project.

## Prerequisites

You need to install Playwright and its browser binaries. Run the following commands in the `frontend` directory:

```bash
cd frontend
npm install -D @playwright/test --legacy-peer-deps
npx playwright install
```

## Test Structure

The tests are located in `frontend/e2e`:

1.  **`frontend.spec.js`**: Tests the React frontend.
    *   Verifies form rendering.
    *   Tests file selection.
    *   Mocks successful upload and verifies UI updates.
    *   Mocks server errors and network timeouts to test error handling.

2.  **`backend.spec.js`**: Tests the Spring Boot backend API (`/api/upload`).
    *   Sends a POST request with a file to the running backend.
    *   Verifies the response status and structure.
    *   **Note**: Ensure your Spring Boot backend is running on `localhost:5000` before running this test.

3.  **`pdf-gen.spec.js`**: Demonstrates PDF generation using Playwright.
    *   Generates a PDF report from an HTML template.
    *   Saves the PDF to `frontend/test-results/report.pdf`.

## Running Tests

You can run the tests using the npm script added to `package.json`:

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (interactive)
npx playwright test --ui

# Run a specific test file
npx playwright test e2e/frontend.spec.js
```

## PDF Generation

The `pdf-gen.spec.js` test fulfills the requirement to "generate pdf also using html". It creates a sample report PDF in the `test-results` folder. You can modify the HTML template in the test file to customize the PDF output.

## Comprehensive Test Suite (60+ Test Cases)

In addition to the basic tests, I've created comprehensive test suites with extensive coverage:

### Test Files
1. **`e2e/frontend-comprehensive.spec.js`** - 25 frontend test cases
   - UI rendering, file uploads, error handling, progress tracking, accessibility
2. **`e2e/backend-comprehensive.spec.js`** - 22 backend API test cases
   - Upload endpoints, response validation, error handling, performance
3. **`e2e/pdf-comprehensive.spec.js`** - 13 PDF generation test cases
   - Basic PDFs, content variations, advanced formatting

### Running Comprehensive Tests
```bash
# Run all comprehensive tests
npx playwright test e2e/frontend-comprehensive.spec.js
npx playwright test e2e/backend-comprehensive.spec.js
npx playwright test e2e/pdf-comprehensive.spec.js

# Run all tests at once
npm run test:e2e
```

See `TEST-SUITE-DOCUMENTATION.md` for complete details on all 60 test cases.
