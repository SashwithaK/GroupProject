import api from '../api/axios'

const formService = {
  createForm: async (formName, data) => {
    try {
      const response = await api.post('/api/forms', {
        form_name: formName,
        data: typeof data === 'string' ? data : JSON.stringify(data)
      })
      return response.data
    } catch (error) {
      throw error.response?.data?.detail || error.message
    }
  },

  getAllForms: async () => {
    try {
      const response = await api.get('/api/forms')
      return response.data
    } catch (error) {
      throw error.response?.data?.detail || error.message
    }
  },

  getFormById: async (id) => {
    try {
      const response = await api.get(`/api/forms/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.detail || error.message
    }
  },

  updateForm: async (id, updates) => {
    try {
      const response = await api.put(`/api/forms/${id}`, updates)
      return response.data
    } catch (error) {
      throw error.response?.data?.detail || error.message
    }
  },

  deleteForm: async (id) => {
    try {
      const response = await api.delete(`/api/forms/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data?.detail || error.message
    }
  }
}

export default formService
