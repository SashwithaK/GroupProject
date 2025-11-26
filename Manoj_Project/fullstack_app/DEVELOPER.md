# 👨‍💻 Developer Guide

A comprehensive guide for developers working on or extending this project.

---

## Project Architecture

### Frontend Architecture
```
App.js (Router)
├── Dashboard (/)
│   ├── UploadForm (upload & extract)
│   ├── OutputViewer (display results)
│   └── DownloadButtons (export & save)
├── ViewRecords (/records)
│   └── Records Table
├── ViewRecord (/view/:id)
│   └── Display Record Detail
└── EditRecord (/edit/:id)
    └── Edit JSON Editor
```

### Backend Architecture
```
main.py (Flask App)
├── /extract (POST) - OCR extraction
├── /api/forms (GET/POST) - List/Create
├── /api/forms/:id (GET/PUT/DELETE) - CRUD
├── /api/stats (GET) - Statistics
└── /health (GET) - Health check

Database Layer
├── database.py - SQLAlchemy setup
├── models.py - ExtractedForm model
└── crud.py - CRUD operations
```

---

## Frontend Development

### Component Lifecycle

#### Dashboard
1. Mounts → Fetch stats
2. User uploads file
3. UploadForm calls backend /extract
4. Result displayed in OutputViewer
5. User saves to database

#### ViewRecords
1. Mounts → Fetch all forms
2. Render table
3. User clicks action buttons
4. Navigate or delete

#### EditRecord
1. Mounts → Fetch single record
2. Display JSON in editor
3. User edits JSON
4. Submit PUT request
5. Navigate back to view

### State Management

Currently using React hooks (useState, useEffect). For large apps, consider:
- Redux
- Context API
- Zustand

### Adding New Components

```javascript
// components/MyComponent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/endpoint');
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };
  
  return <div>Component content</div>;
}
```

### Adding New Routes

```javascript
// App.js
import MyComponent from './components/MyComponent';

<Routes>
  <Route path="/my-route" element={<MyComponent />} />
</Routes>
```

### Styling Guidelines

1. Use CSS variables from `:root`
2. Follow mobile-first responsive design
3. Use flexbox/grid for layouts
4. Class naming: `.component-name` or `.component__element`

### Common Fetch Patterns

```javascript
// GET request
const response = await fetch('/api/endpoint');
const data = await response.json();

// POST request with JSON
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

// PUT request
const response = await fetch('/api/endpoint/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedData)
});

// DELETE request
const response = await fetch('/api/endpoint/123', {
  method: 'DELETE'
});

// Error handling
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
}
```

---

## Backend Development

### Flask Structure

```python
# main.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, db
import crud

app = Flask(__name__)
CORS(app)
init_db(app)

# Routes
@app.route('/api/endpoint', methods=['GET'])
def get_endpoint():
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)
```

### Adding New Routes

```python
# main.py
@app.route('/api/new-endpoint', methods=['GET', 'POST'])
def new_endpoint():
    if request.method == 'POST':
        data = request.get_json()
        # Process data
        return jsonify({'result': 'success'}), 201
    else:
        # GET logic
        return jsonify(result), 200
```

### Database Operations

```python
# Using CRUD functions
from crud import create_form, get_form, get_all_forms, update_form, delete_form

# Create
new_form = create_form('filename.jpg', extracted_data)

# Read
form = get_form(form_id)
all_forms = get_all_forms()

# Update
updated = update_form(form_id, new_data)

# Delete
success = delete_form(form_id)
```

### Adding New Models

```python
# models.py
from database import db
from datetime import datetime

class NewModel(db.Model):
    __tablename__ = 'table_name'
    
    id = db.Column(db.Integer, primary_key=True)
    field1 = db.Column(db.String(255), nullable=False)
    field2 = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'field1': self.field1,
            'created_at': self.created_at.isoformat()
        }
```

### Error Handling

```python
@app.route('/api/endpoint/<int:id>', methods=['GET'])
def get_item(id):
    try:
        item = db.session.query(Item).get(id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        return jsonify(item.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Testing Routes

```python
# Using Flask test client
from main import app

def test_api():
    client = app.test_client()
    
    # Test GET
    response = client.get('/api/forms')
    assert response.status_code == 200
    
    # Test POST
    response = client.post('/api/forms', 
        json={'original_filename': 'test.jpg', 'extracted_json': {}})
    assert response.status_code == 201
```

---

## Common Tasks

### Task 1: Add New Database Field

1. Update model in `models.py`:
```python
new_field = db.Column(db.String(255))
```

2. Delete `database.db` to regenerate schema

3. Add to `to_dict()` method in model

4. Update routes to handle new field

### Task 2: Add New API Endpoint

1. Create route in `main.py`
2. Use existing CRUD functions or create new ones
3. Add proper error handling
4. Test with curl/Postman
5. Document in API.md

### Task 3: Add Frontend Component

1. Create `.jsx` file in `src/components/`
2. Import in `App.js`
3. Add Route if new page
4. Add styling to `App.css`
5. Test navigation

### Task 4: Debug Issues

Backend:
```bash
# Check logs in terminal
# Add print statements
print(f"Debug: {variable}")

# Use Python debugger
import pdb; pdb.set_trace()
```

Frontend:
```javascript
// Use browser DevTools (F12)
console.log('Debug:', variable);

// React DevTools extension
// Network tab for API requests
```

### Task 5: Performance Optimization

Frontend:
- Use React.memo for components
- Implement lazy loading
- Optimize images
- Code splitting with React Router

Backend:
- Add database indexes
- Implement pagination for large datasets
- Cache frequently accessed data
- Use connection pooling

---

## Testing

### Frontend Testing

```javascript
// Using Jest + React Testing Library
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('renders upload form', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Upload/i)).toBeInTheDocument();
});
```

### Backend Testing

```python
# Using pytest
def test_extract_route(client):
    response = client.post('/extract', data={'file': image})
    assert response.status_code == 200
    assert 'patient' in response.json
```

Run tests:
```bash
# Frontend
npm test

# Backend
pytest
```

---

## Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy build/ folder
```

### Backend Deployment (Heroku/PythonAnywhere)

```bash
# Create Procfile
echo "web: gunicorn main:app" > Procfile

# Deploy
git push heroku main
```

### Production Checklist

- [ ] Set `debug=False` in Flask
- [ ] Use environment variables for secrets
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure database backups
- [ ] Rate limiting on API
- [ ] Input validation on backend

---

## Security Best Practices

1. **Input Validation**
   - Validate file types on upload
   - Sanitize JSON input
   - Limit file size

2. **Authentication**
   - Add JWT tokens for API
   - Implement user authentication
   - Protect sensitive endpoints

3. **CORS Configuration**
   - Specify allowed origins
   - Only allow necessary methods
   - Validate headers

4. **Database Security**
   - Use parameterized queries (SQLAlchemy does this)
   - Never expose database errors
   - Regular backups

5. **Error Handling**
   - Don't expose stack traces to frontend
   - Log errors securely
   - Return generic error messages

---

## Performance Monitoring

### Frontend
```javascript
// Measure performance
const start = performance.now();
await fetch('/api/forms');
console.log(`API call took ${performance.now() - start}ms`);
```

### Backend
```python
import time

@app.before_request
def start_timer():
    request.start_time = time.time()

@app.after_request
def log_request(response):
    elapsed = time.time() - request.start_time
    print(f"Request took {elapsed:.2f}s")
    return response
```

---

## Useful Commands

```bash
# Frontend
npm start              # Dev server
npm run build         # Production build
npm test              # Run tests
npm install package   # Install package

# Backend
python main.py        # Run server
python -c "..."       # Execute Python code
pip freeze            # List packages
pip install -r req... # Install dependencies
```

---

## Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [MDN Web Docs](https://developer.mozilla.org)
- [Python Docs](https://docs.python.org)

---

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request
5. Code review
6. Merge to main

---

## Code Style

### JavaScript/React
- Use ES6 syntax
- Functional components with hooks
- camelCase for variables
- PascalCase for components

### Python
- Follow PEP 8
- snake_case for variables
- Type hints encouraged
- Docstrings for functions

---

## Troubleshooting Development

| Issue | Solution |
|-------|----------|
| Port in use | Kill process or change port |
| Module not found | Install dependencies |
| CORS error | Check backend is running |
| Database locked | Delete database.db and restart |
| API timeout | Check network tab in DevTools |

---

Happy coding! 🚀
