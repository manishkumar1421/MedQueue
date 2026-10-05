import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Printer,
  Download,
  Clock,
  MapPin,
  Calendar,
  User,
  HeartPulse,
  Activity,
  ArrowRight,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badge';

export const TokenTicket = ({
  tokenNumber = 'C-025',
  patientName = 'Rahul Sharma',
  doctorName = 'Dr. Amit Sharma',
  departmentName = 'Cardiology',
  roomNumber = '204',
  date = '2026-09-28',
  time = '12:30 PM',
  patientsAhead = 6,
  estimatedWait = 30,
  status = 'Waiting',
  priority = 'Normal',
  appointmentType = 'Online Appointment',
  onClose,
  showActions = true
}) => {
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleViewLiveQueue = () => {
    if (onClose) onClose();
    navigate('/patient/my-queue');
  };

  return (
    <div className="printable-token flex flex-col items-center max-w-md w-full mx-auto">
      {/* Modern Healthcare Pass Card */}
      <div
        ref={ticketRef}
        style={{
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          borderRadius: '16px',
          overflow: 'hidden',
          width: '100%',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)'
        }}
      >
        {/* Pass Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            padding: '1.25rem 1.5rem',
            color: '#ffffff',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Activity size={20} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>MedQueue</h4>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#e0f2fe' }}>OPD Queue & Appointment Token</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}
              >
                {appointmentType}
              </span>
            </div>
          </div>
        </div>

        {/* Big Token Number Callout */}
        <div
          style={{
            padding: '1.5rem 1.5rem 1.25rem',
            textAlign: 'center',
            background: '#f8fafc',
            borderBottom: '1.5px dashed #cbd5e1'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>
            YOUR APPOINTMENT TOKEN
          </div>
          <div
            style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              color: '#0284c7',
              letterSpacing: '-0.03em',
              margin: '0.25rem 0',
              fontFamily: 'monospace'
            }}
          >
            {tokenNumber}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
            <StatusBadge status={status} />
            {priority && priority !== 'Normal' && <PriorityBadge priority={priority} />}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Patient Name</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{patientName}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Department</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{departmentName}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Assigned Doctor</span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{doctorName}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>OPD Consultation Room</span>
              <strong style={{ fontSize: '1rem', color: '#0284c7' }}>Room {roomNumber}</strong>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              background: '#f1f5f9',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
              <Calendar size={16} color="#0284c7" />
              <span>{date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
              <Clock size={16} color="#0284c7" />
              <span>{time}</span>
            </div>
          </div>

          {/* Dynamic Live Wait Card */}
          <div
            style={{
              background: '#e0f2fe',
              border: '1px solid #bae6fd',
              borderRadius: '10px',
              padding: '0.9rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600, display: 'block' }}>
                PATIENTS AHEAD
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0369a1' }}>
                {patientsAhead} {patientsAhead === 1 ? 'Patient' : 'Patients'}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600, display: 'block' }}>
                ESTIMATED WAIT
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0369a1' }}>
                ~{estimatedWait} Mins
              </span>
            </div>
          </div>

          {/* Barcode & Security Marker */}
          <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              {/* Simulated crisp vector barcode stripes */}
              <div
                style={{
                  height: '34px',
                  display: 'flex',
                  gap: '3px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}
              >
                {[4, 2, 6, 3, 2, 5, 2, 4, 3, 6, 2, 4, 2, 5, 3, 4, 2, 6, 3].map((w, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${w}px`,
                      height: '100%',
                      backgroundColor: '#1e293b',
                      borderRadius: '1px'
                    }}
                  />
                ))}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>
              Scan at Hospital Kiosk or OPD Room 204 • Keep this token safe
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden on Print) */}
      {showActions && (
        <div
          className="no-print"
          style={{
            display: 'flex',
            gap: '0.75rem',
            width: '100%',
            marginTop: '1.25rem'
          }}
        >
          <button
            type="button"
            className="btn btn-outline-primary"
            style={{ flex: 1 }}
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print / Save
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1.3 }}
            onClick={handleViewLiveQueue}
          >
            View Live Queue
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
