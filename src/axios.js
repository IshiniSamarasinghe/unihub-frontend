import axios from 'axios';

// ✅ Remove baseURL because React proxy handles it
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// ✅ Keep the CSRF token logic
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