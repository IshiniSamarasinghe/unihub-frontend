import React, { useState } from 'react';
import './AdminLogin.css';
import axios from '../axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // ✅ Import icons

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/admin/login', formData);
      alert('✅ Login successful!');
      window.location.href = '/admin/dashboard';
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <img
          src="/react/assets/logo1.png"
          alt="UniHub Logo"
          style={{ width: '120px', marginBottom: '10px' }}
        />
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
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
                color: '#005763',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p className="forgot-password-link">Forgot Password?</p>
      </div>
    </div>
  );
}

export default AdminLogin;
