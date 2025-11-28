# Playwright Test Suite - Complete Documentation

## Overview
This comprehensive test suite contains **60+ test cases** covering all aspects of the Handwriting Reading AI project.

## Test Files Summary

### 1. Frontend Tests (25 test cases)
**File**: `e2e/frontend-comprehensive.spec.js`

#### UI Rendering Tests (8 tests)
- TC-F01: Main heading display
- TC-F02: Upload button rendering
- TC-F03: Initial "No file selected" state
- TC-F04: File input accept attribute
- TC-F05: Button disabled during upload
- TC-F06: Processing text display
- TC-F07: Progress bar visibility
- TC-F08: Filename update after selection

#### File Upload Tests (5 tests)
- TC-F09: PNG image upload
- TC-F10: JPEG image upload
- TC-F11: PDF file upload
- TC-F12: Multiple file selections
- TC-F13: Clear previous file on new selection

#### Error Handling Tests (6 tests)
- TC-F14: 500 server error handling
- TC-F15: 404 error handling
- TC-F16: Network timeout handling
- TC-F17: Connection refused handling
- TC-F18: Malformed JSON response
- TC-F19: Empty response handling

#### Progress Tracking Tests (3 tests)
- TC-F20: Initial 0% progress
- TC-F21: Progress percentage display
- TC-F22: Progress reset after completion

#### Accessibility Tests (3 tests)
- TC-F23: Accessible button
- TC-F24: Keyboard navigation support
- TC-F25: ARIA labels

### 2. Backend API Tests (22 test cases)
**File**: `e2e/backend-comprehensive.spec.js`

#### Upload Endpoint Tests (10 tests)
- TC-B01: Valid PNG image acceptance
- TC-B02: Valid JPEG image acceptance
- TC-B03: PDF file acceptance
- TC-B04: Small file (1KB) handling
- TC-B05: Medium file (100KB) handling
- TC-B06: Large file (1MB) handling
- TC-B07: Request without file rejection
- TC-B08: Empty file handling
- TC-B09: Special characters in filename
- TC-B10: Very long filename handling

#### Response Validation Tests (4 tests)
- TC-B11: JSON response format
- TC-B12: Structured data on success
- TC-B13: CORS headers
- TC-B14: Appropriate status codes

#### Error Handling Tests (6 tests)
- TC-B15: Invalid image format
- TC-B16: Corrupted file handling
- TC-B17: Text file as image
- TC-B18: Binary data handling
- TC-B19: Null bytes in file
- TC-B20: Unicode filename

#### Performance Tests (2 tests)
- TC-B21: Response time for small file
- TC-B22: Concurrent requests handling

### 3. PDF Generation Tests (13 test cases)
**File**: `e2e/pdf-comprehensive.spec.js`

#### Basic PDF Tests (5 tests)
- TC-P01: Basic HTML to PDF
- TC-P02: Custom A4 page size
- TC-P03: Letter size format
- TC-P04: PDF with margins
- TC-P05: Background graphics

#### Content Tests (5 tests)
- TC-P06: PDF with table
- TC-P07: PDF with list
- TC-P08: Styled content
- TC-P09: Multiple pages
- TC-P10: Unicode characters

#### Advanced Tests (3 tests)
- TC-P11: Landscape orientation
- TC-P12: Custom dimensions
- TC-P13: Header and footer

## Running the Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test e2e/frontend-comprehensive.spec.js
npx playwright test e2e/backend-comprehensive.spec.js
npx playwright test e2e/pdf-comprehensive.spec.js
```

### Run with UI Mode
```bash
npx playwright test --ui
```

### Run Specific Test Case
```bash
npx playwright test -g "TC-F01"
```

## Prerequisites

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install -D @playwright/test --legacy-peer-deps
   npx playwright install
   ```

2. **Start Frontend** (automatic via webServer config):
   - The frontend will start automatically when running tests

3. **Start Backend** (manual):
   ```bash
   cd backend-java
   mvn spring-boot:run
   ```
   - Backend must be running on port 5000 for backend tests to pass

## Test Coverage

| Category | Test Cases | File |
|----------|-----------|------|
| Frontend UI | 25 | frontend-comprehensive.spec.js |
| Backend API | 22 | backend-comprehensive.spec.js |
| PDF Generation | 13 | pdf-comprehensive.spec.js |
| **Total** | **60** | |

## Notes

- **PDF tests** only run on Chromium browser (Firefox and WebKit are skipped)
- **Backend tests** require the Spring Boot server to be running
- **Frontend tests** automatically start the React development server
- All tests include proper error handling and timeout configurations
