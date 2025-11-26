import re
import json
import csv
from html import escape
from pathlib import Path

BASE = Path(__file__).resolve().parent
INPUT = BASE / "ocr_text.txt"
OUT_DIR = BASE / "output"
OUT_DIR.mkdir(exist_ok=True)

raw_text = INPUT.read_text(encoding="utf-8")
lines = [l.strip() for l in raw_text.splitlines()]

# Helpers

def get_after_label(label_variants, max_lines=3):
    lower = [l.lower() for l in lines]
    for i, l in enumerate(lower):
        for v in label_variants:
            if v in l:
                # grab next non-empty lines
                j = i + 1
                found = []
                while j < len(lines) and len(found) < max_lines:
                    if lines[j]:
                        found.append(lines[j])
                    j += 1
                return " ".join(found) if found else None
    return None


def normalize_email(s):
    if not s:
        return None
    s = s.replace(' ', '').replace(' .', '.').replace(',.', '.')
    s = s.replace('[at]', '@').replace('(at)', '@')
    s = s.replace('mailto:', '')
    s = s.strip().lower()
    # try to find email-like substring
    m = re.search(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', s)
    return m.group(0) if m else s


def extract_phone(s):
    if not s:
        return None
    # remove non-digit except +
    digits = re.sub(r'[^0-9+]', '', s)
    # prefer 10-digit numbers
    only = re.sub(r'[^0-9]', '', digits)
    if len(only) >= 10:
        # take last 10 digits
        phone10 = only[-10:]
        return f"+1-{phone10[0:3]}-{phone10[3:6]}-{phone10[6:]}"
    if len(only) >= 7:
        return only
    return digits or None


def find_email_in_text():
    # scan lines for @
    for l in lines:
        if '@' in l:
            return normalize_email(l)
    # fallback: any token that looks like email
    m = re.search(r'[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}', raw_text)
    return normalize_email(m.group(0)) if m else None


# Extraction
first = get_after_label(['first name', 'first narne', 'first'])
last = get_after_label(['last name', 'last'])
email = find_email_in_text()
phone_raw = get_after_label(['phone number', 'phone'])
phone = extract_phone(phone_raw)
insurance = get_after_label(['insurance plan name', 'insurance plan'])
clinician = get_after_label(['clinican name', 'clinician name', 'clinican'])
clinician_npi = get_after_label(['npi'])
consent = None
# try to capture a long paragraph starting with "By providing" or "By envoling"
m = re.search(r'(By providing[\s\S]{0,400})', raw_text, re.IGNORECASE)
if not m:
    m = re.search(r'(By envoling[\s\S]{0,400})', raw_text, re.IGNORECASE)
if m:
    # take up to next double newline
    consent = m.group(1).strip()

# Address heuristics: look for a line with 5-digit zip
zip_match = re.search(r'\b(\d{5})(?:-\d{4})?\b', raw_text)
zip_code = zip_match.group(1) if zip_match else None
# Find lines that look like address/city
address_candidates = []
for l in lines:
    if any(ch.isdigit() for ch in l) and any(c.isalpha() for c in l):
        address_candidates.append(l)
    elif ',' in l and any(word.isupper() for word in l.split()):
        address_candidates.append(l)

address = None
if address_candidates:
    address = ' | '.join(address_candidates[:3])

# Build structured object
structured = {
    "source_filename": INPUT.name,
    "raw": raw_text,
    "patient": {
        "first_name": first if first else None,
        "last_name": last if last else None,
        "email": email,
        "phone": phone,
        "address": address,
        "zip_code": zip_code,
    },
    "insurance": {
        "name": insurance
    },
    "clinician": {
        "name": clinician,
        "npi": clinician_npi
    },
    "consent_text": consent
}

# Write JSON
json_path = OUT_DIR / "structured_output.json"
json_path.write_text(json.dumps(structured, indent=2), encoding="utf-8")
print(f"Wrote JSON to {json_path}")

# Write CSV (single-row flattened)
csv_path = OUT_DIR / "structured_output.csv"
with csv_path.open('w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    headers = [
        'source_filename', 'first_name', 'last_name', 'email', 'phone', 'address', 'zip_code',
        'insurance_name', 'clinician_name', 'clinician_npi', 'consent_text'
    ]
    writer.writerow(headers)
    writer.writerow([
        structured['source_filename'], structured['patient']['first_name'], structured['patient']['last_name'],
        structured['patient']['email'], structured['patient']['phone'], structured['patient']['address'], structured['patient']['zip_code'],
        structured['insurance']['name'], structured['clinician']['name'], structured['clinician']['npi'], structured['consent_text']
    ])
print(f"Wrote CSV to {csv_path}")

# Write simple HTML preview
html_path = OUT_DIR / "structured_output.html"
with html_path.open('w', encoding='utf-8') as f:
    f.write('<!doctype html>\n<html><head><meta charset="utf-8"><title>OCR Parse Preview</title></head><body>')
    f.write('<h1>Parsed Form</h1>')
    f.write('<h2>Patient</h2>')
    f.write('<ul>')
    for k, v in structured['patient'].items():
        f.write(f'<li><strong>{escape(k)}:</strong> {escape(str(v))}</li>')
    f.write('</ul>')
    f.write('<h2>Insurance</h2>')
    f.write(f'<p>{escape(str(structured["insurance"]["name"]))}</p>')
    f.write('<h2>Clinician</h2>')
    f.write('<ul>')
    f.write(f'<li><strong>name:</strong> {escape(str(structured["clinician"]["name"]))}</li>')
    f.write(f'<li><strong>npi:</strong> {escape(str(structured["clinician"]["npi"]))}</li>')
    f.write('</ul>')
    f.write('<h2>Consent</h2>')
    f.write(f'<pre>{escape(str(structured.get("consent_text") or ""))}</pre>')
    f.write('<h2>Raw OCR</h2>')
    f.write(f'<pre>{escape(structured["raw"])}</pre>')
    f.write('</body></html>')
print(f"Wrote HTML to {html_path}")
