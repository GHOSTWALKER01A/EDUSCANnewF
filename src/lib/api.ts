import axios from 'axios'

// The proxy handles the HttpOnly cookie to Authorization header conversion
const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Crucial for sending HttpOnly cookies to the backend
  timeout: 15000,
})

// Add request interceptor to ensure authorization header is always present
// This ensures stability if HttpOnly cookies fail or we're in a mixed proxy state
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Response interceptor for Network Retries & 401 seamless refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // 1. Exponential Backoff for 5xx or Network Errors
    if (originalRequest && (!error.response || error.response.status >= 500)) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      if (originalRequest._retryCount < 2) {
        originalRequest._retryCount += 1;
        const backoff = Math.pow(2, originalRequest._retryCount) * 1000;
        console.warn(`API Error. Retrying in ${backoff}ms...`);
        await delay(backoff);
        return api(originalRequest);
      }
    }
    
    // If the error status is 401 and there is no originalRequest._retry flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Attempt to hit the Next.js refresh proxy, which should refresh the cookie
        await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        // Replace original request, since cookie is automatically included with credentials
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, user needs to login again
        console.error('Session expired, please login again.')
        if (typeof window !== 'undefined') {
          // Clear user session from storage for UI state
          localStorage.removeItem('user') 
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
