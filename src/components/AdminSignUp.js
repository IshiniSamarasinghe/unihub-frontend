import React, { useState } from 'react';
import './AdminLogin.css';
import axios from '../axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AdminSignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);            // NEW
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {                            // NEW
    const file = e.target.files?.[0];
    setAvatar(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Build multipart body (IMPORTANT)
      const body = new FormData();
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('password', formData.password);
      if (avatar) body.append('avatar', avatar);         // NEW (key: avatar)

      await axios.post('/admin/register', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Admin registered successfully!');
      window.location.href = '/admin/login';
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // show first validation error from backend
        const first = Object.values(err.response.data.errors)[0]?.[0];
        setError(first || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <img
          src="/react/assets/logo1.png"
          alt="UniHub Logo"
          style={{ width: '120px', marginBottom: '10px', marginLeft: '-10px' }}
        />
        <h2>Admin Sign Up</h2>

        {/* NOTE: for multipart you don't need form encType when using axios + FormData, but it's fine to include */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

           

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#0C1D36',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#0C1D36',
              }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {/* NEW: profile image input */}
          <label style={{ fontSize: '12px', color: '#0C1D36', marginTop: '6px' }}>
            Profile image (JPG/PNG, max 2MB)
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFile}
          />
          </div>

          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <p className="forgot-password-link">
          Already have an account? <a href="/admin/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default AdminSignUp;
