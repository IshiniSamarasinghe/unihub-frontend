// src/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// ✅ CSRF token support
axiosInstance.interceptors.request.use((config) => {
  const tokenCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('XSRF-TOKEN='));

  if (tokenCookie) {
    const token = decodeURIComponent(tokenCookie.split('=')[1]);
    config.headers['X-XSRF-TOKEN'] = token;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
