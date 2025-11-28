# Playwright Test Suite - AI Handwritten Text Extractor

## Overview
This test suite contains **40 comprehensive test cases** organized into 10 test suites covering all aspects of the application.

## Test Files

### 1. `app.spec.js` - Application Loading & UI Components (9 tests)
- **TC-01 to TC-04**: Application Loading and Initialization
  - Application loads successfully
  - Main header visibility
  - Logo display
  - Default tab state
  
- **TC-05 to TC-09**: UI Components and Layout
  - Navigation tabs presence
  - Tab switching functionality
  - Upload section visibility
  - Database badge display
  - Header subtitle

### 2. `upload.spec.js` - File Upload Interface & Functionality (6 tests)
- **TC-10 to TC-12**: File Upload Interface
  - File upload area visibility
  - Upload instructions
  - File input validation
  
- **TC-13 to TC-15**: File Upload Functionality
  - File selection UI updates
  - Extract button appearance
  - Reset button functionality

### 3. `extraction.spec.js` - Text Extraction & Result Display (6 tests)
- **TC-16 to TC-18**: Text Extraction Features
  - Result area existence
  - Empty state display
  - Loading state during extraction
  
- **TC-19 to TC-21**: Result Display and Integration
  - Result section structure
  - File information display
  - Action buttons presence

### 4. `error_handling.spec.js` - Error Handling & Validation (4 tests)
- **TC-22 to TC-25**: Error Handling and Validation
  - Error alert dismissal
  - Invalid file type handling
  - Large file size validation
  - Backend unavailable error handling

### 5. `api_integration.spec.js` - Backend API Integration (4 tests)
- **TC-26 to TC-29**: Backend API Integration
  - Health check endpoint
  - Root endpoint information
  - Forms endpoint accessibility
  - CORS configuration

### 6. `responsive.spec.js` - Responsive Design & Cross-Browser (5 tests)
- **TC-30 to TC-34**: Responsive Design and Cross-Browser
  - Desktop layout (1920x1080)
  - Tablet layout (768x1024)
  - Mobile layout (375x667)
  - Mobile element interaction
  - Cross-browser compatibility

### 7. `performance.spec.js` - Performance & Optimization (6 tests)
- **TC-35 to TC-40**: Performance and Optimization
  - Page load time
  - Console error monitoring
  - Asset loading
  - Tab switching performance
  - Memory leak prevention
  - Application responsiveness

## Running the Tests

### Prerequisites
1. Start the backend server:
   ```bash
   cd backend
   python main.py
   # Backend should run on http://localhost:8000
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   # Frontend should run on http://localhost:5000
   ```

### Run All Tests

**From project root:**
```bash
# Windows
run_tests.bat

# Linux/Mac
./run_tests.sh
```

**From frontend directory:**
```bash
cd frontend
npx playwright test
```

### Run Specific Test File
```bash
cd frontend
npx playwright test tests/app.spec.js
npx playwright test tests/upload.spec.js
npx playwright test tests/extraction.spec.js
npx playwright test tests/error_handling.spec.js
npx playwright test tests/api_integration.spec.js
npx playwright test tests/responsive.spec.js
npx playwright test tests/performance.spec.js
```

### Run Tests in UI Mode
```bash
cd frontend
npx playwright test --ui
```

### Run Tests in Headed Mode
```bash
cd frontend
npx playwright test --headed
```

### Run Tests on Specific Browser
```bash
cd frontend
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View Test Report
```bash
cd frontend
npx playwright show-report
```

## Test Coverage Summary

| Category | Test Count | Coverage |
|----------|------------|----------|
| Application Loading & Initialization | 4 | ✅ Complete |
| UI Components & Layout | 5 | ✅ Complete |
| File Upload Interface | 3 | ✅ Complete |
| File Upload Functionality | 3 | ✅ Complete |
| Text Extraction Features | 3 | ✅ Complete |
| Result Display & Integration | 3 | ✅ Complete |
| Error Handling & Validation | 4 | ✅ Complete |
| Backend API Integration | 4 | ✅ Complete |
| Responsive Design & Cross-Browser | 5 | ✅ Complete |
| Performance & Optimization | 6 | ✅ Complete |
| **TOTAL** | **40** | **100%** |

## Configuration

The Playwright configuration (`playwright.config.js`) includes:
- **Base URL**: `http://localhost:5000`
- **Browsers**: Chromium, Firefox, WebKit
- **Trace**: Enabled for all tests
- **Screenshots**: Captured on failure
- **Video**: Retained on failure
- **Parallel Execution**: Enabled

## Notes

- Some tests (especially API integration tests) may fail if the backend is not running
- Performance tests have specific thresholds (e.g., page load < 3s)
- Cross-browser tests run on all configured browsers (Chromium, Firefox, WebKit)
- Tests use synthetic image data for file upload testing
