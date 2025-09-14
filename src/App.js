import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UpcomingEvents from './pages/UpcomingEvents';
import PastEvents from './pages/PastEvents';
import About from './pages/About';
import SignUp from './pages/SignUp';
import EventDetails from './pages/EventDetails';
import SignIn from './pages/SignIn';
import CreateEvent from './pages/CreateEvent';
import Store from './pages/Store';
import CalendarPage from './pages/CalendarPage';
import MyEvents from './pages/MyEvents';
import TopSlider from './components/TopSlider';
import './App.css';
 
 

import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
import axios from './axios';

// Admin components
import AdminDashboard from './components/AdminDashboard';
import AdminEventApproval from './components/AdminEventApproval';
import AdminAllEvents from './components/AdminAllEvents';
import AdminUsers from './components/AdminUsers';
import AdminSocieties from './components/AdminSocieties';
import AdminLogin from './components/AdminLogin';
import AdminChangePassword from './components/AdminChangePassword';
import AdminStore from './components/AdminStore';
import AdminRejectedApprovals from './components/AdminRejectedApprovals';
import AdminSignUp from './components/AdminSignUp';


// Test FCM
import TestNotification from './pages/TestNotification';

function LayoutWrapper({ children }) {
  const location = useLocation();

  const hideLayout = location.pathname.startsWith('/admin') ||
    ['/signup', '/signin', '/create-event'].includes(location.pathname);

  return (
    <>
      {!hideLayout && (
        <>
          <TopSlider />   {/* ✅ Top slider above navbar */}
          <Navbar />
        </>
      )}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
          console.warn('🚫 Notification permission denied.');
          return;
        }

        console.log('✅ Notification permission granted.');

        const VAPID_KEY = 'BPF7zDg3hUKF1wbgnkCI72xjYnNd8_5NHzE3OykFf3aaG7Y3rHu4YxtkyMUxVGtQg2r04yG24JtfpwCIiPLAqTQ';

        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (currentToken) {
          console.log('📲 FCM Token:', currentToken);

          // Store for local reuse
          localStorage.setItem('fcm_token', currentToken);

          // Send to Laravel backend (via Sanctum-protected route)
          await axios.post('/save-token', { token: currentToken });
          console.log('✅ Token sent to backend');
        }
      } catch (err) {
        console.error('❌ Error getting or sending FCM token:', err);
      }
    };

    // Listen to foreground messages
    onMessage(messaging, (payload) => {
      console.log('📩 Foreground message received:', payload);
      alert(`🔔 ${payload?.notification?.title}\n${payload?.notification?.body}`);
    });

    // Register token when app loads
    registerFCMToken();
  }, []);

  return (
    <BrowserRouter basename="/">
      <LayoutWrapper>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<UpcomingEvents />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/store" element={<Store />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/test-notification" element={<TestNotification />} />
          <Route path="/my-events" element={<MyEvents />} />
         

          {/* Admin pages */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminAllEvents />} />
          <Route path="/admin/approvals" element={<AdminEventApproval />} />
          <Route path="/admin/rejected-approvals" element={<AdminRejectedApprovals />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/societies" element={<AdminSocieties />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/change-password" element={<AdminChangePassword />} />
          <Route path="/admin/store" element={<AdminStore />} />
          <Route path="/admin/register" element={<AdminSignUp />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;