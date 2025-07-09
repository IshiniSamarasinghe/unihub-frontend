// src/utils/logout.js
import axios from '../axios';

export async function logoutUser(navigate) {
  try {
    await axios.post('/logout');
    localStorage.removeItem('fcm_token'); // optional
    console.log('✅ User logged out');
    navigate('/signin');
  } catch (error) {
    console.error('❌ Logout failed:', error.response || error);
  }
}
