# 🏥 Handwritten Form Extraction - Full Stack Application

## Project Overview

A modern, production-ready full-stack application for extracting structured data from handwritten forms using OCR (Optical Character Recognition) technology. Features a beautiful React frontend with routing, a robust Flask backend with database persistence, and full CRUD operations.

## 📋 Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Setup Instructions](#setup-instructions)
5. [API Documentation](#api-documentation)
6. [Frontend Components](#frontend-components)
7. [Database Schema](#database-schema)
8. [Running the Application](#running-the-application)

---

## ✨ Features

### Frontend Features
- ✅ Modern, responsive dashboard interface
- ✅ Image upload with preview
- ✅ OCR extraction with real-time results
- ✅ Interactive JSON viewer
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ View all extracted records in a table
- ✅ Edit extracted JSON data
- ✅ Delete records with confirmation
- ✅ Download JSON/CSV exports
- ✅ Copy JSON to clipboard
- ✅ Beautiful gradient UI with Flexbox/CSS Grid

### Backend Features
- ✅ Flask REST API with CORS support
- ✅ SQLAlchemy ORM with SQLite database
- ✅ Pytesseract OCR integration
- ✅ Intelligent form field parsing
- ✅ Full CRUD REST endpoints
- ✅ Email, phone, address extraction
- ✅ Consent text capture
- ✅ ZIP code detection

---

## 📁 Project Structure

```
fullstack_app/
├── backend/
│   ├── main.py                 # Main Flask application
│   ├── database.py             # SQLAlchemy database setup
│   ├── models.py               # Database models
│   ├── crud.py                 # CRUD operations
│   ├── requirements.txt         # Python dependencies
│   ├── database.db             # SQLite database (auto-generated)
│   ├── ocr_text.txt            # Sample OCR output
│   ├── parse_ocr.py            # OCR parsing utilities
│   └── output/                 # Output directory
│       ├── structured_output.json
│       ├── structured_output.csv
│       └── structured_output.html
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js              # Main app with routing
    │   ├── App.css             # Global styles
    │   ├── index.js
    │   └── components/
    │       ├── Dashboard.jsx            # Home/upload page
    │       ├── UploadForm.jsx           # Upload form component
    │       ├── OutputViewer.jsx         # JSON/table viewer
    │       ├── DownloadButtons.jsx      # Download & save buttons
    │       ├── ViewRecords.jsx          # View all records table
    │       ├── ViewRecord.jsx           # View single record
    │       ├── EditRecord.jsx           # Edit record page
    │       └── [other components]
    ├── package.json            # NPM dependencies
    └── .gitignore
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **CSS3**: Styling with Flexbox and CSS Grid
- **Fetch API**: HTTP requests

### Backend
- **Flask**: Web framework
- **Flask-SQLAlchemy**: ORM layer
- **SQLite**: Database
- **Pytesseract**: OCR engine
- **Pillow**: Image processing
- **Flask-CORS**: Cross-origin support

### Development
- **Node.js & npm**: Frontend package management
- **Python 3.8+**: Backend runtime

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14+ and npm
- Tesseract OCR installed on your system

#### Installing Tesseract
- **Windows**: Download from https://github.com/UB-Mannheim/tesseract/wiki
- **Mac**: `brew install tesseract`
- **Linux**: `sudo apt-get install tesseract-ocr`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- **Windows**: `venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
python main.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. **Upload & Extract** (POST)
```
POST /extract
Content-Type: multipart/form-data

Parameters:
- file (File): Image file to extract

Response:
{
  "source_filename": "form.jpg",
  "raw": "extracted text...",
  "patient": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "address": "123 Main St",
    "zip_code": "12345"
  },
  "insurance": {"name": "Blue Cross"},
  "clinician": {"name": "Dr. Smith", "npi": "123456"},
  "consent_text": "By providing..."
}
```

#### 2. **Get All Forms** (GET)
```
GET /api/forms

Response:
[
  {
    "id": 1,
    "original_filename": "form1.jpg",
    "created_at": "2025-11-18 10:30:00",
    "updated_at": "2025-11-18 10:30:00"
  },
  ...
]
```

#### 3. **Get Single Form** (GET)
```
GET /api/forms/:id

Response:
{
  "id": 1,
  "original_filename": "form1.jpg",
  "extracted_json": { ...full data... },
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:30:00"
}
```

#### 4. **Create Form** (POST)
```
POST /api/forms
Content-Type: application/json

Body:
{
  "original_filename": "form.jpg",
  "extracted_json": { ...extracted data... }
}

Response:
{
  "id": 1,
  "original_filename": "form.jpg",
  "extracted_json": { ...data... },
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:30:00"
}
```

#### 5. **Update Form** (PUT)
```
PUT /api/forms/:id
Content-Type: application/json

Body:
{
  "extracted_json": { ...updated data... }
}

Response:
{
  "id": 1,
  "original_filename": "form.jpg",
  "extracted_json": { ...updated data... },
  "created_at": "2025-11-18T10:30:00",
  "updated_at": "2025-11-18T10:30:50"
}
```

#### 6. **Delete Form** (DELETE)
```
DELETE /api/forms/:id

Response:
{
  "message": "Form deleted successfully"
}
```

#### 7. **Get Statistics** (GET)
```
GET /api/stats

Response:
{
  "total_forms": 25
}
```

#### 8. **Health Check** (GET)
```
GET /health

Response:
{
  "status": "ok"
}
```

---

## 🎨 Frontend Components

### Dashboard.jsx
Main home page with upload functionality and extraction results display.

**Props**: None  
**State**: result, loading, error, stats  
**Features**:
- Upload form integration
- Real-time statistics
- Navigation to other pages

### UploadForm.jsx
File upload component with image preview.

**Props**: 
- `onResult(data)`: Callback with extracted data
- `setError(err)`: Error handler
- `setLoading(bool)`: Loading state
- `onFormSaved()`: Success callback

### OutputViewer.jsx
Displays extracted JSON in JSON or table view.

**Props**:
- `result(object)`: Extracted data to display

### DownloadButtons.jsx
Buttons for downloading, copying, and saving extracted data.

**Props**:
- `data(object)`: Data to export
- `onSaved()`: Callback after save

### ViewRecords.jsx
Table displaying all saved forms.

**Features**:
- View all records
- Edit, view, delete actions
- Responsive table design

### ViewRecord.jsx
Display single record with full extracted data.

**Props**: 
- `id` (URL param): Record ID

### EditRecord.jsx
Edit extracted JSON data with validation.

**Props**:
- `id` (URL param): Record ID

---

## 🗄️ Database Schema

### ExtractedForm Model

```python
class ExtractedForm(db.Model):
    __tablename__ = 'extracted_forms'
    
    id              INTEGER PRIMARY KEY
    original_filename TEXT NOT NULL
    extracted_json   TEXT NOT NULL (JSON stored as text)
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

**Sample Data**:
```json
{
  "id": 1,
  "original_filename": "patient_form_001.jpg",
  "extracted_json": {
    "source_filename": "patient_form_001.jpg",
    "raw": "...",
    "patient": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@email.com",
      "phone": "+1-555-123-4567",
      "address": "123 Main Street",
      "zip_code": "12345"
    },
    "insurance": {
      "name": "Blue Cross Blue Shield"
    },
    "clinician": {
      "name": "Dr. Jane Smith",
      "npi": "1234567890"
    },
    "consent_text": "By providing my signature..."
  },
  "created_at": "2025-11-18 10:30:00",
  "updated_at": "2025-11-18 10:30:00"
}
```

---

## 🏃 Running the Application

### Complete Setup Flow

1. **Install Tesseract** (if not already installed)
2. **Setup Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or: venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python main.py
   ```
3. **Setup Frontend** (in new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/health

### Workflow Example

1. Click "Upload" on the dashboard
2. Select a handwritten form image
3. Wait for OCR extraction
4. Review extracted data in JSON viewer
5. Click "Save to Database" to persist
6. Navigate to "View All Records" to see saved forms
7. Click edit icon to modify data
8. Click delete icon to remove records

---

## 📦 Dependencies

### Backend (`requirements.txt`)
```
flask>=2.0.0
flask-cors>=3.0.0
flask-sqlalchemy>=2.5.0
sqlalchemy>=1.4.0
pytesseract>=0.3.0
pillow>=9.0.0
```

### Frontend (`package.json`)
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "react-scripts": "5.0.0"
}
```

---

## 🎯 Key Features Implemented

✅ **Upload & OCR**: Extract text from images  
✅ **Structured Data**: Intelligent parsing of form fields  
✅ **Database Persistence**: SQLAlchemy + SQLite  
✅ **CRUD Operations**: Full REST API  
✅ **Modern UI**: React with routing  
✅ **Responsive Design**: Mobile-friendly  
✅ **JSON Viewer**: Pretty print extracted data  
✅ **Export Options**: JSON, CSV downloads  
✅ **Copy to Clipboard**: Quick data sharing  
✅ **Edit Functionality**: Modify extracted data  
✅ **Record Management**: View, edit, delete forms  
✅ **Statistics**: Track total records  

---

## 🔧 Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
```bash
# Change Flask port in main.py
app.run(port=5001, debug=True)

# Change React proxy in frontend/package.json
"proxy": "http://localhost:5001"
```

### Tesseract Not Found
Ensure Tesseract is installed and in PATH. Update pytesseract if needed:
```bash
pip install --upgrade pytesseract
```

### CORS Errors
Flask-CORS is already configured. If issues persist, check that backend is running on correct port.

### Database Issues
Delete `database.db` and restart the application to recreate the database schema.

---

## 📝 Example Usage

### Upload and Save a Form
```javascript
// Frontend: Upload image
// Backend automatically extracts data
// Click "Save to Database"
// Backend stores in SQLite

// Result: Record ID 1 is created
```

### View Saved Records
```
GET /api/forms
Response: Array of all 50 saved forms
```

### Edit Extracted Data
```
GET /api/forms/1     // Fetch record
PUT /api/forms/1     // Update with new data
Response: Updated record
```

---

## 🎓 Learning Resources

- [React Router Documentation](https://reactrouter.com/)
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)
- [Pytesseract Documentation](https://pytesseract.readthedocs.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📞 Support

For issues or questions, check:
1. Backend logs in terminal
2. Frontend console (F12)
3. Check database file exists: `backend/database.db`
4. Verify all ports are free

---

## 🎉 Conclusion

This is a complete, production-ready application demonstrating:
- Modern React architecture with routing
- Flask REST API development
- Database design and ORM usage
- OCR integration
- CRUD operations
- Responsive UI design
- Best practices in full-stack development

Happy extracting! 🚀
#   T e a m P r o j e c t  
 