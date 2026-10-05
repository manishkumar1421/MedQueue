import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Clock,
  CheckCircle2,
  Volume2,
  SkipForward,
  PauseCircle,
  PlayCircle,
  XCircle,
  RotateCcw,
  UserPlus,
  Search,
  Filter,
  Ticket,
  Printer,
  Calendar,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TokenTicket } from '../../components/common/TokenTicket';

export const ReceptionistDashboard = () => {
  const {
    queue,
    doctors,
    departments,
    settings,
    callNextPatient,
    startConsultation,
    completeConsultation,
    skipPatient,
    holdPatient,
    rejoinQueue,
    cancelQueueToken
  } = useHospital();

  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-1'); // Cardiology Dr. Amit Sharma by default
  const [selectedDeptId, setSelectedDeptId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [tokenTicketModal, setTokenTicketModal] = useState(null);
  const [confirmCancelTarget, setConfirmCancelTarget] = useState(null);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Compute KPI statistics across active queues
  const totalPatients = queue.length;
  const waitingPatients = queue.filter((q) => q.status === 'Waiting').length;
  const completedPatients = queue.filter((q) => q.status === 'Completed').length;
  const skippedPatients = queue.filter((q) => q.status === 'Skipped').length;
  const onHoldPatients = queue.filter((q) => q.status === 'On Hold').length;
  const cancelledPatients = queue.filter((q) => q.status === 'Cancelled').length;

  // Active serving patient for the selected doctor
  const currentServingForDoc = queue.find(
    (q) => q.doctorId === selectedDoctorId && (q.status === 'Called' || q.status === 'In Consultation')
  );

  // Filtered Queue for the Table
  const filteredQueue = queue.filter((item) => {
    const matchDoc = selectedDoctorId === 'all' ? true : item.doctorId === selectedDoctorId;
    const matchDept = selectedDeptId === 'all' ? true : item.departmentId === selectedDeptId;
    const matchStatus = statusFilter === 'all' ? true : item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDoc && matchDept && matchStatus && matchSearch;
  });

  const handleCallNext = () => {
    callNextPatient(selectedDoctorId);
  };

  const handleConfirmCancel = () => {
    if (confirmCancelTarget) {
      cancelQueueToken(confirmCancelTarget.id, 'Cancelled by Reception Desk');
      setConfirmCancelTarget(null);
    }
  };

  return (
    <div>
      {/* Top Header */}
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
            Reception & Queue Desk
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Live triage control, patient walk-in token issuance, and OPD desk pacing
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/receptionist/walk-in" className="btn btn-secondary">
            <UserPlus size={16} />
            Register Walk-in Patient
          </Link>

          {/* MAIN HERO BUTTON: CALL NEXT PATIENT */}
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleCallNext}
            style={{
              padding: '0.75rem 1.6rem',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
            }}
          >
            <Volume2 size={20} className="animate-pulse" />
            CALL NEXT PATIENT
          </button>
        </div>
      </div>

      {/* 7 KPI Dashboard Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Patients Today
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {totalPatients}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Waiting Patients
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>
              {waitingPatients}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Ticket size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Current Token
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', fontFamily: 'monospace' }}>
              {currentServingForDoc ? currentServingForDoc.tokenNumber : 'None'}
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
              {completedPatients}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <SkipForward size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Skipped / Missed
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>
              {skippedPatients}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
            <XCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Cancelled
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#475569' }}>
              {cancelledPatients}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Avg Wait Time
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed' }}>
              {settings.avgConsultationTime} Mins
            </div>
          </div>
        </div>
      </div>

      {/* Currently Serving Banner for Selected Doctor */}
      <div
        className="med-card"
        style={{
          padding: '1.5rem',
          marginBottom: '1.75rem',
          backgroundColor: '#ffffff',
          borderLeft: '5px solid #0284c7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              fontFamily: 'monospace'
            }}
          >
            {currentServingForDoc ? currentServingForDoc.tokenNumber : '--'}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
              ACTIVE OPD CONSULTATION • ROOM {selectedDoctor?.roomNumber}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px' }}>
              {currentServingForDoc ? currentServingForDoc.patientName : 'No Patient in Consultation'}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Doctor: <strong>{selectedDoctor?.name}</strong> ({selectedDoctor?.departmentName})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {currentServingForDoc && (
            <>
              {currentServingForDoc.status === 'Called' ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => startConsultation(currentServingForDoc.id)}
                >
                  <PlayCircle size={15} />
                  Start Consultation
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => completeConsultation(currentServingForDoc.id)}
                >
                  <CheckCircle2 size={15} />
                  Mark Completed
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => skipPatient(currentServingForDoc.id)}
              >
                <SkipForward size={15} />
                Skip
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => holdPatient(currentServingForDoc.id)}
              >
                <PauseCircle size={15} />
                Hold
              </button>
            </>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCallNext}
          >
            <Volume2 size={16} />
            Next Patient
          </button>
        </div>
      </div>

      {/* QUEUE MANAGEMENT TABLE WITH ACTIONS */}
      <div className="med-card" style={{ padding: '1.5rem' }}>
        {/* Table Filter Controls */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}
        >
          {/* Doctor filter dropdown */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Select Doctor Desk:
              </label>
              <select
                className="form-control"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                style={{ width: 'auto', fontWeight: 600 }}
              >
                <option value="all">All Doctors</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} (Room {doc.roomNumber} - {doc.departmentName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Status Filter:
              </label>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">All Statuses</option>
                <option value="waiting">Waiting</option>
                <option value="called">Called</option>
                <option value="in consultation">In Consultation</option>
                <option value="completed">Completed</option>
                <option value="skipped">Skipped</option>
                <option value="on hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search token, patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>
        </div>

        {/* Table */}
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Time</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Est. Wait</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                    No queue tokens match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item, idx) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#0284c7' }}>
                        {item.tokenNumber}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.patientName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {item.patientGender}, {item.patientAge}y • {item.patientMobile}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.doctorName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>Room {item.roomNumber}</div>
                    </td>
                    <td>{item.departmentName}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{item.appointmentTime}</span>
                    </td>
                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
                        {item.status === 'Completed'
                          ? 'Done'
                          : item.status === 'In Consultation'
                          ? 'In Room'
                          : `~${idx * 10}m`}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'nowrap' }}>
                        {/* Action: Call */}
                        {item.status === 'Waiting' && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            title="Call Patient"
                            onClick={() => {
                              callNextPatient(item.doctorId);
                            }}
                          >
                            <Volume2 size={13} />
                            Call
                          </button>
                        )}

                        {/* Action: Complete */}
                        {(item.status === 'Called' || item.status === 'In Consultation') && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            title="Complete Consultation"
                            onClick={() => completeConsultation(item.id)}
                          >
                            <CheckCircle2 size={13} />
                            Done
                          </button>
                        )}

                        {/* Action: Skip */}
                        {(item.status === 'Waiting' || item.status === 'Called') && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            title="Skip Patient"
                            onClick={() => skipPatient(item.id)}
                          >
                            <SkipForward size={13} />
                          </button>
                        )}

                        {/* Action: Hold */}
                        {item.status === 'Waiting' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            title="Hold Patient"
                            onClick={() => holdPatient(item.id)}
                          >
                            <PauseCircle size={13} />
                          </button>
                        )}

                        {/* Action: Rejoin / Resume */}
                        {(item.status === 'Skipped' || item.status === 'On Hold') && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            title="Rejoin Active Queue"
                            onClick={() => rejoinQueue(item.id)}
                          >
                            <RotateCcw size={13} />
                            Rejoin
                          </button>
                        )}

                        {/* Action: Print Token */}
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          title="Print Token Pass"
                          onClick={() => setTokenTicketModal(item)}
                        >
                          <Ticket size={14} />
                        </button>

                        {/* Action: Cancel */}
                        {item.status !== 'Completed' && item.status !== 'Cancelled' && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#ef4444' }}
                            title="Cancel Token"
                            onClick={() => setConfirmCancelTarget(item)}
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Token Pass */}
      {tokenTicketModal && (
        <Modal
          isOpen={!!tokenTicketModal}
          onClose={() => setTokenTicketModal(null)}
          title={`Token Pass #${tokenTicketModal.tokenNumber}`}
          maxWidth="460px"
        >
          <TokenTicket
            tokenNumber={tokenTicketModal.tokenNumber}
            patientName={tokenTicketModal.patientName}
            doctorName={tokenTicketModal.doctorName}
            departmentName={tokenTicketModal.departmentName}
            roomNumber={tokenTicketModal.roomNumber}
            date={tokenTicketModal.date}
            time={tokenTicketModal.appointmentTime}
            patientsAhead={3}
            estimatedWait={30}
            status={tokenTicketModal.status}
            priority={tokenTicketModal.priority}
            appointmentType={tokenTicketModal.appointmentType}
            onClose={() => setTokenTicketModal(null)}
          />
        </Modal>
      )}

      {/* Confirm Cancel Dialog */}
      {confirmCancelTarget && (
        <ConfirmDialog
          isOpen={!!confirmCancelTarget}
          onClose={() => setConfirmCancelTarget(null)}
          onConfirm={handleConfirmCancel}
          title="Cancel Token"
          message={`Are you sure you want to cancel token #${confirmCancelTarget.tokenNumber} for ${confirmCancelTarget.patientName}?`}
          confirmText="Yes, Cancel"
          isDanger={true}
        />
      )}
    </div>
  );
};
