import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email address');
      return;
    }
    setSubmitted(true);
    toast.success('Password reset link sent to your email!');
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Activity size={24} />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              MedQueue
            </span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '1.25rem', marginBottom: '0.35rem' }}>
            Reset Password
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Enter your email and we'll send you recovery instructions
          </p>
        </div>

        <div className="med-card" style={{ padding: '2rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#d1fae5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CheckCircle2 size={30} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Check Your Inbox
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                We've sent a password reset token and verification link to <strong>{email}</strong>.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-control"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Send Reset Link
                <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <Link to="/login" style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
