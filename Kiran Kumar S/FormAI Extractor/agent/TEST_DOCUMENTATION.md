# Playwright Test Suite Documentation

## Overview

This test suite contains **86 comprehensive test cases** for the Handwriting Extraction application, covering:
- **40 Backend API Tests**: Testing Spring Boot REST endpoints
- **40 Frontend UI Tests**: Testing React application components
- **6 Integration Tests**: Testing end-to-end workflows

## Test Structure

```
tests/
├── backend/
│   ├── upload.spec.js          (10 tests)
│   ├── runs.spec.js            (15 tests)
│   ├── extractions.spec.js     (10 tests)
│   └── exports.spec.js         (5 tests)
├── frontend/
│   ├── upload-section.spec.js  (12 tests)
│   ├── processing-status.spec.js (8 tests)
│   ├── extracted-data.spec.js  (10 tests)
│   ├── actions.spec.js         (5 tests)
│   └── extraction-list.spec.js (5 tests)
├── integration/
│   └── e2e-flow.spec.js        (6 tests)
└── fixtures/
    └── (test files)
```

## Prerequisites

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Start Services
Ensure the following services are running:

**Backend (Spring Boot):**
```bash
cd server
mvn spring-boot:run
# Should run on http://localhost:8080
```

**Frontend (React):**
```bash
cd my-react-app
npm start
# Should run on http://localhost:3000
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Backend API tests only
npm run test:backend

# Frontend UI tests only
npm run test:frontend

# Integration tests only
npm run test:integration
```

### Run Tests by Browser
```bash
# Chromium only
npm run test:chromium

# Firefox only
npm run test:firefox

# WebKit only
npm run test:webkit
```

### Debug Mode
```bash
# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode (step through)
npm run test:debug
```

## Test Coverage

### Backend API Tests (40 tests)

#### Upload Controller (10 tests)
- ✓ Upload valid JPG image
- ✓ Upload valid PNG image
- ✓ Upload valid PDF file
- ✓ Reject invalid file type
- ✓ Reject file exceeding 10MB limit
- ✓ Reject empty file upload
- ✓ Verify file entity created in database
- ✓ Verify run entity created with QUEUED status
- ✓ Verify response contains runId and fileId
- ✓ Handle missing file parameter

#### Run Controller (15 tests)
- ✓ GET /runs/{runId} - fetch queued run
- ✓ GET /runs/{runId} - fetch completed run
- ✓ GET /runs/{runId} - fetch failed run
- ✓ GET /runs/{runId} - return 404 for non-existent run
- ✓ POST /runs/{runId} - trigger processing
- ✓ POST /runs/{runId} - return completed result
- ✓ POST /runs/{runId} - return 404 for non-existent run
- ✓ Verify run status transitions (QUEUED → COMPLETED)
- ✓ Verify run status transitions (QUEUED → FAILED)
- ✓ Verify extraction result structure
- ✓ Verify error handling for invalid file path
- ✓ Verify processing time is recorded
- ✓ Verify document type is identified
- ✓ Verify warnings are captured
- ✓ Verify pages and fields are extracted

#### Extraction CRUD (10 tests)
- ✓ GET /extractions - list all extractions
- ✓ GET /extractions - return empty array when no extractions
- ✓ GET /extractions/{runId} - fetch specific extraction
- ✓ GET /extractions/{runId} - return 404 for non-existent
- ✓ PUT /extractions/{runId} - update extraction data
- ✓ PUT /extractions/{runId} - return 404 for non-existent
- ✓ PUT /extractions/{runId} - recalculate average confidence
- ✓ DELETE /extractions/{runId} - delete extraction
- ✓ DELETE /extractions/{runId} - update run status to FAILED
- ✓ DELETE /extractions/{runId} - return 404 for non-existent

#### Export (5 tests)
- ✓ POST /exports - export as JSON
- ✓ POST /exports - export as CSV
- ✓ POST /exports - verify CSV format and headers
- ✓ POST /exports - return 404 for non-existent runId
- ✓ POST /exports - verify Content-Disposition headers

### Frontend UI Tests (40 tests)

#### Upload Section (12 tests)
- ✓ Render upload section on page load
- ✓ Display drag-and-drop zone
- ✓ Handle file selection via browse button
- ✓ Handle drag-and-drop file upload
- ✓ Validate file type (JPG, PNG, PDF)
- ✓ Reject invalid file types with error
- ✓ Validate file size (max 10MB)
- ✓ Reject oversized files with error
- ✓ Display selected file name
- ✓ Show upload progress bar
- ✓ Display upload status messages
- ✓ Handle drag over/leave visual feedback

#### Processing Status (8 tests)
- ✓ Display QUEUED status with loading spinner
- ✓ Display PROCESSING status with loading spinner
- ✓ Display COMPLETED status with success icon
- ✓ Display FAILED status with error icon
- ✓ Show progress percentage during upload
- ✓ Poll backend for status updates
- ✓ Stop polling when status is COMPLETED
- ✓ Stop polling when status is FAILED

#### Extracted Data (10 tests)
- ✓ Display extracted data section after completion
- ✓ Show document type
- ✓ Show processing time
- ✓ Show run ID
- ✓ Display pages with fields in table format
- ✓ Display field names, values, and confidence scores
- ✓ Show warnings section
- ✓ Toggle JSON view on/off
- ✓ Display formatted JSON in code block
- ✓ Show database storage confirmation

#### Actions (5 tests)
- ✓ Copy JSON to clipboard
- ✓ Show "Copied!" feedback after copy
- ✓ Download JSON file
- ✓ Download CSV file
- ✓ Reset form to initial state

#### Extraction List (5 tests)
- ✓ Fetch and display extraction list
- ✓ View extraction details
- ✓ Edit extraction JSON
- ✓ Save edited extraction
- ✓ Delete extraction with confirmation

### Integration Tests (6 tests)

#### End-to-End Workflows
- ✓ Upload → Process → View Results → Download JSON
- ✓ Upload → Process → View Results → Download CSV
- ✓ Upload → Process → Edit → Save → View Updated
- ✓ Upload → Process → Delete Extraction
- ✓ Error: Upload invalid file → Display error → Reset
- ✓ Error: Upload → Processing fails → Display error → Retry

## Viewing Test Results

### HTML Report
After running tests, view the HTML report:
```bash
npm run test:report
```

This will open an interactive HTML report showing:
- Test execution summary
- Pass/fail status for each test
- Screenshots of failures
- Execution time
- Browser-specific results

### JSON Report
Test results are also saved in `test-results.json` for CI/CD integration.

## Test Fixtures

Test files are stored in `tests/fixtures/`:
- `sample.jpg` - Test JPG image
- `sample.png` - Test PNG image
- `sample.pdf` - Test PDF file

These files are automatically created during test execution if they don't exist.

## Troubleshooting

### Backend Connection Issues
If tests fail with connection errors:
1. Verify backend is running: `curl http://localhost:8080/v1/extractions`
2. Check backend logs for errors
3. Ensure database is accessible

### Frontend Connection Issues
If tests fail to load the frontend:
1. Verify frontend is running: `curl http://localhost:3000`
2. Check for build errors in the React app
3. Clear browser cache: `npx playwright clean`

### Test Timeouts
If tests timeout:
1. Increase timeout in `playwright.config.js`
2. Check if services are slow to respond
3. Verify network connectivity

## CI/CD Integration

To run tests in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm install

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test

- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use descriptive test names
3. Add appropriate assertions
4. Update this documentation
5. Ensure tests are independent and can run in any order
