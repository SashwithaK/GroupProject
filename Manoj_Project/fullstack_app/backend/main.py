"""
Main Flask application with OCR extraction and CRUD database operations
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
import re
import json

# Import database and CRUD functions
from database import init_db, db
from models import ExtractedForm
import crud

app = Flask(__name__)
CORS(app)

# Initialize database
init_db(app)

# ==================== OCR EXTRACTION ROUTE ====================

@app.route("/extract", methods=["POST"])
def extract():
    """
    Extract text from uploaded image and perform OCR
    Returns structured JSON with extracted form data
    """
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Read the image file
        img = Image.open(io.BytesIO(file.read()))

        # Extract text using Tesseract OCR
        extracted_text = pytesseract.image_to_string(img)

        # Basic parsing heuristics to produce structured output
        raw = extracted_text
        lines = [l.strip() for l in raw.splitlines() if l.strip()]

        def find_after(labels, max_lines=2):
            lw = [l.lower() for l in lines]
            for i, l in enumerate(lw):
                for lab in labels:
                    if lab in l:
                        found = []
                        j = i + 1
                        while j < len(lines) and len(found) < max_lines:
                            if lines[j]:
                                found.append(lines[j])
                            j += 1
                        return " ".join(found) if found else None
            return None

        def normalize_email(s):
            if not s: return None
            s = s.replace(' ', '').replace(' .', '.').replace('[at]', '@').replace('(at)', '@')
            s = s.strip()
            m = re.search(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', s)
            return m.group(0) if m else s

        def extract_phone(s):
            if not s: return None
            only = re.sub(r'[^0-9+]', '', s)
            digits = re.sub(r'[^0-9]', '', only)
            if len(digits) >= 10:
                p10 = digits[-10:]
                return f"+1-{p10[0:3]}-{p10[3:6]}-{p10[6:]}"
            if digits:
                return digits
            return only or None

        first = find_after(['first name', 'first narne', 'first'])
        last = find_after(['last name', 'last'])
        email = None
        for l in lines:
            if '@' in l:
                email = normalize_email(l)
                break
        if not email:
            email = find_after(['email address', 'email'])
            email = normalize_email(email)

        phone_raw = find_after(['phone number', 'phone'])
        phone = extract_phone(phone_raw)

        insurance = find_after(['insurance plan name', 'insurance plan', 'insurance'])
        clinician = find_after(['clinican name', 'clinician name', 'clinican'])
        clinician_npi = find_after(['npi'])

        consent = None
        m = re.search(r'(By providing[\s\S]{0,400})', raw, re.IGNORECASE)
        if not m:
            m = re.search(r'(By envoling[\s\S]{0,400})', raw, re.IGNORECASE)
        if m:
            consent = m.group(1).strip()

        zip_match = re.search(r'\b(\d{5})(?:-\d{4})?\b', raw)
        zip_code = zip_match.group(1) if zip_match else None

        address_candidates = []
        for l in lines:
            if any(ch.isdigit() for ch in l) and any(c.isalpha() for c in l):
                address_candidates.append(l)
            elif ',' in l and any(word.isupper() for word in l.split()):
                address_candidates.append(l)
        address = ' | '.join(address_candidates[:3]) if address_candidates else None

        structured = {
            "source_filename": file.filename,
            "raw": raw,
            "patient": {
                "first_name": first,
                "last_name": last,
                "email": email,
                "phone": phone,
                "address": address,
                "zip_code": zip_code,
            },
            "insurance": {"name": insurance},
            "clinician": {"name": clinician, "npi": clinician_npi},
            "consent_text": consent
        }

        return jsonify(structured)
    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500


# ==================== CRUD OPERATIONS ====================

@app.route("/api/forms", methods=["GET"])
def get_forms():
    """Get all extracted forms"""
    try:
        forms = crud.get_all_forms()
        return jsonify([form.to_dict_flat() for form in forms]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/forms/<int:form_id>", methods=["GET"])
def get_form(form_id):
    """Get a single form by ID"""
    try:
        form = crud.get_form(form_id)
        if not form:
            return jsonify({"error": "Form not found"}), 404
        return jsonify(form.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/forms", methods=["POST"])
def create_form():
    """Create and save extracted form to database"""
    try:
        data = request.get_json()
        if not data or 'original_filename' not in data or 'extracted_json' not in data:
            return jsonify({"error": "Missing required fields"}), 400
        
        form = crud.create_form(data['original_filename'], data['extracted_json'])
        return jsonify(form.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/forms/<int:form_id>", methods=["PUT"])
def update_form(form_id):
    """Update an existing form"""
    try:
        data = request.get_json()
        if not data or 'extracted_json' not in data:
            return jsonify({"error": "Missing extracted_json field"}), 400
        
        form = crud.update_form(form_id, data['extracted_json'])
        if not form:
            return jsonify({"error": "Form not found"}), 404
        
        return jsonify(form.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/forms/<int:form_id>", methods=["DELETE"])
def delete_form(form_id):
    """Delete a form by ID"""
    try:
        success = crud.delete_form(form_id)
        if not success:
            return jsonify({"error": "Form not found"}), 404
        return jsonify({"message": "Form deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/forms/search", methods=["GET"])
def search_forms():
    """Search forms by filename"""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200
        
        forms = crud.search_forms(query)
        return jsonify([form.to_dict_flat() for form in forms]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get statistics about stored forms"""
    try:
        total = ExtractedForm.query.count()
        return jsonify({"total_forms": total}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== HEALTH CHECK ====================

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
