import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Calendar,
  LogIn,
  UserPlus,
  Menu,
  X,
  PhoneCall,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar = ({ onOpenLogin, onOpenRegister }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role, switchRole } = useAuth();
  const navigate = useNavigate();

  const handlePortalRedirect = () => {
    if (role === 'Patient') navigate('/patient/dashboard');
    else if (role === 'Receptionist') navigate('/receptionist/dashboard');
    else if (role === 'Doctor') navigate('/doctor/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 50,
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)'
      }}
      className="no-print"
    >
      {/* Emergency Strip */}
      <div
        style={{
          backgroundColor: '#0284c7',
          color: '#ffffff',
          fontSize: '0.8rem',
          padding: '0.35rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        className="container"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
            24/7 HELPLINE
          </span>
          <span>Emergency Ambulance & Triage: <strong>+91 (022) 4900-9999</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>NABH & JCI Accredited Hospital</span>
          <span>•</span>
          <span>OPD Hours: Mon - Sat 8:00 AM - 8:00 PM</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Activity size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>
              MedQueue
            </span>
            <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600, letterSpacing: '0.04em' }}>
              HOSPITAL QUEUE MANAGEMENT
            </span>
          </div>
        </Link>

        {/* Desktop Menu Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <a href="#home" style={{ fontSize: '0.925rem', fontWeight: 600, color: '#0f172a' }}>Home</a>
          <a href="#services" style={{ fontSize: '0.925rem', fontWeight: 500, color: '#475569' }}>Services</a>
          <a href="#departments" style={{ fontSize: '0.925rem', fontWeight: 500, color: '#475569' }}>Departments</a>
          <a href="#doctors" style={{ fontSize: '0.925rem', fontWeight: 500, color: '#475569' }}>Doctors</a>
          <a href="#how-it-works" style={{ fontSize: '0.925rem', fontWeight: 500, color: '#475569' }}>How It Works</a>
          <a href="#faq" style={{ fontSize: '0.925rem', fontWeight: 500, color: '#475569' }}>FAQ</a>
          <a href="#contact" style={{ fontSize: '0.925rem', fontWeight: 500, color: '#475569' }}>Contact</a>
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePortalRedirect}
            >
              Open {role} Portal
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '0.9rem' }}
                onClick={onOpenLogin}
              >
                <LogIn size={16} />
                Sign In
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.9rem' }}
                onClick={onOpenRegister}
              >
                <UserPlus size={16} />
                Register
              </button>
              <Link to="/patient/book-appointment" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                <Calendar size={16} />
                Book Appointment
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div style={{ display: 'flex', lg: 'none', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/patient/book-appointment" className="btn btn-primary btn-sm">
            Book
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
          className="lg:hidden"
        >
          <a href="#home" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', fontWeight: 600 }}>Home</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} style={{ color: '#475569' }}>Services</a>
          <a href="#departments" onClick={() => setMobileMenuOpen(false)} style={{ color: '#475569' }}>Departments</a>
          <a href="#doctors" onClick={() => setMobileMenuOpen(false)} style={{ color: '#475569' }}>Doctors</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: '#475569' }}>How It Works</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#475569' }}>Contact</a>
          <hr style={{ borderColor: '#f1f5f9' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onOpenLogin}>Sign In</button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={onOpenRegister}>Register</button>
          </div>
        </div>
      )}
    </header>
  );
};
