// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// ✅ Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCN1fvaeWiI4FFb6dWCl5O2iQ3nTAyZkrs',
  authDomain: 'unihub-notifications.firebaseapp.com',
  projectId: 'unihub-notifications',
  storageBucket: 'unihub-notifications.appspot.com', // ✅ Fixed typo: `.app` ➝ `.appspot.com`
  messagingSenderId: '277803908490',
  appId: '1:277803908490:web:dfc76f1fc1a3ddf543dc73',
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize messaging service
const messaging = getMessaging(app);

// ✅ Export required functions
export { messaging, getToken, onMessage };
