import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://donut-wd2v.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch {
      setError('Unable to connect. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07070f; }
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #07070f;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
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
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,180,0.06) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          pointer-events: none;
        }
        .glow-orb2 {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,120,255,0.05) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
        }
        .card {
          position: relative;
          width: 420px;
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
          background: linear-gradient(90deg, transparent, rgba(0,255,180,0.4), transparent);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }
        .brand-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #00ffb4, #0078ff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .brand-name {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }
        h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 32px;
        }
        .error-box {
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 8px;
          padding: 12px 16px;
          color: #ff6b6b;
          font-size: 13px;
          margin-bottom: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
        .field {
          margin-bottom: 16px;
        }
        label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-family: 'JetBrains Mono', monospace;
        }
        .input-wrap {
          position: relative;
        }
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
          border-color: rgba(0,255,180,0.4);
          background: rgba(0,255,180,0.03);
          box-shadow: 0 0 0 3px rgba(0,255,180,0.05);
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          padding: 4px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.7); }
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #00ffb4, #00c896);
          border: none;
          border-radius: 8px;
          color: #07070f;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          margin-top: 24px;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,255,180,0.25);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .footer-link {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          font-family: 'JetBrains Mono', monospace;
        }
        .footer-link a {
          color: #00ffb4;
          text-decoration: none;
          font-weight: 500;
        }
        .footer-link a:hover { text-decoration: underline; }
      `}</style>
      <div className="login-root">
        <div className="grid-bg" />
        <div className="glow-orb" />
        <div className="glow-orb2" />
        <div className="card">
          <div className="brand">
            <div className="brand-icon">🍩</div>
            <span className="brand-name">donut</span>
          </div>
          <h1>Welcome back</h1>
          <p className="subtitle">$ auth --login</p>
          {error && <div className="error-box">⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '60px' }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'hide' : 'show'}
                </button>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Login →'}
            </button>
          </form>
          <p className="footer-link">
            No account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
