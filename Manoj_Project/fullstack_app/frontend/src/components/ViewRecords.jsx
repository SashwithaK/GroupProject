import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ViewRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/forms');
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setRecords(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete record');
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h2>📋 All Extracted Records</h2>
        <button className="btn primary" onClick={() => navigate('/')}>
          ➕ Upload New Form
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {records.length === 0 ? (
        <div className="empty-state">
          <p>No records found. Upload a form to get started!</p>
          <button className="btn primary" onClick={() => navigate('/')}>
            Upload First Form
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Filename</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="mono">{record.id}</td>
                  <td className="filename">{record.original_filename}</td>
                  <td>{record.created_at}</td>
                  <td>{record.updated_at}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view"
                      onClick={() => handleView(record.id)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEdit(record.id)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(record.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="stats-footer">
        <p>Total Records: <strong>{records.length}</strong></p>
      </div>
    </div>
  );
}
