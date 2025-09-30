import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; //import.meta.env.API_URL as string

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
})

// Automatically attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    // Use `set` method for AxiosHeaders
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});


// (Optional) interceptors for logging/errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err?.response || err)
    return Promise.reject(err)
  }
)
