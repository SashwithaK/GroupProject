import React, { useState } from 'react';

export default function UploadForm({ onResult, setError, setLoading, onFormSaved }) {
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // preview
    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result);
    reader.readAsDataURL(file);

    // send to backend
    try {
      setError(null);
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/extract', { method: 'POST', body: formData });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error ${res.status}: ${txt}`);
      }
      const data = await res.json();
      onResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      onResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card upload-card centered-card">
      <div className="upload-inner">
        <div className="upload-icon" aria-hidden>📄</div>
        <h2 className="card-title">Upload Handwritten Form</h2>
        <p className="card-sub">Upload a clear scanned image for best OCR results.</p>

        <label className="file-button" htmlFor="file-input">
          <input id="file-input" type="file" accept="image/*" onChange={handleFile} />
          <span>Choose Image</span>
        </label>

        {previewSrc && (
          <div className="preview">
            <img src={previewSrc} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
}
