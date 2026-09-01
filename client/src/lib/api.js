import axios from 'axios';

// In dev, Vite's proxy (see vite.config.js) forwards /api/* to the Express
// server, so a relative base URL works both in dev and once this is served
// from the same origin as the API in production.
const api = axios.create({
  baseURL: '/api',
});

// Phase 1 will set/read the JWT here (e.g. from localStorage) and attach it
// as an Authorization header on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
