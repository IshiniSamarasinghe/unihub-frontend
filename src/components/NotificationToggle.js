import { useEffect, useState } from 'react';
import axios from '../axios';
import './NotificationToggle.css';

function NotificationToggle() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/user')
      .then(res => {
        setEnabled(res.data.notifications_enabled);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching user:', err);
        setLoading(false);
      });
  }, []);

  const handleToggle = async () => {
    try {
      const newStatus = !enabled;
      setEnabled(newStatus);
      await axios.put('/user/notifications', { enabled: newStatus });
    } catch (err) {
      console.error('❌ Failed to update preference:', err);
      alert('Something went wrong.');
    }
  };

  if (loading) return null;

  return (
    <div className="notification-container">
      <div className="notification-card">
        <div className="notification-header">
          <div className="d-flex align-items-center">
            <i className="bi bi-bell-fill notification-bell"></i>
            <h6 className="notification-title">Notification Preferences</h6>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="notiSwitch"
              checked={enabled}
              onChange={handleToggle}
            />
            <label
              className="form-check-label notification-switch-label"
              htmlFor="notiSwitch"
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationToggle;
