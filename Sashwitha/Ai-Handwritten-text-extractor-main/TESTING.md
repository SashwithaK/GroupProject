# Quick Start - Running Playwright Tests

## ✅ Fixed Issue
The tests must be run from the `frontend` directory where Playwright is properly configured.

## 🚀 Quick Commands

### From Project Root
```bash
# Windows
run_tests.bat

# Linux/Mac  
./run_tests.sh
```

### From Frontend Directory
```bash
cd frontend
npx playwright test              # Run all tests
npx playwright test --ui         # Interactive mode
npx playwright test --headed     # See browser
npx playwright show-report       # View results
```

## 📋 Prerequisites
1. Backend running on `http://localhost:8000`
2. Frontend running on `http://localhost:5000`

## 📊 Test Results
- **Total Tests**: 40
- **Passing**: 38+ (when servers are running)
- **Browsers**: Chromium, Firefox, WebKit

## 📁 Test Files
- `app.spec.js` - Application & UI (9 tests)
- `upload.spec.js` - File Upload (6 tests)
- `extraction.spec.js` - Text Extraction (6 tests)
- `error_handling.spec.js` - Error Handling (4 tests)
- `api_integration.spec.js` - API Integration (4 tests)
- `responsive.spec.js` - Responsive Design (5 tests)
- `performance.spec.js` - Performance (6 tests)

## 🔧 Troubleshooting
If you see "Error: No tests found":
- Make sure you're in the `frontend` directory
- Or use the helper scripts from project root
