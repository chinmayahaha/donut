import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!formData.name || formData.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email address';
    if (!formData.password || formData.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('https://donut-wd2v.onrender.com/api/auth/register', formData);
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07070f; }
        .signup-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #07070f;
          font-family: 'Syne', sans-serif;
          padding: 40px 20px;
        }
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .glow-orb {
          position: fixed;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,120,255,0.06) 0%, transparent 70%);
          top: -150px; left: -100px;
          pointer-events: none;
        }
        .card {
          position: relative;
          width: 440px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 48px;
          backdrop-filter: blur(20px);
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 40px; right: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,120,255,0.5), transparent);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }
        .brand-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #00ffb4, #0078ff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .brand-name { font-size: 20px; font-weight: 800; color: #fff; }
        h1 { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 28px;
        }
        .error-box {
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          color: #ff6b6b;
          font-size: 12px;
          margin-bottom: 16px;
          font-family: 'JetBrains Mono', monospace;
        }
        .field { margin-bottom: 14px; }
        label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 7px;
          font-family: 'JetBrains Mono', monospace;
        }
        .field-error {
          font-size: 11px;
          color: #ff6b6b;
          margin-top: 5px;
          font-family: 'JetBrains Mono', monospace;
        }
        .input-wrap { position: relative; }
        input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'JetBrains Mono', monospace;
          outline: none;
          transition: all 0.2s;
        }
        input:focus {
          border-color: rgba(0,120,255,0.4);
          background: rgba(0,120,255,0.03);
          box-shadow: 0 0 0 3px rgba(0,120,255,0.05);
        }
        input.has-error { border-color: rgba(255,60,60,0.3); }
        input::placeholder { color: rgba(255,255,255,0.2); }
        .eye-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer; font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          padding: 4px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.7); }
        .submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #0078ff, #0055cc);
          border: none; border-radius: 8px;
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer; margin-top: 20px;
          transition: all 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,120,255,0.3);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .footer-link {
          text-align: center; margin-top: 20px;
          font-size: 13px; color: rgba(255,255,255,0.3);
          font-family: 'JetBrains Mono', monospace;
        }
        .footer-link a { color: #0078ff; text-decoration: none; }
        .footer-link a:hover { text-decoration: underline; }
      `}</style>
      <div className="signup-root">
        <div className="grid-bg" />
        <div className="glow-orb" />
        <div className="card">
          <div className="brand">
            <div className="brand-icon">🍩</div>
            <span className="brand-name">donut</span>
          </div>
          <h1>Create account</h1>
          <p className="subtitle">$ auth --register</p>
          {errors.general && <div className="error-box">⚠ {errors.general}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Name</label>
              <input
                name="name" type="text" placeholder="Chinmaya"
                value={formData.name} onChange={handleChange}
                className={errors.name ? 'has-error' : ''}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>
            <div className="field">
              <label>Email</label>
              <input
                name="email" type="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
                className={errors.email ? 'has-error' : ''}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="min. 8 characters"
                  value={formData.password} onChange={handleChange}
                  className={errors.password ? 'has-error' : ''}
                  style={{ paddingRight: '60px' }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'hide' : 'show'}
                </button>
              </div>
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input
                name="confirmPassword" type="password" placeholder="••••••••"
                value={formData.confirmPassword} onChange={handleChange}
                className={errors.confirmPassword ? 'has-error' : ''}
              />
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
          <p className="footer-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
