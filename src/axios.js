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
  // Retrieve CSRF token from cookies
  const tokenCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('XSRF-TOKEN='));

  if (tokenCookie) {
    const token = decodeURIComponent(tokenCookie.split('=')[1]);
    config.headers['X-XSRF-TOKEN'] = token;  // Add CSRF token to headers
  }

  // Retrieve Authorization token from localStorage
  const authToken = localStorage.getItem('auth_token');  // Assuming the token is stored in localStorage
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;  // Add Bearer token to headers
  }

  return config;  // Return the modified config
}, (error) => {
  return Promise.reject(error);  // Reject the request in case of error
});

// Export the axios instance for use in your app
export default axiosInstance;
