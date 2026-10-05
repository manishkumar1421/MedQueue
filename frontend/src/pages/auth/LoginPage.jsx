import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!identifier.trim()) errs.identifier = 'Email or mobile number is required';
    if (!password) errs.password = 'Password is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = await login(identifier.trim(), password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'Patient') navigate('/patient/dashboard');
      else if (result.user?.role === 'Doctor') navigate('/doctor/dashboard');
      else if (result.user?.role === 'Receptionist') navigate('/receptionist/dashboard');
      else if (result.user?.role === 'Admin') navigate('/admin/dashboard');
    }
  };

  const iconStyle = {
    position: 'absolute', left: '12px', top: '50%',
    transform: 'translateY(-50%)', color: '#94a3b8',
    display: 'flex', alignItems: 'center', pointerEvents: 'none'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>

        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: '#0284c7', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', boxShadow: '0 4px 12px rgba(2,132,199,0.25)'
              }}
            >
              <Activity size={26} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, display: 'block' }}>
                MedQueue
              </span>
              <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                HOSPITAL SYSTEM
              </span>
            </div>
          </Link>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '1.25rem', marginBottom: '0.35rem' }}>
            Sign In to Portal
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Access your appointments, live token status, and hospital queues
          </p>
        </div>

        {/* Card */}
        <div className="med-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Email or Phone */}
            <div className="form-group">
              <label className="form-label">Email or Mobile Number <span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}><Mail size={16} /></span>
                <input
                  id="login-identifier"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="name@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); if (errors.identifier) setErrors({ ...errors, identifier: null }); }}
                  autoComplete="username"
                />
              </div>
              {errors.identifier && <div className="form-error">{errors.identifier}</div>}

              {/* hint */}
              <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={11} /> You can use your email address OR mobile number
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password <span className="required">*</span></label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                  Forgot Password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}><Lock size={16} /></span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.6rem' }}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: null }); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', color: '#94a3b8', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', padding: 0
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : (
                <><ArrowRight size={18} /> Sign In</>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd',
              fontSize: '0.78rem',
              color: '#0369a1',
              lineHeight: 1.6
            }}
          >
            <strong>Demo credentials (password: <code>password123</code>):</strong><br />
            Patient: <code>rahul.sharma@example.com</code><br />
            Admin: <code>admin@medqueue.org</code><br />
            Doctor: <code>amit.sharma@medqueue.org</code>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            New patient?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: '#0284c7' }}>
              Create an Account
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: '#64748b' }}>
            ← Back to Hospital Home Page
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
