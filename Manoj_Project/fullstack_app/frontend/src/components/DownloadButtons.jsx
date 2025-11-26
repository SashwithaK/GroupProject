import React, { useState } from 'react';

function download(filename, content, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function DownloadButtons({ data, onSaved }) {
  const [saving, setSaving] = useState(false);

  const exportJSON = () => {
    download('extracted.json', JSON.stringify(data, null, 2), 'application/json');
  };

  const exportCSV = () => {
    if (!data) return;
    const rows = [];
    const header = [];
    const values = [];
    Object.keys(data).forEach((k) => {
      header.push(k);
      const v = data[k];
      values.push(typeof v === 'object' ? JSON.stringify(v) : String(v));
    });
    const csv = header.join(',') + '\n' + values.map((c) => '"' + (c || '').replace(/"/g, '""') + '"').join(',');
    download('extracted.csv', csv, 'text/csv');
  };

  const copyJSON = async () => {
    const text = JSON.stringify(data, null, 2);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert('JSON copied to clipboard');
    } else {
      download('extracted.json', text, 'application/json');
    }
  };

  const saveToDatabase = async () => {
    try {
      setSaving(true);
      const filename = data.source_filename || 'extracted_form.json';
      
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_filename: filename,
          extracted_json: data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }

      const result = await response.json();
      alert(`✅ Successfully saved to database! Record ID: ${result.id}`);
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="download-buttons">
      <button 
        className="btn primary" 
        onClick={saveToDatabase}
        disabled={saving}
      >
        {saving ? '⏳ Saving...' : '💾 Save to Database'}
      </button>
      <button className="btn" onClick={exportJSON}>📥 Download JSON</button>
      <button className="btn" onClick={exportCSV}>📊 Download CSV</button>
      <button className="btn outline" onClick={copyJSON}>📋 Copy JSON</button>
    </div>
  );
}
