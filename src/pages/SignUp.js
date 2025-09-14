import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import './SignUp.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUp() {
  const [roles, setRoles] = useState([{ society: '', role: '' }]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    faculty: '',
  });
  const [status, setStatus] = useState('idle');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAddRole = () => setRoles([...roles, { society: '', role: '' }]);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleChange = (index, field, value) => {
    const updated = [...roles];
    updated[index][field] = value;
    setRoles(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('idle');

    const emailPattern = /^[a-zA-Z0-9._%+-]+@stu\.kln\.ac\.lk$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!emailPattern.test(formData.email)) {
      alert('❌ Email must end with @stu.kln.ac.lk');
      return;
    }
    if (!phonePattern.test(formData.phone)) {
      alert('❌ Phone number must be exactly 10 digits');
      return;
    }

    setStatus('loading');
    try {
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/register', { ...formData, roles });
      setStatus('success');

      // reset
      setFormData({ name: '', email: '', password: '', phone: '', faculty: '' });
      setRoles([{ society: '', role: '' }]);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      const details = error.response?.data?.details;
      setStatus('error');
      if (error.response?.status === 422 && details) {
        const firstError = Object.values(details)[0][0];
        alert(`Validation failed: ${firstError}`);
      } else {
        alert('❌ Registration failed: ' + (error.response?.data?.error || error.message));
      }
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src="/react/assets/logo.png" alt="UniHub Logo" className="signup-logo" />
        <p className="welcome-text">
          Welcome to UniHub! Sign Up and enjoy with creating and sharing events.
        </p>
        <img src="/react/assets/signup-img.png" alt="Illustration bus" className="signup-illustration" />
      </div>

      <div className="signup-right">
        <h4>Create New Account</h4>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
          <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="University Email" required />

          <div className="input-with-icon">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" required />
          <input name="faculty" value={formData.faculty} onChange={handleInputChange} placeholder="Faculty" required />

          {roles.map((role, index) => (
            <div className="role-pair" key={index}>
              <select value={role.society} onChange={(e) => handleRoleChange(index, 'society', e.target.value)} required>
                <option value="">Select Society</option>
                <option value="ITSA-society">ITSA</option>
                <option value="ETSA-society">ETSA</option>
                <option value="CSSA-society">CSSA</option>
                <option value="FOSS-society">FOSS</option>
                <option value="Legion-society">Legion</option>
                <option value="AISEC-society">AIESEC</option>
                <option value="LEO-society">Leo Club</option>
                <option value="Union">Union</option>
                <option value="ISACA-society">ISACA</option>
                <option value="By-Faculty">By Faculty</option>
              </select>

              <select value={role.role} onChange={(e) => handleRoleChange(index, 'role', e.target.value)} required>
                <option value="">Select Role</option>
                <option value="president">President</option>
                <option value="vicepresident">Vice President</option>
                <option value="secretary">Secretary</option>
                <option value="assistantsecretary">Assistant Secretary</option>
                <option value="juniortreasurer">Junior Treasurer</option>
                <option value="coeditor">Co-Editor</option>
                <option value="committeemember">Committee Member</option>
                <option value="member">Member</option>
                <option value="organizingcommittee">Organizing Committee</option>
              </select>
            </div>
          ))}

          <button type="button" className="add-role" onClick={handleAddRole}>
            Add another Role +
          </button>
<br></br>
          {/* ✅ aligned like SignIn remember-me */}
          <label className="terms-check" htmlFor="agree">
            <input id="agree" type="checkbox" required />
            <span>I agree to the terms &amp; conditions.</span>
          </label>

          <button type="submit" className="signup-btn" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing Up...' : status === 'success' ? '✅ Registered!' : 'Sign Up'}
          </button>

          <p className="have-account">
            Already have an account?{' '}
            <button type="button" className="linklike" onClick={() => navigate('/signin')}>
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
