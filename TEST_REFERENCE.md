# Quick Test Reference

## Running Tests

### Prerequisites
Make sure both backend and frontend are running:

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Should run on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Should run on http://localhost:5000
```

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test Files
```bash
# Records display and editing tests
npx playwright test frontend/records.spec.js

# Export functionality tests
npx playwright test frontend/export.spec.js

# Integration/E2E tests
npx playwright test frontend/integration.spec.js

# Backend API tests
npx playwright test backend/records.spec.js
npx playwright test backend/results.spec.js
npx playwright test backend/upload.spec.js
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### View Test Report
```bash
npx playwright show-report
```

## Test IDs Quick Reference

### Upload Section
- `upload-tab` - Upload tab button
- `results-tab` - Results tab button
- `file-input` - File input element
- `upload-button` - Upload & Extract button

### Results Section
- `extraction-result` - Extraction result container
- `toggle-json-view` - Toggle between JSON/Table view
- `download-json` - Download JSON button (current result)
- `download-csv` - Download CSV button (current result)

### Records List
- `empty-records-message` - Empty state message
- `records-list` - Records container
- `record-{id}` - Individual record card (e.g., `record-1`)
- `edit-record-{id}` - Edit button for specific record
- `download-json-{id}` - JSON download for specific record
- `download-csv-{id}` - CSV download for specific record
- `delete-record-{id}` - Delete button for specific record

### Edit Mode
- `edit-mode` - Edit mode container
- `save-edit` - Save changes button
- `cancel-edit` - Cancel editing button

## Common Test Patterns

### Test Upload Flow
```javascript
await page.getByTestId('file-input').setInputFiles('test-image.png');
await page.getByTestId('upload-button').click();
await expect(page.getByTestId('extraction-result')).toBeVisible();
```

### Test Record Display
```javascript
await page.getByTestId('results-tab').click();
await expect(page.getByTestId('records-list')).toBeVisible();
await expect(page.getByTestId('record-1')).toBeVisible();
```

### Test Edit Functionality
```javascript
await page.getByTestId('edit-record-1').click();
await expect(page.getByTestId('edit-mode')).toBeVisible();
// Make changes...
await page.getByTestId('save-edit').click();
```

### Test Export
```javascript
const downloadPromise = page.waitForEvent('download');
await page.getByTestId('download-json').click();
const download = await downloadPromise;
```

## Troubleshooting

### Tests Failing to Find Elements
- Ensure frontend is running on correct port (5000)
- Check browser console for errors
- Verify test IDs match in App.jsx

### Backend Tests Failing
- Ensure backend is running on port 8000
- Check database is initialized
- Verify API endpoints are responding

### Download Tests Failing
- Check browser download settings
- Verify download event listeners
- Ensure proper MIME types

### Timestamp Tests Failing
- Check database.py has timestamp fixes
- Verify datetime is imported
- Check ISO format is used

## Expected Test Counts

- **Records Display**: 3 tests
- **End-to-End Flow**: 5 tests
- **Export Functionality**: 4 tests
- **Record Editing**: 3 tests
- **Records CRUD Operations**: 10 tests
- **Results Retrieval**: 5 tests
- **File Upload API**: 10 tests
- **Record Deletion**: 3 tests

**Total**: ~43 tests (all should pass ✅)
