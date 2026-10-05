import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errs.email = 'Valid email address is required';
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10)
      errs.mobile = 'Valid 10-digit mobile number is required';
    if (!formData.password || formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the highlighted errors');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password
    });

    if (result.success) {
      navigate('/patient/dashboard');
    }
  };

  const inputWrapper = { position: 'relative', marginBottom: '0' };
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
        padding: '2.5rem 1rem'
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>

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
                PATIENT PORTAL
              </span>
            </div>
          </Link>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '1.5rem', marginBottom: '0.35rem' }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Register to book appointments and track your OPD queue in real time
          </p>
        </div>

        {/* Form Card */}
        <div className="med-card" style={{ padding: 'clamp(1.25rem, 5vw, 2rem)' }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <div style={inputWrapper}>
                <span style={iconStyle}><User size={16} /></span>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="e.g. Amit Verma"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <div style={inputWrapper}>
                <span style={iconStyle}><Mail size={16} /></span>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label className="form-label">
                Mobile Number <span className="required">*</span>
              </label>
              <div style={inputWrapper}>
                <span style={iconStyle}><Phone size={16} /></span>
                <input
                  type="tel"
                  name="mobile"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={15}
                />
              </div>
              {errors.mobile && <div className="form-error">{errors.mobile}</div>}
            </div>

            {/* Password & Confirm - responsive stack on mobile */}
            <div className="form-row-2">
              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  Password <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconStyle}><Lock size={16} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">
                  Confirm Password <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconStyle}><Shield size={16} /></span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', color: '#94a3b8', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', padding: 0
                    }}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>
            </div>

            {/* Live match indicator */}
            {formData.confirmPassword && formData.password && (
              <div
                style={{
                  fontSize: '0.8rem',
                  color: formData.password === formData.confirmPassword ? '#10b981' : '#ef4444',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  marginBottom: '0.75rem', marginTop: '-0.25rem'
                }}
              >
                {formData.password === formData.confirmPassword
                  ? <><CheckCircle2 size={13} /> Passwords match</>
                  : <>✗ Passwords do not match</>}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <UserPlus size={18} />
              Create My Account
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#0284c7' }}>
              Sign In here
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: '#64748b' }}>
            ← Back to Hospital Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};
