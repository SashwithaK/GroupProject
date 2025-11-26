# 📡 API Reference Guide

Base URL: `http://localhost:5000`

---

## 1. Upload & Extract Form

### Request
```http
POST /extract
Content-Type: multipart/form-data

file: [binary image data]
```

### Response (200 OK)
```json
{
  "source_filename": "patient_form.jpg",
  "raw": "Full extracted OCR text...",
  "patient": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "address": "123 Main Street, Suite 100",
    "zip_code": "12345"
  },
  "insurance": {
    "name": "Blue Cross Blue Shield"
  },
  "clinician": {
    "name": "Dr. Jane Smith",
    "npi": "1234567890"
  },
  "consent_text": "By providing my signature below, I consent to..."
}
```

### Error Response (400)
```json
{
  "error": "No file provided"
}
```

### cURL Example
```bash
curl -X POST http://localhost:5000/extract \
  -F "file=@path/to/form.jpg"
```

### JavaScript Example
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/extract', {
  method: 'POST',
  body: formData
});

const data = await response.json();
```

---

## 2. Get All Forms

### Request
```http
GET /api/forms
```

### Response (200 OK)
```json
[
  {
    "id": 1,
    "original_filename": "form_001.jpg",
    "created_at": "2025-11-18 10:30:00",
    "updated_at": "2025-11-18 10:30:00"
  },
  {
    "id": 2,
    "original_filename": "form_002.jpg",
    "created_at": "2025-11-18 11:45:00",
    "updated_at": "2025-11-18 11:45:00"
  }
]
```

### Query Parameters
- None

### cURL Example
```bash
curl http://localhost:5000/api/forms
```

### JavaScript Example
```javascript
const response = await fetch('/api/forms');
const forms = await response.json();
console.log(forms);
```

---

## 3. Get Single Form

### Request
```http
GET /api/forms/:id
```

### Path Parameters
- `id` (number, required): Form ID

### Response (200 OK)
```json
{
  "id": 1,
  "original_filename": "form_001.jpg",
  "extracted_json": {
    "source_filename": "form_001.jpg",
    "raw": "...",
    "patient": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-123-4567",
      "address": "123 Main Street",
      "zip_code": "12345"
    },
    "insurance": {"name": "Blue Cross"},
    "clinician": {"name": "Dr. Smith", "npi": "123"},
    "consent_text": "By providing..."
  },
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:30:00"
}
```

### Error Response (404)
```json
{
  "error": "Form not found"
}
```

### cURL Example
```bash
curl http://localhost:5000/api/forms/1
```

### JavaScript Example
```javascript
const response = await fetch('/api/forms/1');
const form = await response.json();
```

---

## 4. Create Form (Save Extracted Data)

### Request
```http
POST /api/forms
Content-Type: application/json

{
  "original_filename": "form_001.jpg",
  "extracted_json": {
    "source_filename": "form_001.jpg",
    "patient": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  }
}
```

### Response (201 Created)
```json
{
  "id": 1,
  "original_filename": "form_001.jpg",
  "extracted_json": { ... },
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:30:00"
}
```

### Error Response (400)
```json
{
  "error": "Missing required fields"
}
```

### cURL Example
```bash
curl -X POST http://localhost:5000/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "original_filename": "form.jpg",
    "extracted_json": {"patient": {"first_name": "John"}}
  }'
```

### JavaScript Example
```javascript
const response = await fetch('/api/forms', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    original_filename: 'form.jpg',
    extracted_json: {
      patient: { first_name: 'John' }
    }
  })
});

const newForm = await response.json();
```

---

## 5. Update Form

### Request
```http
PUT /api/forms/:id
Content-Type: application/json

{
  "extracted_json": {
    "patient": {
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com"
    }
  }
}
```

### Path Parameters
- `id` (number, required): Form ID

### Response (200 OK)
```json
{
  "id": 1,
  "original_filename": "form_001.jpg",
  "extracted_json": {
    "patient": {
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com"
    }
  },
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:31:15"
}
```

### Error Response (404)
```json
{
  "error": "Form not found"
}
```

### cURL Example
```bash
curl -X PUT http://localhost:5000/api/forms/1 \
  -H "Content-Type: application/json" \
  -d '{
    "extracted_json": {"patient": {"first_name": "Jane"}}
  }'
```

### JavaScript Example
```javascript
const response = await fetch('/api/forms/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    extracted_json: {
      patient: { first_name: 'Jane' }
    }
  })
});

const updated = await response.json();
```

---

## 6. Delete Form

### Request
```http
DELETE /api/forms/:id
```

### Path Parameters
- `id` (number, required): Form ID

### Response (200 OK)
```json
{
  "message": "Form deleted successfully"
}
```

### Error Response (404)
```json
{
  "error": "Form not found"
}
```

### cURL Example
```bash
curl -X DELETE http://localhost:5000/api/forms/1
```

### JavaScript Example
```javascript
const response = await fetch('/api/forms/1', {
  method: 'DELETE'
});

const result = await response.json();
```

---

## 7. Search Forms

### Request
```http
GET /api/forms/search?q=query
```

### Query Parameters
- `q` (string, required): Search query (searches in filename)

### Response (200 OK)
```json
[
  {
    "id": 1,
    "original_filename": "patient_form_001.jpg",
    "created_at": "2025-11-18 10:30:00",
    "updated_at": "2025-11-18 10:30:00"
  }
]
```

### cURL Example
```bash
curl "http://localhost:5000/api/forms/search?q=patient"
```

### JavaScript Example
```javascript
const response = await fetch('/api/forms/search?q=patient');
const results = await response.json();
```

---

## 8. Get Statistics

### Request
```http
GET /api/stats
```

### Response (200 OK)
```json
{
  "total_forms": 42
}
```

### cURL Example
```bash
curl http://localhost:5000/api/stats
```

### JavaScript Example
```javascript
const response = await fetch('/api/stats');
const stats = await response.json();
console.log(`Total forms: ${stats.total_forms}`);
```

---

## 9. Health Check

### Request
```http
GET /health
```

### Response (200 OK)
```json
{
  "status": "ok"
}
```

### cURL Example
```bash
curl http://localhost:5000/health
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful request |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Backend error |

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Description of what went wrong"
}
```

### JavaScript Error Handling Example
```javascript
try {
  const response = await fetch('/api/forms/999');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  const data = await response.json();
  console.log(data);
} catch (err) {
  console.error('Error:', err.message);
}
```

---

## Rate Limiting

Currently no rate limiting. In production, consider implementing:
- Per-IP request limits
- Per-user authentication tokens
- Exponential backoff for retries

---

## CORS Headers

All endpoints support CORS. Allowed headers:
- `Content-Type`
- `Authorization` (when added)

---

## Complete Workflow Example

```javascript
// 1. Upload form
const formData = new FormData();
formData.append('file', imageFile);
const extractRes = await fetch('/extract', {
  method: 'POST',
  body: formData
});
const extracted = await extractRes.json();

// 2. Save to database
const saveRes = await fetch('/api/forms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    original_filename: extracted.source_filename,
    extracted_json: extracted
  })
});
const saved = await saveRes.json();
console.log('Saved with ID:', saved.id);

// 3. Fetch all forms
const allRes = await fetch('/api/forms');
const all = await allRes.json();
console.log('Total forms:', all.length);

// 4. Update a form
const updateRes = await fetch(`/api/forms/${saved.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    extracted_json: { ...extracted, modified: true }
  })
});

// 5. Delete form
await fetch(`/api/forms/${saved.id}`, { method: 'DELETE' });
```

---

## Testing with Postman

1. Import these endpoints into Postman
2. Set `{{base_url}}` to `http://localhost:5000`
3. Test each endpoint with sample data

---

For questions or issues, check the main README.md or contact support!
