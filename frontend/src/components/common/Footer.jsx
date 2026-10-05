import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  ChevronRight
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        paddingTop: 'clamp(2.5rem, 4vw, 3.5rem)',
        paddingBottom: '2rem',
        marginTop: 'auto'
      }}
      className="no-print"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '2.5rem'
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Activity size={22} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                MedQueue
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Next-generation hospital outpatient queue management platform designed to eliminate waiting room congestion, streamline doctor consultations, and provide real-time token tracking.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontSize: '0.825rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>HIPAA Compliant & ISO 27001 Certified</span>
            </div>
          </div>

          {/* Col 2: Clinical Departments */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              Key Departments
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Cardiology & Heart Care', 'General Medicine & OPD', 'Orthopedics & Joint Clinic', 'Dermatology & Cosmetology', 'Pediatrics & Neonatology', 'Neurology & Stroke Center'].map((dept) => (
                <li key={dept}>
                  <a href="#departments" style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ChevronRight size={14} color="#0284c7" />
                    {dept}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Patient Portals */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              Quick Links & Portals
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/patient/book-appointment" style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#0284c7" />
                  Book OPD Appointment
                </Link>
              </li>
              <li>
                <Link to="/patient/my-queue" style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#0284c7" />
                  Track Live Queue
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#0284c7" />
                  Staff & Doctor Login
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#0284c7" />
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight size={14} color="#0284c7" />
                  Hospital Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Hospital Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              Hospital Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>MedQueue Multi-Specialty Hospital, Central Medical Enclave, Sector 12, Mumbai, MH - 400051</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="#0284c7" />
                <span>+91 (022) 4900-8800 / 9999</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} color="#0284c7" />
                <span>care@medqueue.hospital.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} color="#0284c7" />
                <span>Emergency: 24/7 | OPD: 08:00 AM - 08:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.825rem',
            color: '#94a3b8'
          }}
        >
          <div>
            © {new Date().getFullYear()} MedQueue - Hospital Queue Management System. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy" style={{ color: '#94a3b8' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#94a3b8' }}>Terms of Service</a>
            <a href="#patient-rights" style={{ color: '#94a3b8' }}>Patient Rights Charter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
