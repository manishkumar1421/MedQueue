import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Ticket,
  XCircle,
  CalendarPlus,
  Stethoscope,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TokenTicket } from '../../components/common/TokenTicket';

export const MyAppointments = () => {
  const { currentUser } = useAuth();
  const { appointments, cancelQueueToken, queue } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  // Filter user's appointments
  const userAppointments = appointments.filter(
    (a) => a.patientId === currentUser?.id || a.patientName === currentUser?.name
  );

  const filtered = userAppointments.filter((a) => {
    const matchSearch =
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' ? true : a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    const matchingQueue = queue.find((q) => q.tokenNumber === cancelTarget.tokenNumber);
    if (matchingQueue) {
      cancelQueueToken(matchingQueue.id, 'Cancelled by patient');
    } else {
      toast.success('Appointment cancelled');
    }
    setCancelTarget(null);
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            My Appointments
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Manage upcoming consultations, review past visits, and access digital tokens
          </p>
        </div>
        <Link to="/patient/book-appointment" className="btn btn-primary">
          <CalendarPlus size={16} />
          Book Appointment
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by doctor, department or token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#64748b" />
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List / Table */}
      {filtered.length === 0 ? (
        <div className="med-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <AlertCircle size={40} color="#94a3b8" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
            No appointments found
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            You do not have any appointments matching the current search filters.
          </p>
          <Link to="/patient/book-appointment" className="btn btn-primary">
            Book an Appointment
          </Link>
        </div>
      ) : (
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Slot</th>
                <th>Room</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#0284c7' }}>
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
                    <strong style={{ color: '#0284c7' }}>Room {appt.room}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#475569' }}>{appt.type}</span>
                  </td>
                  <td>
                    <StatusBadge status={appt.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setSelectedAppt(appt)}
                      >
                        <Ticket size={14} />
                        Token Pass
                      </button>
                      {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.4rem 0.6rem' }}
                          onClick={() => setCancelTarget(appt)}
                          title="Cancel Appointment"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Token Pass */}
      {selectedAppt && (
        <Modal
          isOpen={!!selectedAppt}
          onClose={() => setSelectedAppt(null)}
          title={`Token Pass #${selectedAppt.tokenNumber}`}
          maxWidth="460px"
        >
          <TokenTicket
            tokenNumber={selectedAppt.tokenNumber}
            patientName={selectedAppt.patientName}
            doctorName={selectedAppt.doctorName}
            departmentName={selectedAppt.departmentName}
            roomNumber={selectedAppt.room}
            date={selectedAppt.date}
            time={selectedAppt.time}
            patientsAhead={3}
            estimatedWait={30}
            status={selectedAppt.status}
            appointmentType={selectedAppt.type}
            onClose={() => setSelectedAppt(null)}
          />
        </Modal>
      )}

      {/* Confirm Cancel Dialog */}
      {cancelTarget && (
        <ConfirmDialog
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancel}
          title="Cancel Appointment"
          message={`Are you sure you want to cancel Token #${cancelTarget.tokenNumber} for ${cancelTarget.doctorName}? This action cannot be reversed.`}
          confirmText="Yes, Cancel"
          isDanger={true}
        />
      )}
    </div>
  );
};
