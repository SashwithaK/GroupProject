import { useState } from 'react'
import './ResultDisplay.css'

// Icons
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
const IconUploadCloud = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>

const ResultDisplay = ({ result, onReset, onExtract, loading }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(result.extracted_data, null, 2)
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  // Highlight JSON syntax
  const formatJSON = (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }

  return (
    <div className="result-card">
      <div className="success-banner">
        <div className="success-left">
          <div className="check-circle">
             <IconCheck />
          </div>
          <div className="success-info">
            <h3 className="success-message">Success!</h3>
            <span className="filename-tag">{result.filename || 'document.jpg'}</span>
          </div>
        </div>
        {result.saved_to_database && (
           <div className="id-badge">ID: {result.form_id}</div>
        )}
      </div>

      <div className="json-container">
        <pre
          className="json-content"
          dangerouslySetInnerHTML={{ __html: formatJSON(result.extracted_data) }}
        ></pre>
      </div>

      <div className="result-actions">
        <button className="btn-extract" onClick={onExtract} disabled={loading}>
          {loading ? <div className="loader"></div> : <IconCheck />}
          {loading ? 'Extracting...' : 'Extract Text'}
        </button>
        <button className="btn-reset" onClick={onReset}>
          <IconRefresh />
          Reset
        </button>
        <button className="btn-copy" onClick={handleCopy}>
          {copied ? <IconCheck /> : <IconCopy />}
          {copied ? 'Copied!' : 'Copy Data'}
        </button>
        <button className="btn-new" onClick={onReset}>
          <IconUploadCloud />
          Upload Another
        </button>
      </div>
    </div>
  )
}

export default ResultDisplay
