import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  CheckCircle2,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export const AuthPopup = ({ onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // ── LOGIN STATE ─────────────────────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  const validateLogin = () => {
    const errs = {};
    if (!loginData.identifier.trim()) errs.identifier = 'Email or phone is required';
    if (!loginData.password) errs.password = 'Password is required';
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length > 0) { setLoginErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // small UX delay
    const result = await login(loginData.identifier, loginData.password);
    setLoading(false);
    if (result.success) {
      handleClose();
      if (result.user?.role === 'Patient') navigate('/patient/dashboard');
      else if (result.user?.role === 'Doctor') navigate('/doctor/dashboard');
      else if (result.user?.role === 'Receptionist') navigate('/receptionist/dashboard');
      else if (result.user?.role === 'Admin') navigate('/admin/dashboard');
    }
  };

  // ── REGISTER STATE ──────────────────────────────────────────────────────────
  const [regData, setRegData] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: ''
  });
  const [regErrors, setRegErrors] = useState({});

  const validateRegister = () => {
    const errs = {};
    if (!regData.name.trim()) errs.name = 'Full name is required';
    if (!regData.email.trim() || !regData.email.includes('@'))
      errs.email = 'Valid email is required';
    if (!regData.mobile.trim() || regData.mobile.replace(/\D/g, '').length < 10)
      errs.mobile = 'Valid 10-digit mobile is required';
    if (!regData.password || regData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (regData.password !== regData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validateRegister();
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = await register({
      name: regData.name,
      email: regData.email,
      mobile: regData.mobile,
      password: regData.password
    });
    setLoading(false);
    if (result.success) {
      handleClose();
      navigate('/patient/dashboard');
    }
  };

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 25px 60px -10px rgba(15, 23, 42, 0.35)',
    overflow: 'hidden',
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
    transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    maxHeight: '95vh',
    overflowY: 'auto'
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '0.7rem 0.9rem 0.7rem 2.6rem',
    border: `1.5px solid ${hasError ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: hasError ? '#fef2f2' : '#f8fafc',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxSizing: 'border-box'
  });

  const iconWrap = {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center'
  };

  const errorText = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: '3px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px'
  };

  const tabBtn = (isActive) => ({
    flex: 1,
    padding: '0.7rem',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.9rem',
    color: isActive ? '#0284c7' : '#64748b',
    borderBottom: `2.5px solid ${isActive ? '#0284c7' : 'transparent'}`,
    background: 'transparent',
    border: 'none',
    borderBottom: `2.5px solid ${isActive ? '#0284c7' : 'transparent'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            padding: '1.5rem 1.5rem 1.25rem',
            position: 'relative'
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Activity size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                MedQueue
              </div>
              <div style={{ fontSize: '0.72rem', color: '#bae6fd', fontWeight: 600, letterSpacing: '0.04em' }}>
                HOSPITAL OPD SYSTEM
              </div>
            </div>
          </div>

          <p style={{ margin: '0.85rem 0 0', color: '#e0f2fe', fontSize: '0.875rem', lineHeight: 1.4 }}>
            {activeTab === 'login'
              ? 'Sign in to track your queue, book appointments & manage your health records.'
              : 'Create your patient account to start using MedQueue instantly.'}
          </p>
        </div>

        {/* ── TABS ── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc'
          }}
        >
          <button style={tabBtn(activeTab === 'login')} onClick={() => { setActiveTab('login'); setLoginErrors({}); }}>
            Sign In
          </button>
          <button style={tabBtn(activeTab === 'register')} onClick={() => { setActiveTab('register'); setRegErrors({}); }}>
            Create Account
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '1.5rem' }}>

          {/* ════ LOGIN FORM ════ */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} noValidate>

              {/* Email or Phone */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Email or Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}>
                    <Mail size={15} />
                  </span>
                  <input
                    id="login-identifier"
                    type="text"
                    placeholder="name@email.com or 9876543210"
                    style={inputStyle(!!loginErrors.identifier)}
                    value={loginData.identifier}
                    onChange={(e) => {
                      setLoginData({ ...loginData, identifier: e.target.value });
                      if (loginErrors.identifier) setLoginErrors({ ...loginErrors, identifier: null });
                    }}
                    autoComplete="username"
                  />
                </div>
                {loginErrors.identifier && <div style={errorText}>⚠ {loginErrors.identifier}</div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <a
                    href="/forgot-password"
                    style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                    onClick={(e) => { e.preventDefault(); handleClose(); navigate('/forgot-password'); }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><Lock size={15} /></span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    style={{ ...inputStyle(!!loginErrors.password), paddingRight: '2.6rem' }}
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value });
                      if (loginErrors.password) setLoginErrors({ ...loginErrors, password: null });
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginErrors.password && <div style={errorText}>⚠ {loginErrors.password}</div>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  padding: '0.8rem',
                  background: loading ? '#93c5fd' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'opacity 0.2s',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Signing in...
                  </span>
                ) : (
                  <><ArrowRight size={18} /> Sign In to Portal</>
                )}
              </button>

              {/* Demo hint */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.65rem 0.85rem',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd',
                  fontSize: '0.76rem',
                  color: '#0369a1',
                  lineHeight: 1.5
                }}
              >
                <strong>Demo access:</strong> Use email <code>admin@medqueue.org</code> / password <code>password123</code>
              </div>
            </form>
          )}

          {/* ════ REGISTER FORM ════ */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} noValidate>

              {/* Full Name */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><User size={15} /></span>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="e.g. Amit Verma"
                    style={inputStyle(!!regErrors.name)}
                    value={regData.name}
                    onChange={(e) => { setRegData({ ...regData, name: e.target.value }); if (regErrors.name) setRegErrors({ ...regErrors, name: null }); }}
                    autoComplete="name"
                  />
                </div>
                {regErrors.name && <div style={errorText}>⚠ {regErrors.name}</div>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><Mail size={15} /></span>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="name@example.com"
                    style={inputStyle(!!regErrors.email)}
                    value={regData.email}
                    onChange={(e) => { setRegData({ ...regData, email: e.target.value }); if (regErrors.email) setRegErrors({ ...regErrors, email: null }); }}
                    autoComplete="email"
                  />
                </div>
                {regErrors.email && <div style={errorText}>⚠ {regErrors.email}</div>}
              </div>

              {/* Mobile */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><Phone size={15} /></span>
                  <input
                    id="reg-mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    style={inputStyle(!!regErrors.mobile)}
                    value={regData.mobile}
                    onChange={(e) => { setRegData({ ...regData, mobile: e.target.value }); if (regErrors.mobile) setRegErrors({ ...regErrors, mobile: null }); }}
                    autoComplete="tel"
                    maxLength={15}
                  />
                </div>
                {regErrors.mobile && <div style={errorText}>⚠ {regErrors.mobile}</div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Create Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><Lock size={15} /></span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    style={{ ...inputStyle(!!regErrors.password), paddingRight: '2.6rem' }}
                    value={regData.password}
                    onChange={(e) => { setRegData({ ...regData, password: e.target.value }); if (regErrors.password) setRegErrors({ ...regErrors, password: null }); }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {regErrors.password && <div style={errorText}>⚠ {regErrors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Confirm Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><Shield size={15} /></span>
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    style={{ ...inputStyle(!!regErrors.confirmPassword), paddingRight: '2.6rem' }}
                    value={regData.confirmPassword}
                    onChange={(e) => { setRegData({ ...regData, confirmPassword: e.target.value }); if (regErrors.confirmPassword) setRegErrors({ ...regErrors, confirmPassword: null }); }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {regErrors.confirmPassword && <div style={errorText}>⚠ {regErrors.confirmPassword}</div>}
                {/* Live password match indicator */}
                {regData.confirmPassword && regData.password && (
                  <div style={{ fontSize: '0.75rem', marginTop: '3px', color: regData.password === regData.confirmPassword ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {regData.password === regData.confirmPassword ? <CheckCircle2 size={12} /> : '✗'} {regData.password === regData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  padding: '0.8rem',
                  background: loading ? '#93c5fd' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Creating account...
                  </span>
                ) : (
                  <><CheckCircle2 size={18} /> Create My Account</>
                )}
              </button>

              <p style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                By registering, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          )}

          {/* ── FOOTER SWITCHER ── */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#64748b'
            }}
          >
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setLoginErrors({}); }}
                  style={{ color: '#0284c7', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Register Now →
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setRegErrors({}); }}
                  style={{ color: '#0284c7', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Sign In →
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spin animation keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
