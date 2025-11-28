import { useState, useRef } from 'react'
import './FileUpload.css'

// Icons
const IconCloudUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 15c.7 0 1.7 0 2.2-1.6a5.3 5.3 0 0 0-1.7-6.4 5.6 5.6 0 0 0-5.1-.5A7.6 7.6 0 0 0 3.4 9.7c-1.1.3-1.7.9-1.9 2.1-.2 1.2.4 2.4 1.5 2.8.5.2 1.2.3 2 .4"></path><path d="M12 13v9"></path><path d="M9 19l3-3 3 3"></path></svg>
const IconFile = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
const IconPaperclip = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>

const FileUpload = ({ onFileSelect, loading }) => {
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or PDF file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    if (file.type !== 'application/pdf') {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }

    // Notify parent component that file was selected
    onFileSelect(file)
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="upload-card">
      <div 
        className={`preview-area ${selectedFile ? 'has-file' : ''} ${dragActive ? 'dragging' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : selectedFile ? (
          <div className="pdf-preview">PDF Document Selected</div>
        ) : (
          <div className="upload-trigger">
             <div className="icon-container-circle">
               <IconCloudUpload />
             </div>
             <h3 style={{fontSize:'1.25rem', fontWeight:'700', marginBottom:'0.5rem', color:'#1e293b'}}>Drag & Drop File Here</h3>
             <p style={{color:'#64748b', marginBottom:'1.5rem'}}>or click to browse your computer</p>
             <button className="btn-choose-file" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
               Choose File
             </button>
             
             <div className="supported-formats">
               <IconPaperclip /> 
               <span style={{fontWeight:'600', marginRight:'0.25rem'}}>Supported Formats</span>
               <span style={{fontSize:'0.8rem', opacity:0.8}}>JPG, PNG, PDF • Maximum size: 10MB</span>
             </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="file-info-bar">
          <div className="file-icon">
            <IconFile />
          </div>
          <div className="file-details">
             <h4>{selectedFile.name}</h4>
             <span>{(selectedFile.size / 1024).toFixed(2)} KB</span>
          </div>
        </div>
      )}


    </div>
  )
}

export default FileUpload
