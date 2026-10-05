import React, { useState } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  Volume2,
  PlayCircle,
  SkipForward,
  PauseCircle,
  FileText,
  AlertCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';

export const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const {
    queue,
    doctors,
    settings,
    callNextPatient,
    startConsultation,
    completeConsultation,
    skipPatient,
    holdPatient
  } = useHospital();

  const [clinicalNotes, setClinicalNotes] = useState('');

  // Doctor id matching current user or Dr. Amit Sharma
  const doctorId = currentUser?.role === 'Doctor' ? currentUser?.id || 'doc-1' : 'doc-1';
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  // Queue for this doctor
  const docQueue = queue.filter((q) => q.doctorId === doctorId && q.status !== 'Cancelled');
  const todayTotal = docQueue.length;
  const waitingList = docQueue.filter((q) => q.status === 'Waiting');
  const completedList = docQueue.filter((q) => q.status === 'Completed');

  // Currently serving patient (either In Consultation or Called)
  const currentPatient = docQueue.find(
    (q) => q.status === 'In Consultation' || q.status === 'Called'
  );

  // Next patient in line
  const nextPatient = waitingList[0];

  const handleCallNext = () => {
    callNextPatient(doctorId);
  };

  const handleCompleteCurrent = () => {
    if (!currentPatient) return;
    completeConsultation(currentPatient.id);
    setClinicalNotes('');
  };

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {doctor.name} • OPD Desk
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            {doctor.specialization} • Room {doctor.roomNumber} ({doctor.departmentName})
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleCallNext}
        >
          <Volume2 size={20} className="animate-pulse" />
          Call Next Patient
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Today's Patients
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {todayTotal}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Waiting in Lounge
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>
              {waitingList.length}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Completed
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>
              {completedList.length}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Avg Consult Time
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed' }}>
              {settings.avgConsultationTime} Mins
            </div>
          </div>
        </div>
      </div>

      {/* CURRENT PATIENT SECTION (CORE OF DOCTOR WORKFLOW) */}
      <div
        className="med-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          borderLeft: '6px solid #0284c7'
        }}
      >
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
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ACTIVE OPD CONSULTATION
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              Current Patient in Room {doctor.roomNumber}
            </h2>
          </div>

          {currentPatient && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <StatusBadge status={currentPatient.status} />
              <PriorityBadge priority={currentPatient.priority} />
            </div>
          )}
        </div>

        {currentPatient ? (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                backgroundColor: '#f8fafc',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>TOKEN NUMBER</span>
                <strong style={{ fontSize: '1.8rem', color: '#0284c7', fontFamily: 'monospace' }}>
                  {currentPatient.tokenNumber}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>PATIENT NAME</span>
                <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>{currentPatient.patientName}</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                  {currentPatient.patientGender}, {currentPatient.patientAge} Years
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>APPOINTMENT TIME</span>
                <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{currentPatient.appointmentTime}</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>{currentPatient.appointmentType}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>REASON FOR VISIT</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                  {currentPatient.reasonForVisit}
                </p>
              </div>
            </div>

            {/* Clinical Assessment / Prescription input */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#0284c7" />
                Doctor's Clinical Notes & Rx Prescription:
              </label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="Enter diagnosis, vitals (BP, pulse, SPO2), and prescribed medication details..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
              />
            </div>

            {/* ACTION BUTTONS (Start Consultation, Complete, Skip, Hold) */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {currentPatient.status === 'Called' ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => startConsultation(currentPatient.id)}
                  >
                    <PlayCircle size={16} />
                    Start Consultation
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success btn-lg"
                    onClick={handleCompleteCurrent}
                  >
                    <CheckCircle2 size={18} />
                    Complete Consultation
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => skipPatient(currentPatient.id)}
                >
                  <SkipForward size={16} />
                  Skip
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => holdPatient(currentPatient.id)}
                >
                  <PauseCircle size={16} />
                  Hold
                </button>
              </div>

              {/* Next Patient Callout */}
              {nextPatient && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Next Waiting:</span>
                  <strong style={{ color: '#0284c7', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    {nextPatient.tokenNumber}
                  </strong>
                  <span>({nextPatient.patientName})</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleCallNext}
                  >
                    Call Next
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <AlertCircle size={40} color="#94a3b8" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              No Patient Currently in Consultation
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Click the button below to call the next waiting patient into Room {doctor.roomNumber}.
            </p>
            <button type="button" className="btn btn-primary btn-lg" onClick={handleCallNext}>
              <Volume2 size={18} />
              Call Next Patient ({nextPatient ? nextPatient.tokenNumber : 'Queue Ready'})
            </button>
          </div>
        )}
      </div>

      {/* TODAY'S QUEUE OVERVIEW FOR DOCTOR */}
      <div className="med-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Today's Patient Queue ({docQueue.length})
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.825rem', color: '#64748b' }}>
              Chronological OPD sequence
            </p>
          </div>
        </div>

        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Appointment Time</th>
                <th>Priority</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {docQueue.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#0284c7' }}>
                      {item.tokenNumber}
                    </strong>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{item.patientName}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem' }}>{item.patientGender}, {item.patientAge}y</span>
                  </td>
                  <td>{item.appointmentTime}</td>
                  <td>
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: '#475569' }}>{item.reasonForVisit}</span>
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    {item.status === 'Waiting' && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => callNextPatient(doctorId)}
                      >
                        <Volume2 size={13} /> Call
                      </button>
                    )}
                    {item.status === 'Called' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => startConsultation(item.id)}
                      >
                        Start
                      </button>
                    )}
                    {item.status === 'In Consultation' && (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => completeConsultation(item.id)}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
