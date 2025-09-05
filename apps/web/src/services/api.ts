import axios from 'axios'

const API_URL = "http://localhost:3000"; //import.meta.env.API_URL as string

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
})

// (Optional) interceptors for logging/errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err?.response || err)
    return Promise.reject(err)
  }
)
