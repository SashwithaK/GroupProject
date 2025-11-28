import axios from 'axios';

const api = axios.create({
  baseURL: '/',  // Always use relative path to leverage proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
