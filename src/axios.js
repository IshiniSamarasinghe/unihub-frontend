// src/axios.js
import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  // Your backend URL
  withCredentials: true,  // This ensures cookies are sent along with requests
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to add CSRF token and Authorization token
axiosInstance.interceptors.request.use((config) => {
  // ✅ Retrieve CSRF token from cookies
  const tokenCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('XSRF-TOKEN='));

  if (tokenCookie) {
    const token = decodeURIComponent(tokenCookie.split('=')[1]);
    config.headers['X-XSRF-TOKEN'] = token;  // Add CSRF token to headers
  }

  // ✅ Retrieve Authorization token from localStorage
  const authToken = localStorage.getItem('auth_token');  // Assuming the token is stored in localStorage
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;  // Add Bearer token to headers
  }

  return config;  // Return the modified config
}, (error) => {
  return Promise.reject(error);  // Reject the request in case of error
});

// ✅ Add a response interceptor to auto-handle 419 (CSRF token mismatch) and retry once
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 419) {
      try {
        // Refresh Sanctum CSRF cookie
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
        // Retry the original request once
        return axiosInstance(error.config);
      } catch (csrfError) {
        return Promise.reject(csrfError);
      }
    }
    return Promise.reject(error);
  }
);

// Export the axios instance for use in your app
export default axiosInstance;
