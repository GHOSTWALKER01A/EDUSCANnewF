import axios from 'axios'

// The proxy handles the HttpOnly cookie to Authorization header conversion
const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Crucial for sending HttpOnly cookies to the backend
  timeout: 15000,
})

// Removed the request interceptor that reads localStorage 'accessToken' format.
// The backend needs to read the token from the HttpOnly cookie directly now, 
// or through a common mechanism if using Next.js proxies everywhere.

// Response interceptor for 401 seamless refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
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
