from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import os
import uuid
import json
import base64
from PIL import Image
from io import BytesIO
import requests
import tempfile
from dotenv import load_dotenv

load_dotenv()

try:
    from pdf2image import convert_from_path
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

from database import (
    init_db,
    insert_record,
    get_all_records,
    get_record_by_id,
    get_record_by_task_id,
    update_record,
    delete_record
)

# Import LangChain integration
from langchain_integration import get_extractor

app = FastAPI(title="Handwritten Form Extraction System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
RESULTS_DIR = os.path.join(BASE_DIR, "results")
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-VL-7B-Instruct"

EXTRACTION_PROMPT = """You are an AI expert at reading and extracting information from handwritten forms and documents.

TASK:
Carefully analyze this handwritten form image. Identify all visible fields, labels, and their corresponding handwritten values. Create field names based on what you see in the form.

INSTRUCTIONS:
1. Look for any printed or handwritten labels (like "Name:", "Date:", "Address:", etc.)
2. Extract the handwritten values next to each label
3. If you see fields without clear labels, create appropriate descriptive labels based on the content
4. Include ALL text you can read from the image
5. If text is unclear or illegible, mark the value as "unreadable"

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "fields": [
    {
       "label": "descriptive field name based on what you see",
       "value": "the actual handwritten text you read"
    }
  ]
}

CRITICAL RULES:
- Return ONLY valid JSON, no explanations or additional text
- Create labels dynamically based on what's actually in the image
- Do not assume or invent fields that aren't visible
- Extract exactly what you see, maintain original spelling and formatting
- Be thorough - include all visible text fields"""

class UpdateRecordRequest(BaseModel):
    raw_json: Dict[str, Any]

@app.get("/")
async def root():
    """Root endpoint with health check."""
    db_status = "connected"
    db_error = None
    try:
        import sqlite3
        from database import DATABASE_PATH
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        conn.close()
    except Exception as e:
        db_status = "disconnected"
        db_error = str(e)
        
    return {
        "message": "Handwritten Form Extraction API", 
        "status": "running",
        "database": {
            "status": db_status,
            "path": DATABASE_PATH,
            "error": db_error
        }
    }

def initialize_app():
    """Initialize application on startup."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(RESULTS_DIR, exist_ok=True)
    init_db()

initialize_app()

def extract_text_from_pdf(pdf_path: str, task_id: str = None) -> Dict[str, Any]:
    """
    Extract text from PDF by converting pages to images and processing each page.
    Uses LangChain integration with LangFuse tracing.
    """
    if not PDF_SUPPORT:
        return {
            "fields": [
                {"label": "PDF Error", "value": "pdf2image library not available"},
                {"label": "Solution", "value": "Install poppler-utils to enable PDF support"}
            ]
        }
    
    try:
        images = convert_from_path(pdf_path, dpi=200)
        
        if not images:
            return {
                "fields": [
                    {"label": "PDF Error", "value": "No pages found in PDF"}
                ]
            }
        
        # Save temporary image files
        temp_image_paths = []
        for page_num, img in enumerate(images, start=1):
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
                temp_image_path = temp_file.name
                img.save(temp_image_path, "JPEG", quality=95)
                temp_image_paths.append(temp_image_path)
        
        try:
            # Use LangChain integration for PDF extraction
            extractor = get_extractor()
            trace_name = f"extract_pdf_{task_id}" if task_id else "extract_pdf"
            
            result = extractor.extract_from_pdf_pages(
                page_images=temp_image_paths,
                trace_name=trace_name
            )
            
            return result
        finally:
            # Clean up temporary files
            for temp_path in temp_image_paths:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
    
    except Exception as e:
        return {
            "fields": [
                {"label": "PDF Processing Error", "value": str(e)},
                {"label": "Error Type", "value": type(e).__name__}
            ]
        }

def extract_text_from_image(image_path: str, task_id: str = None) -> Dict[str, Any]:
    """
    Extract text from handwritten form using LangChain with Hugging Face Qwen2-VL model.
    Includes LangFuse tracing for observability.
    Dynamically creates fields based on what the AI sees in the image.
    """
    try:
        # Use LangChain integration for extraction
        extractor = get_extractor()
        
        # Prepare trace metadata
        trace_name = "chat-completion-trace"
        trace_metadata = {
            "image_path": image_path,
            "task_id": task_id,
            "extraction_type": "single_image"
        }
        
        # Extract using LangChain
        result = extractor.extract_from_image(
            image_path=image_path,
            trace_name=trace_name,
            trace_metadata=trace_metadata
        )
        
        return result
    
    except Exception as e:
        return {
            "fields": [
                {"label": "Extraction Error", "value": str(e)},
                {"label": "Error Type", "value": type(e).__name__}
            ]
        }

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a handwritten form and extract text using AI.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    allowed_extensions = ['.png', '.jpg', '.jpeg', '.pdf']
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    task_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{task_id}{file_ext}")
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    try:
        if file_ext == '.pdf':
            extracted_data = extract_text_from_pdf(file_path, task_id=task_id)
        else:
            extracted_data = extract_text_from_image(file_path, task_id=task_id)
        
        # Ensure extracted_data has proper structure
        if not isinstance(extracted_data, dict):
            extracted_data = {"fields": []}
        if "fields" not in extracted_data:
            extracted_data["fields"] = []
        if not isinstance(extracted_data["fields"], list):
            extracted_data["fields"] = []
        
        result_file_path = os.path.join(RESULTS_DIR, f"{task_id}.json")
        with open(result_file_path, "w") as f:
            json.dump(extracted_data, f, indent=2)
        
        record_id = insert_record(task_id, extracted_data)
        
        return {
            "task_id": task_id,
            "record_id": record_id,
            "status": "success",
            "message": "File uploaded and processed successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/result/{task_id}")
async def get_result(task_id: str):
    """
    Get extraction result by task ID.
    """
    record = get_record_by_task_id(task_id)
    
    if not record:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return {
        "task_id": task_id,
        "record_id": record["id"],
        "data": record["raw_json"],
        "created_at": record["created_at"],
        "updated_at": record["updated_at"]
    }

@app.get("/records")
async def list_records():
    """
    List all extracted records.
    """
    records = get_all_records()
    return {"records": records, "count": len(records)}

@app.get("/records/{record_id}")
async def get_record(record_id: int):
    """
    Get a single record by ID.
    """
    record = get_record_by_id(record_id)
    
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    return record

@app.put("/records/{record_id}")
async def update_record_endpoint(record_id: int, request: UpdateRecordRequest):
    """
    Update an existing record.
    """
    existing_record = get_record_by_id(record_id)
    
    if not existing_record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    success = update_record(record_id, request.raw_json)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update record")
    
    updated_record = get_record_by_id(record_id)
    return updated_record

@app.delete("/records/{record_id}")
async def delete_record_endpoint(record_id: int):
    """
    Delete a record by ID.
    """
    success = delete_record(record_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Record not found")
    
    return {"message": "Record deleted successfully", "record_id": record_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
#
##(venv) PS C:\Users\Aseuro\Downloads\HandwrittenNotes\handwrittennotes\backend> uvicorn main:app --reload --port 8000 or python main.py##npm run dev