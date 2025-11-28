import { useState, useEffect } from 'react'
import api from './api/axios'
import FileUpload from './components/FileUpload'
import ResultDisplay from './components/ResultDisplay'
import FormManager from './components/FormManager'
import formService from './services/formService'
import './App.css'

// Icons
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
const IconDatabase = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s 9-1.34 9-3V5"></path></svg>
const IconClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{color:'#cbd5e1'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8" fill="white" stroke="none"></polyline></svg>

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [resetKey, setResetKey] = useState(0) // To force re-render/reset of FileUpload
  const [dbCount, setDbCount] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)

  // Fetch database count on mount
  useEffect(() => {
    const fetchDbCount = async () => {
      try {
        const forms = await formService.getAllForms()
        setDbCount(forms.length)
      } catch (err) {
        console.error('Failed to fetch database count:', err)
        setDbCount(0)
      }
    }
    fetchDbCount()
  }, []) 

  const handleUploadSuccess = (data) => {
    setResult(data)
    setError(null)
    // Update database count if a new record was saved
    if (data.saved_to_database) {
      setDbCount(prev => prev + 1)
    }
  }

  const handleUploadError = (err) => {
    setError(err)
    setResult(null)
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleExtract = async () => {
    if (!selectedFile) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      handleUploadSuccess(response.data)
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to process image'
      handleUploadError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setSelectedFile(null)
    setResetKey(prev => prev + 1) // Reset file upload component
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-content">
          <div className="app-logo">
            <IconClipboard />
          </div>
          <h1>Handwritten Form Extraction</h1>
          <p className="header-subtitle">Enterprise-Grade AI-Powered OCR System with Complete Database Management</p>
        </div>
        
        <div className="nav-container">
          <div className="nav-pills">
            <button 
              className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <IconUpload />
              Upload & Extract
            </button>
            <button 
              className={`nav-tab ${activeTab === 'database' ? 'active secondary' : ''}`}
              onClick={() => setActiveTab('database')}
            >
              <IconDatabase />
              Database Manager
              <span className="nav-badge">{dbCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="content-wrapper">
        {activeTab === 'upload' && (
          <div className="extraction-layout">
            <div className="layout-col left">
              <div className="card-header-title">
                <IconUpload /> Upload Document
              </div>
              
              {error && (
                <div className="error-alert">
                  <span>{error}</span>
                  <button onClick={() => setError(null)}>Dismiss</button>
                </div>
              )}

              <FileUpload
                key={resetKey} // Force reset on key change
                onFileSelect={handleFileSelect}
                loading={loading}
              />
            </div>

            <div className="layout-col right">
              <div className="card-header-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#22c55e'}}><polyline points="20 6 9 17 4 12"></polyline></svg>
                Extraction Results
              </div>

              {result ? (
                <ResultDisplay
                  result={result}
                  onReset={handleReset}
                  onExtract={handleExtract}
                  loading={loading}
                />
              ) : loading ? (
                 <div className="empty-placeholder-card" style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                  border: '2px solid white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div className="loader-large" style={{
                      width: '64px', 
                      height: '64px', 
                      border: '4px solid #e2e8f0', 
                      borderTopColor: '#3b82f6', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite',
                      marginBottom: '1.5rem'
                  }}></div>
                  <h3 style={{color:'#1e293b', marginBottom:'0.5rem'}}>Processing Document...</h3>
                  <p>Please wait while our AI extracts the text.</p>
                </div>
              ) : selectedFile ? (
                <div className="ready-to-extract-card">
                  <div className="file-ready-info">
                    <div className="file-icon-large">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h3>File Ready for Extraction</h3>
                    <p>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn-extract-main"
                      onClick={handleExtract}
                      disabled={loading}
                    >
                      {loading ? <div className="loader"></div> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      {loading ? 'Extracting...' : 'Extract Text'}
                    </button>
                    <button
                      className="btn-reset-main"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-placeholder-card" style={{
                  background: 'white',
                  borderRadius: '1rem',
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                  border: '2px solid white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{marginBottom:'1.5rem', opacity:0.5}}>
                     <IconFileText />
                  </div>
                  <h3 style={{color:'#1e293b', marginBottom:'0.5rem'}}>Waiting for Extraction</h3>
                  <p style={{maxWidth:'300px', margin:'0 auto'}}>Upload a handwritten document to see the AI-powered extraction results here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="database-layout">
             <FormManager />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
