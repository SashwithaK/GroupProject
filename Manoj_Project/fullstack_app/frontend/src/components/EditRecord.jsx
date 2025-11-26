import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditRecord() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forms/${id}`);
      if (!response.ok) throw new Error('Record not found');
      const data = await response.json();
      setRecord(data);
      setJsonText(JSON.stringify(data.extracted_json, null, 2));
      setError(null);
    } catch (err) {
      setError(err.message);
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Validate JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(jsonText);
      } catch (e) {
        setError('Invalid JSON: ' + e.message);
        return;
      }

      const response = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extracted_json: parsedJson,
        }),
      });

      if (!response.ok) throw new Error('Failed to update record');
      const updated = await response.json();
      setRecord(updated);
      alert('Record updated successfully!');
      navigate(`/view/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading record...</div>
      </div>
    );
  }

  if (error && !record) {
    return (
      <div className="dashboard-container">
        <div className="error-banner">{error}</div>
        <button className="btn primary" onClick={() => navigate('/records')}>
          ← Back to Records
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate('/records')}>
          ←
        </button>
        <h2>✏️ Edit Record #{record?.id}</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="record-info-card">
        <div className="info-grid">
          <div className="info-item">
            <label>Filename</label>
            <p>{record?.original_filename}</p>
          </div>
          <div className="info-item">
            <label>Created</label>
            <p>{record?.created_at}</p>
          </div>
        </div>
      </div>

      <div className="edit-card">
        <h3>📝 Edit Extracted JSON Data</h3>
        <textarea
          className="json-editor"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder="Edit JSON here..."
        />
        
        <div className="edit-actions">
          <button 
            className="btn primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button 
            className="btn secondary" 
            onClick={() => navigate(`/view/${id}`)}
          >
            ✕ Cancel
          </button>
        </div>
      </div>

      <div className="editor-help">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Edit the JSON data directly in the text area</li>
          <li>Ensure the JSON is valid before saving</li>
          <li>Click Save Changes to update the record</li>
        </ul>
      </div>
    </div>
  );
}
