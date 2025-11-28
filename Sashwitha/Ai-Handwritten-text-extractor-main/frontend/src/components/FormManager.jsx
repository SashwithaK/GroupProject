import { useState, useEffect } from 'react'
import formService from '../services/formService'
import api from '../api/axios'
import './FormManager.css'

// Icons
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
const IconGrid = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>

const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
const IconAlert = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>

const FormManager = () => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('card') // 'card' or 'table'
  const [selectedForm, setSelectedForm] = useState(null)
  const [modalType, setModalType] = useState(null) // 'view', 'edit', null
  const [editData, setEditData] = useState('')
  const [editName, setEditName] = useState('')

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [popupMessage, setPopupMessage] = useState(null) // { type: 'success'|'error', text: string }
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchForms()
  }, [])

  const showPopup = (text, type = 'success') => {
      setPopupMessage({ text, type })
      setTimeout(() => setPopupMessage(null), 3000)
  }

  const fetchForms = async () => {
    setLoading(true)
    try {
      const data = await formService.getAllForms()
      setForms(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenView = (form) => {
    setSelectedForm(form)
    setModalType('view')
  }

  const handleOpenEdit = (form) => {
    setSelectedForm(form)
    setEditName(form.form_name || '')
    // Ensure data is string for textarea
    let dataStr = form.data
    if (typeof dataStr !== 'string') {
        try { dataStr = JSON.stringify(dataStr, null, 2) } catch(e){}
    } else {
        // Try to format it if it's a JSON string
        try { dataStr = JSON.stringify(JSON.parse(dataStr), null, 2) } catch(e){}
    }
    setEditData(dataStr)
    setModalType('edit')
  }

  const handleCloseModal = () => {
    setSelectedForm(null)
    setModalType(null)
    setEditData('')
    setEditName('')
  }

  const handleUpdate = async () => {
      if (!selectedForm) return
      try {
          // Validate JSON
          let parsedData = editData
          try {
              JSON.parse(editData)
          } catch(e) {
              alert("Invalid JSON format")
              return
          }

          await formService.updateForm(selectedForm.id, {
              form_name: editName,
              data: editData
          })
          
          // Refresh list
          setForms(forms.map(f => f.id === selectedForm.id ? {...f, form_name: editName, data: editData} : f))
          showPopup('Record updated successfully')
          handleCloseModal()
      } catch(e) {
          console.error(e)
          showPopup('Failed to update form', 'error')
      }
  }

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return
    try {
        await formService.deleteForm(showDeleteConfirm)
        setForms(forms.filter(f => f.id !== showDeleteConfirm))
        showPopup('Record deleted successfully')
    } catch(e) { 
        console.error(e)
        showPopup('Failed to delete record', 'error')
    } finally {
        setShowDeleteConfirm(null)
    }
  }

  const handleDeleteClick = (id) => {
      setShowDeleteConfirm(id)
  }

  // Helper to pretty print date
  const formatDate = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleDateString()
  }
  
  const formatTime = (isoString) => {
     const d = new Date(isoString)
     return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  // Highlight JSON syntax (reused)
  const formatJSON = (data) => {
    let json = data;
    try {
        if (typeof data === 'string') json = JSON.parse(data)
        json = JSON.stringify(json, null, 2)
    } catch (e) { json = String(data) }

    return json
  }

  // Helper to render data as a mini table for preview
  const renderTableData = (data) => {
    let obj = data;
    try {
      if (typeof data === 'string') obj = JSON.parse(data);
    } catch (e) { return <span style={{color:'#ef4444'}}>Invalid Format</span> }

    if (!obj || typeof obj !== 'object') return <span>{String(obj)}</span>

    const entries = Object.entries(obj).slice(0, 3);

    return (
      <table className="nested-data-table">
        <tbody>
          {entries.map(([k, v]) => (
            <tr key={k}>
              <td className="nested-key">{k}</td>
              <td className="nested-val">{String(v).length > 20 ? String(v).substring(0,20)+'...' : String(v)}</td>
            </tr>
          ))}
          {Object.keys(obj).length > 3 && (
             <tr><td colSpan="2" style={{opacity:0.5, fontSize:'0.7rem'}}>+{Object.keys(obj).length - 3} more fields</td></tr>
          )}
        </tbody>
      </table>
    )
  }

  // Helper to render full data as table in modal
  const renderFullTableData = (data) => {
    let obj = data;
    try {
      if (typeof data === 'string') obj = JSON.parse(data);
    } catch (e) { return <span style={{color:'#ef4444'}}>Invalid Format</span> }

    if (!obj || typeof obj !== 'object') return <span>{String(obj)}</span>

    // Flatten nested objects for better display
    const flattenObject = (obj, prefix = '') => {
      const flattened = [];
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix} → ${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Recursively flatten nested objects
          flattened.push(...flattenObject(value, fullKey));
        } else {
          flattened.push([fullKey, String(value)]);
        }
      }
      return flattened;
    };

    const flattenedData = flattenObject(obj);

    return (
      <div className="full-data-table-container">
        <table className="full-data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {flattenedData.map(([key, value], index) => (
              <tr key={index}>
                <td className="full-data-key">{key}</td>
                <td className="full-data-value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const filteredForms = forms.filter(form => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    const nameMatch = (form.form_name || '').toLowerCase().includes(term)
    const dataMatch = typeof form.data === 'string' 
      ? form.data.toLowerCase().includes(term)
      : JSON.stringify(form.data).toLowerCase().includes(term)
    return nameMatch || dataMatch
  })

  return (
    <div className="manager-card">
      {popupMessage && (
        <div className={`popup-toast ${popupMessage.type}`}>
           {popupMessage.type === 'success' && <IconCheck />}
           {popupMessage.text}
        </div>
      )}

      <div className="manager-header">
        <div className="header-left">
          <h3>Database Records</h3>
          <span className="record-count">{filteredForms.length} Records Found</span>
        </div>
        
        <div className="view-toggles">
          <button 
            className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
          >
            <IconGrid /> Card View
          </button>
          <button 
             className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
             onClick={() => setViewMode('table')}
          >
            <IconList /> Table View
          </button>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-icon"><IconSearch /></div>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by filename or content..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {forms.length === 0 && !loading ? (
        <div className="empty-state">No records found</div>
      ) : filteredForms.length === 0 && !loading ? (
        <div className="empty-state">No matching records found</div>
      ) : null}

      {filteredForms.length > 0 && viewMode === 'card' && (
        <div className="records-grid">
          {filteredForms.map(form => (
            <div key={form.id} className="record-card">
              <div className="card-top">
                <div className="file-badge">
                  <IconFileText />
                </div>
                <div className="card-meta">
                  <h4>{form.form_name || 'Untitled Document'}</h4>
                  <span>Record ID: {form.id}</span>
                </div>
              </div>

              <div className="card-info-bar">
                <div className="info-item">
                  <IconCalendar /> {formatDate(form.created_at)}
                </div>
                <div className="info-item green">
                  <IconClock /> {formatTime(form.created_at)}
                </div>
              </div>

              <div className="card-preview">
                <pre className="code-preview">
                  {formatJSON(form.data)}
                </pre>
              </div>

              <div className="card-actions">
                <button className="action-btn view" onClick={() => handleOpenView(form)}>
                  <IconEye /> View
                </button>
                <button className="action-btn edit" onClick={() => handleOpenEdit(form)}>
                  <IconEdit /> Edit
                </button>
                <button className="action-btn delete" onClick={() => handleDeleteClick(form.id)}>
                  <IconTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredForms.length > 0 && (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th width="60">ID</th>
                <th>Filename</th>
                <th>Created</th>
                <th>Data Preview</th>
                <th width="160" style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredForms.map(form => (
                <tr key={form.id}>
                  <td><span className="id-badge-table">{form.id}</span></td>
                  <td>
                     <div className="filename-cell">
                        <IconFileText style={{width:16, color:'#9333ea'}} /> 
                        {form.form_name || 'Untitled'}
                     </div>
                  </td>
                  <td>
                    <div className="date-cell">
                       <span>{formatDate(form.created_at)}</span>
                       <span className="time-sub">{formatTime(form.created_at)}</span>
                    </div>
                  </td>
                  <td>
                     <div className="data-preview-cell">
                        {renderTableData(form.data)}
                     </div>
                  </td>
                  <td>
                    <div className="table-actions">
                        <button className="icon-btn blue" onClick={() => handleOpenView(form)} title="View"><IconEye /></button>
                        <button className="icon-btn orange" onClick={() => handleOpenEdit(form)} title="Edit"><IconEdit /></button>
                        <button className="icon-btn red" onClick={() => handleDeleteClick(form.id)} title="Delete"><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
         <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
            <div className="modal-content delete-confirm" onClick={e => e.stopPropagation()}>
               <div className="delete-icon-wrapper">
                  <IconAlert />
               </div>
               <h2>Confirm Deletion</h2>
               <p>Are you sure you want to delete this record?<br/>This action cannot be undone!</p>
               
               {/* Show some details about what is being deleted */}
               {(() => {
                  const item = forms.find(f => f.id === showDeleteConfirm)
                  return item ? (
                    <div className="delete-item-preview">
                       <IconFileText /> 
                       <div style={{textAlign:'left'}}>
                          <strong>{item.form_name || 'Untitled'}</strong>
                          <div style={{fontSize:'0.8rem'}}>ID: {item.id}</div>
                       </div>
                    </div>
                  ) : null
               })()}

               <div className="confirm-actions">
                  <button className="btn-confirm-delete" onClick={confirmDelete}>
                     <IconTrash /> Yes, Delete It
                  </button>
                  <button className="btn-cancel-delete" onClick={() => setShowDeleteConfirm(null)}>
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )}


      {/* Modal Overlay */}
      {modalType && (
          <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                      <h3>{modalType === 'view' ? 'View Record' : 'Edit Record'}</h3>
                      <button className="btn-close" onClick={handleCloseModal}>&times;</button>
                  </div>
                  <div className="modal-body">
                      {modalType === 'view' ? (
                          <>
                            <div className="detail-group">
                                <label>Form Name</label>
                                <p className="detail-value">{selectedForm?.form_name || 'Untitled'}</p>
                            </div>
                            <div className="detail-group">
                                <label>Extracted Data</label>
                                {renderFullTableData(selectedForm?.data)}
                            </div>
                          </>
                      ) : (
                          <>
                            <div className="form-group">
                                <label>Form Name</label>
                                <input 
                                    type="text" 
                                    className="modal-input"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>JSON Data</label>
                                <textarea 
                                    className="modal-textarea"
                                    value={editData}
                                    onChange={e => setEditData(e.target.value)}
                                />
                            </div>
                          </>
                      )}
                  </div>
                  <div className="modal-footer">
                      <button className="btn-cancel" onClick={handleCloseModal}>
                          {modalType === 'view' ? 'Close' : 'Cancel'}
                      </button>
                      {modalType === 'edit' && (
                          <button className="btn-save" onClick={handleUpdate}>Save Changes</button>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}

export default FormManager
