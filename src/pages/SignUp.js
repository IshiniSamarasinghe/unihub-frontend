// src/pages/SignUp.js

import React, { useState } from 'react';
import './SignUp.css';
// eslint-disable-next-line no-unused-vars
import { Link } from 'react-router-dom';

function SignUp() {
  const [roles, setRoles] = useState([{ society: '', role: '' }]);

  const handleAddRole = () => {
    setRoles([...roles, { society: '', role: '' }]);
  };

  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="signup-left">
        <h1 className="logo">UniHub</h1>
        <p className="welcome-text">
          Welcome to UniHub! Sign Up and enjoy with creating and sharing events.
        </p>
        <img src="/assets/signup-img.png" alt="Illustration" className="signup-illustration" />
      </div>

      {/* Right Section */}
      <div className="signup-right">
        <h2>Create New Account</h2>
        <form className="signup-form">
          <input type="text" placeholder="Enter Your Full Name" />
          <input type="email" placeholder="Enter University Email" />
          <input type="password" placeholder="Enter Your Password" />
          <input type="tel" placeholder="+94 xxxxxxxxx" />
          <input type="text" placeholder="Faculty" />

          {roles.map((_, index) => (
            <div key={index} className="role-pair">
              <select>
                <option>Society</option>
                <option value="itsa">ITSA</option>
                <option value="etsa">ETSA</option>
                <option value="cssa">CSSA</option>
                <option value="dancing">Dancing Club</option>
                <option value="isaca">ISACA</option>
                <option value="foss">FOSS</option>
              </select>

              <select>
                <option>Your Role in Society</option>
                <option value="president">President</option>
                <option value="vp">Vice President</option>
                <option value="jt">Junior Treasurer</option>
                <option value="sec">Secretary</option>
                <option value="editor">Co-editor</option>
                <option value="committee">Committee Member</option>
                <option value="member">Member</option>
              </select>
            </div>
          ))}

          <button type="button" className="add-role" onClick={handleAddRole}>
            Add another Role +
          </button>

          <div className="terms">
            <input type="checkbox" id="agree" className="box" />
            <label htmlFor="agree" className="terms-text">
              <p>
                You already have an account?&nbsp;
                <Link to="/signin">Sign in</Link>
              </p>
            </label>
          </div>

          <button className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
