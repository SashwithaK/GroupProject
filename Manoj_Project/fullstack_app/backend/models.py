"""
SQLAlchemy models for the Handwritten Form Extraction app
"""
from database import db
from datetime import datetime
import json

class ExtractedForm(db.Model):
    """Model for storing extracted form data"""
    __tablename__ = 'extracted_forms'
    
    id = db.Column(db.Integer, primary_key=True)
    original_filename = db.Column(db.String(255), nullable=False)
    extracted_json = db.Column(db.Text, nullable=False)  # Stores JSON as text
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<ExtractedForm id={self.id} filename={self.original_filename}>'
    
    def to_dict(self):
        """Convert model to dictionary"""
        try:
            extracted_data = json.loads(self.extracted_json)
        except:
            extracted_data = self.extracted_json
        
        return {
            'id': self.id,
            'original_filename': self.original_filename,
            'extracted_json': extracted_data,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def to_dict_flat(self):
        """Convert model to flat dictionary for table view"""
        try:
            extracted_data = json.loads(self.extracted_json)
        except:
            extracted_data = self.extracted_json
        
        return {
            'id': self.id,
            'original_filename': self.original_filename,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }
