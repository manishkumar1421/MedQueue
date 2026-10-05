import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Activity,
  User,
  Users,
  AlertCircle,
  ArrowRight,
  Ticket,
  Printer,
  CalendarPlus,
  Stethoscope,
  ChevronRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { QueueProgressBar } from '../../components/common/QueueProgressBar';
import { Modal } from '../../components/common/Modal';
import { TokenTicket } from '../../components/common/TokenTicket';

export const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const { queue, appointments, getQueueStatsForToken } = useHospital();
  const navigate = useNavigate();

  const [selectedTokenModal, setSelectedTokenModal] = useState(false);

  // Find user's active appointment & queue item
  // Defaults to demo patient's active Cardiology token C-025 or user's item
  const myQueueItem = queue.find(
    (q) => (q.patientId === currentUser?.id || q.patientName === currentUser?.name) &&
           q.status !== 'Completed' && q.status !== 'Cancelled'
  ) || queue.find((q) => q.tokenNumber === 'C-025');

  const stats = myQueueItem
    ? getQueueStatsForToken(myQueueItem.tokenNumber, myQueueItem.doctorId)
    : { currentServing: null, patientsAhead: 0, estimatedWait: 0, status: 'No Active Queue' };

  // User's recent appointments
  const myAppointments = appointments.filter(
    (a) => a.patientId === currentUser?.id || a.patientName === currentUser?.name
  );

  return (
    <div>
      {/* Welcome banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: 'clamp(1.25rem, 3vw, 1.75rem)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#e0f2fe', fontWeight: 600, marginBottom: '0.25rem' }}>
            PATIENT OUTPATIENT PORTAL
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Welcome back, {currentUser?.name || 'Patient'}
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: '#e0f2fe', fontSize: '0.875rem' }}>
            Your next consultation is scheduled with Dr. Amit Sharma (Cardiology) in Room 204.
          </p>
        </div>
        <div className="btn-group-responsive">
          <Link to="/patient/book-appointment" className="btn btn-secondary" style={{ backgroundColor: '#ffffff', color: '#0284c7' }}>
            <CalendarPlus size={16} />
            Book Appointment
          </Link>
          <Link to="/patient/my-queue" className="btn" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
            <Clock size={16} />
            Live Queue Monitor
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        {/* Today's Appointment */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Today's Appointment
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
              {myQueueItem ? myQueueItem.appointmentTime : '12:30 PM'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
              {myQueueItem ? myQueueItem.doctorName : 'Dr. Amit Sharma'}
            </div>
          </div>
        </div>

        {/* Current Token */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Ticket size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Your Token
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              {myQueueItem ? myQueueItem.tokenNumber : 'C-025'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Cardiology (Room 204)
            </div>
          </div>
        </div>

        {/* Patients Ahead */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Patients Ahead
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>
              {stats.patientsAhead} {stats.patientsAhead === 1 ? 'Patient' : 'Patients'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              In queue line
            </div>
          </div>
        </div>

        {/* Estimated Waiting Time */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Estimated Waiting Time
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed' }}>
              ~{stats.estimatedWait} Mins
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Based on OPD speed
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SECTION: "Current Queue Status" */}
      <div className="med-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="live-pulse-dot" />
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Current Queue Status
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Real-time synchronization with Doctor's consultation desk
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedTokenModal(true)}
            >
              <Ticket size={16} />
              View Token Pass
            </button>
            <Link to="/patient/my-queue" className="btn btn-primary btn-sm">
              Full Queue Screen <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Detailed Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1.25rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
              DOCTOR ASSIGNED
            </span>
            <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
              {myQueueItem ? myQueueItem.doctorName : 'Dr. Amit Sharma'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#0284c7', display: 'block' }}>
              Room {myQueueItem ? myQueueItem.roomNumber : '204'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
              DEPARTMENT
            </span>
            <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
              {myQueueItem ? myQueueItem.departmentName : 'Cardiology'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
              Specialty Wing
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, display: 'block' }}>
              CURRENT TOKEN SERVING
            </span>
            <strong style={{ fontSize: '1.35rem', color: '#15803d', fontFamily: 'monospace' }}>
              {stats.currentServing ? stats.currentServing.tokenNumber : 'C-018'}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#166534', display: 'block' }}>
              In Consultation
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, display: 'block' }}>
              YOUR TOKEN NUMBER
            </span>
            <strong style={{ fontSize: '1.35rem', color: '#0284c7', fontFamily: 'monospace' }}>
              {myQueueItem ? myQueueItem.tokenNumber : 'C-025'}
            </strong>
            <div style={{ marginTop: '2px' }}>
              <StatusBadge status={myQueueItem ? myQueueItem.status : 'Waiting'} />
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
              PATIENTS AHEAD
            </span>
            <strong style={{ fontSize: '1.35rem', color: '#d97706' }}>
              {stats.patientsAhead}
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
              ~{stats.estimatedWait} Mins wait
            </span>
          </div>
        </div>

        {/* Visual Queue Progress Indicator */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
            Queue Stage Progression:
          </div>
          <QueueProgressBar status={myQueueItem ? myQueueItem.status : 'Waiting'} />
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="med-card" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              My Appointments & Consultations
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.825rem', color: '#64748b' }}>
              History and upcoming visits
            </p>
          </div>
          <Link to="/patient/my-appointments" className="btn btn-ghost btn-sm">
            View All ({myAppointments.length})
          </Link>
        </div>

        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Room</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.slice(0, 4).map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <strong style={{ fontFamily: 'monospace', color: '#0284c7', fontSize: '0.95rem' }}>
                      {appt.tokenNumber}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{appt.doctorName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{appt.reason}</div>
                  </td>
                  <td>{appt.departmentName}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{appt.date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{appt.time}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0284c7' }}>Room {appt.room}</span>
                  </td>
                  <td>
                    <StatusBadge status={appt.status} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedTokenModal(true)}
                    >
                      Token Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Token Modal View */}
      {selectedTokenModal && (
        <Modal
          isOpen={selectedTokenModal}
          onClose={() => setSelectedTokenModal(false)}
          title="Appointment Token Confirmation"
          maxWidth="460px"
        >
          <TokenTicket
            tokenNumber={myQueueItem ? myQueueItem.tokenNumber : 'C-025'}
            patientName={currentUser?.name || 'Rahul Sharma'}
            doctorName={myQueueItem ? myQueueItem.doctorName : 'Dr. Amit Sharma'}
            departmentName={myQueueItem ? myQueueItem.departmentName : 'Cardiology'}
            roomNumber={myQueueItem ? myQueueItem.roomNumber : '204'}
            date={myQueueItem ? myQueueItem.date : '2026-09-28'}
            time={myQueueItem ? myQueueItem.appointmentTime : '12:30 PM'}
            patientsAhead={stats.patientsAhead}
            estimatedWait={stats.estimatedWait}
            status={myQueueItem ? myQueueItem.status : 'Waiting'}
            priority={myQueueItem ? myQueueItem.priority : 'Normal'}
            onClose={() => setSelectedTokenModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};
