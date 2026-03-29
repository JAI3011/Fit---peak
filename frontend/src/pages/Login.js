import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setAlert(null);
    try {
      await login({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Invalid credentials. Please try again.';
      setAlert({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel auth-panel--left">
        <div className="auth-panel__inner">
          <div className="auth-brand">
            <span className="auth-brand__icon">🏋️</span>
            <h1 className="auth-brand__name">Fit Peak</h1>
          </div>
          <p className="auth-panel__tagline">
            Track every rep, every meal, every milestone.
          </p>
          <ul className="auth-panel__features">
            <li>💪 Log workouts &amp; exercises</li>
            <li>🥗 Monitor your nutrition</li>
            <li>📈 Visualize your progress</li>
            <li>🏆 Crush your fitness goals</li>
          </ul>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="auth-panel auth-panel--right">
        <div className="auth-form-wrapper">
          <h2 className="auth-form__title">Welcome back</h2>
          <p className="auth-form__subtitle">Sign in to your Fit Peak account</p>

          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.type === 'error' ? '⚠️' : '✅'} {alert.text}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch__link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
