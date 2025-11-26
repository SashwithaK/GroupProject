import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from './UploadForm';
import OutputViewer from './OutputViewer';
import DownloadButtons from './DownloadButtons';

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total_forms: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleFormSaved = () => {
    fetchStats();
    setResult(null);
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏥 Handwritten Form Extraction</h1>
          <p className="subtitle">Extract and manage handwritten form data with OCR</p>
        </div>
        <div className="header-stats">
          <span className="stat">📊 Records: <strong>{stats.total_forms}</strong></span>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className="nav-btn active"
          onClick={() => document.querySelector('.upload-section').scrollIntoView()}
        >
          ➕ Upload
        </button>
        <button 
          className="nav-btn"
          onClick={() => navigate('/records')}
        >
          📋 View All Records
        </button>
      </div>

      <div className="upload-section">
        <UploadForm 
          onResult={setResult} 
          setError={setError} 
          setLoading={setLoading}
          onFormSaved={handleFormSaved}
        />
      </div>

      {result && (
        <div className="result-section">
          <div className="result-header">
            <h2>✅ Extraction Successful!</h2>
            <p className="result-subtitle">Review the extracted data below and save it to your database</p>
          </div>

          <OutputViewer result={result} />

          {result && (
            <div style={{ marginTop: 20 }}>
              <DownloadButtons data={result} onSaved={handleFormSaved} />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-section">
          <div className="error-banner">{error}</div>
          <button 
            className="btn secondary"
            onClick={() => setError(null)}
          >
            ✕ Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
