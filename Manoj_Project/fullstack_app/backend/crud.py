"""
CRUD operations for the Handwritten Form Extraction app
"""
from database import db
from models import ExtractedForm
import json
from datetime import datetime

def create_form(filename, extracted_data):
    """
    Create a new extracted form record in the database
    
    Args:
        filename: Original filename of the uploaded image
        extracted_data: Dictionary or JSON string of extracted data
    
    Returns:
        ExtractedForm object
    """
    if isinstance(extracted_data, dict):
        extracted_json = json.dumps(extracted_data)
    else:
        extracted_json = extracted_data
    
    form = ExtractedForm(
        original_filename=filename,
        extracted_json=extracted_json
    )
    db.session.add(form)
    db.session.commit()
    return form

def get_form(form_id):
    """
    Get a single form by ID
    
    Args:
        form_id: ID of the form
    
    Returns:
        ExtractedForm object or None
    """
    return ExtractedForm.query.get(form_id)

def get_all_forms():
    """
    Get all extracted forms
    
    Returns:
        List of ExtractedForm objects
    """
    return ExtractedForm.query.order_by(ExtractedForm.created_at.desc()).all()

def update_form(form_id, extracted_data):
    """
    Update an existing form's extracted data
    
    Args:
        form_id: ID of the form to update
        extracted_data: Dictionary or JSON string of new extracted data
    
    Returns:
        Updated ExtractedForm object or None
    """
    form = ExtractedForm.query.get(form_id)
    if not form:
        return None
    
    if isinstance(extracted_data, dict):
        form.extracted_json = json.dumps(extracted_data)
    else:
        form.extracted_json = extracted_data
    
    form.updated_at = datetime.utcnow()
    db.session.commit()
    return form

def delete_form(form_id):
    """
    Delete a form by ID
    
    Args:
        form_id: ID of the form to delete
    
    Returns:
        Boolean indicating success
    """
    form = ExtractedForm.query.get(form_id)
    if not form:
        return False
    
    db.session.delete(form)
    db.session.commit()
    return True

def search_forms(query):
    """
    Search forms by filename
    
    Args:
        query: Search query string
    
    Returns:
        List of ExtractedForm objects matching the query
    """
    return ExtractedForm.query.filter(
        ExtractedForm.original_filename.ilike(f'%{query}%')
    ).order_by(ExtractedForm.created_at.desc()).all()
