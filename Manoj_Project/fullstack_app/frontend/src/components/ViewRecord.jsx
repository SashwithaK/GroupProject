import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewRecord() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError(null);
    } catch (err) {
      setError(err.message);
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!record) return;
    const blob = new Blob([JSON.stringify(record.extracted_json, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form_${record.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyJSON = async () => {
    if (!record) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(record.extracted_json, null, 2));
      alert('JSON copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading record...</div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="dashboard-container">
        <div className="error-banner">{error || 'Record not found'}</div>
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
        <h2>👁️ View Record #{record.id}</h2>
      </div>

      <div className="record-info-card">
        <div className="info-grid">
          <div className="info-item">
            <label>Filename</label>
            <p>{record.original_filename}</p>
          </div>
          <div className="info-item">
            <label>Created</label>
            <p>{record.created_at}</p>
          </div>
          <div className="info-item">
            <label>Updated</label>
            <p>{record.updated_at}</p>
          </div>
        </div>
      </div>

      <div className="json-card">
        <div className="json-header">
          <h3>📄 Extracted Data</h3>
          <div className="json-actions">
            <button className="btn primary" onClick={downloadJSON}>
              📥 Download JSON
            </button>
            <button className="btn" onClick={copyJSON}>
              📋 Copy JSON
            </button>
            <button 
              className="btn secondary" 
              onClick={() => navigate(`/edit/${record.id}`)}
            >
              ✏️ Edit
            </button>
          </div>
        </div>
        <pre className="json-viewer">
          {JSON.stringify(record.extracted_json, null, 2)}
        </pre>
      </div>
    </div>
  );
}
