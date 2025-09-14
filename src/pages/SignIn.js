// src/pages/SignIn.js

import React, { useState } from 'react';
import './SignIn.css';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function SignIn() {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.login || !formData.password) {
      toast.warn('⚠️ Please fill all fields');
      return;
    }

    setStatus('loading');

    try {
      // 1) Sanctum CSRF cookie
      await axios.get('/sanctum/csrf-cookie');

      // 2) Login
      const loginResponse = await axios.post('/signin', {
        email: formData.login,
        password: formData.password,
        remember: formData.remember,
      });

      setStatus('success');
      toast.success('✅ Login successful!');

      // 3) Upcoming events for non-admin users
      const userRole = loginResponse.data?.user?.role;
      if (userRole !== 'admin') {
        try {
          const { data: events } = await axios.get('/api/events/upcoming');

          if (Array.isArray(events) && events.length > 0) {
            // Show first 3 (or fewer) events as individual toasts
            events.slice(0, 3).forEach((event) => {
              const dt = new Date(`${event.date}T${event.time}`);
              const d = isNaN(dt) ? '' : dt.toLocaleDateString();
              const t = isNaN(dt) ? '' : event.formatted_time; // Use formatted time

              toast.info(
                `📢 ${event.name}\n📍 ${event.university}\n🗓 ${d} ${t}`,
                { autoClose: 6000, pauseOnHover: true }
              );
            });
          } else {
            // Optional: tell the user the call worked but nothing upcoming
            toast.info('No upcoming events right now.');
          }
        } catch (eventsErr) {
          // Don’t block login flow if this fails
          console.error('Upcoming events fetch failed:', eventsErr);
        }
      }

      // 4) Navigate (global ToastContainer in App.js keeps toasts visible)
      navigate('/');

    } catch (err) {
      console.error(err);
      setStatus('error');
      toast.error('❌ Login failed: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <img src="/react/assets/logo.png" alt="UniHub Logo" className="signin-logo" />
        <p className="welcome-text">Nice to see you again!</p>
        <img
          src={process.env.PUBLIC_URL + '/assets/signin-img.png'}
          alt="Illustration"
          className="signin-illustration"
        />
      </div>

      <div className="signin-right">
        <h2>Login</h2>
        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Email or phone number"
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              required
              style={{ paddingRight: '2rem' }}
            />
            <span
              onClick={() => setShowPassword((p) => !p)}
              style={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="signin-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <div className="forgot-password">
              <a href="/" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>
          </div>

          <button type="submit" className="signin-btn" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="signup-redirect">
            Do you have an account? <a href="/signup">Create an Account</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
