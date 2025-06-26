// src/pages/SignIn.js

import React, { useState } from 'react';
import './SignIn.css';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


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
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.login || !formData.password) {
            alert('Please fill all fields');
            return;
        }

        setStatus('loading');

        try {
            await axios.get('/sanctum/csrf-cookie');

            await axios.post('/signin', {
                email: formData.login,
                password: formData.password,
                remember: formData.remember,
            });

            alert('✅ Login successful!');
            setStatus('success');
            navigate('/dashboard'); // adjust route as needed
        } catch (err) {
            setStatus('error');
            alert('❌ Login failed: ' + (err.response?.data?.message || err.message));
            setTimeout(() => setStatus('idle'), 2000);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-left">
                <h1 className="logo">UniHub</h1>
                <p className="welcome-text">Nice to see you again!</p>
               <img src={process.env.PUBLIC_URL + '/assets/signin-img.png'} alt="Illustration" className="signin-illustration" />

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
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                right: '10px',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
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
                        <a href="/" onClick={(e) => e.preventDefault()}>Forgot password?</a>
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