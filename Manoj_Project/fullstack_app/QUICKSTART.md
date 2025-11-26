# ⚡ Quick Start Guide

## 5-Minute Setup

### Step 1: Install Tesseract (Required for OCR)

**Windows**:
1. Download: https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer
3. Use default installation path

**Mac**:
```bash
brew install tesseract
```

**Linux**:
```bash
sudo apt-get install tesseract-ocr
```

---

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py
```

✅ Backend running on: **http://localhost:5000**

---

### Step 3: Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running on: **http://localhost:3000**

---

## Using the Application

### 📤 Upload Form
1. Go to **http://localhost:3000**
2. Click "Choose Image"
3. Select a handwritten form image
4. Wait for extraction
5. Review extracted data

### 💾 Save to Database
1. After extraction, click **"Save to Database"**
2. Record is saved automatically

### 📋 View All Records
1. Click **"View All Records"** in navigation
2. See table of all saved forms
3. Click action buttons:
   - 👁️ View full details
   - ✏️ Edit data
   - 🗑️ Delete record

### ✏️ Edit Record
1. Click edit (pencil) icon
2. Modify JSON data in editor
3. Click **"Save Changes"**

### 📥 Download Data
1. After extraction, choose:
   - **Download JSON**: Save as .json file
   - **Download CSV**: Save as .csv file
   - **Copy JSON**: Copy to clipboard

---

## File Structure

```
backend/
├── main.py           # Main Flask app with routes
├── database.py       # Database setup
├── models.py         # SQLAlchemy models
├── crud.py           # Database operations
├── requirements.txt  # Python packages
└── database.db       # SQLite database (auto-created)

frontend/
├── src/
│   ├── App.js        # Main app with routing
│   ├── App.css       # Styles
│   └── components/   # React components
├── package.json      # NPM packages
└── public/
    └── index.html    # HTML template
```

---

## API Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/extract` | Upload & extract OCR |
| GET | `/api/forms` | Get all records |
| GET | `/api/forms/:id` | Get one record |
| POST | `/api/forms` | Save new record |
| PUT | `/api/forms/:id` | Update record |
| DELETE | `/api/forms/:id` | Delete record |

---

## Common Issues & Fixes

### "Tesseract not found"
- Windows: Add to PATH or install to default location
- Mac/Linux: Run `brew install tesseract` or `sudo apt-get install tesseract-ocr`

### Port 5000/3000 already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in main.py
app.run(port=5001)
```

### Database errors
Delete `backend/database.db` and restart - it auto-recreates

### CORS errors
Already configured with Flask-CORS, just restart both servers

---

## Example Workflow

1. ✅ Backend running on 5000
2. ✅ Frontend running on 3000
3. 📤 Upload handwritten form image
4. ⏳ Wait 3-5 seconds for OCR
5. ✅ See extracted data in JSON viewer
6. 💾 Click "Save to Database"
7. 📋 Go to "View All Records"
8. ✏️ Edit or delete as needed
9. 📥 Download JSON/CSV if needed

---

## Database Info

- **Type**: SQLite
- **File**: `backend/database.db`
- **Schema**: 
  - id (primary key)
  - original_filename
  - extracted_json (JSON stored as text)
  - created_at, updated_at (timestamps)

---

## Next Steps

1. Upload your first form
2. Edit extracted data if needed
3. Download as JSON
4. Explore the code
5. Customize as needed!

---

Need help? Check the full README.md for detailed documentation!
