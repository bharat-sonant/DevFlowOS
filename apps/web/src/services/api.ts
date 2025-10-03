import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL; 
// console.log("API URL 👉 - api.ts:4", API_URL); 

const API_URL = "http://localhost:3000"; 

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined!"); // ensures you never fallback
}
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
    console.error('[API ERROR] - api.ts:31', err?.response || err)
    return Promise.reject(err)
  }
)
