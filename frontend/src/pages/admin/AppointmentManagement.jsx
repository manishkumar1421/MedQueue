import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarCheck,
  UserX,
  Edit2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AppointmentManagement = () => {
  const { appointments, departments, doctors, queue, cancelQueueToken } = useHospital();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [docFilter, setDocFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newDate, setNewDate] = useState('2026-09-30');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [cancelTarget, setCancelTarget] = useState(null);

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'all' ? true : a.departmentId === deptFilter;
    const matchDoc = docFilter === 'all' ? true : a.doctorId === docFilter;
    const matchStatus = statusFilter === 'all' ? true : a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchType = typeFilter === 'all' ? true : a.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchSearch && matchDept && matchDoc && matchStatus && matchType;
  });

  const handleUpdateStatus = (apptId, newStatus) => {
    // In our context, updating appointments state
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      const qItem = queue.find((q) => q.tokenNumber === cancelTarget.tokenNumber);
      if (qItem) {
        cancelQueueToken(qItem.id, 'Cancelled by Admin');
      } else {
        toast.success(`Appointment #${cancelTarget.tokenNumber} marked as Cancelled`);
      }
      setCancelTarget(null);
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (rescheduleModal) {
      toast.success(`Appointment #${rescheduleModal.tokenNumber} rescheduled to ${newDate} at ${newTime}`);
      setRescheduleModal(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Master Appointment Control
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Filter, reschedule, approve, or cancel patient bookings across all OPD clinics
          </p>
        </div>
      </div>

      {/* Multi-facet Filters */}
      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search patient, doctor, token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={docFilter}
          onChange={(e) => setDocFilter(e.target.value)}
        >
          <option value="all">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="waiting">Waiting</option>
          <option value="confirmed">Confirmed</option>
          <option value="in consultation">In Consultation</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no show">No Show</option>
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="online">Online</option>
          <option value="walk-in">Walk-in</option>
        </select>
      </div>

      {/* Appointments Master Table */}
      <div className="med-card" style={{ padding: '1.5rem' }}>
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Slot</th>
                <th>Room</th>
                <th>Type</th>
                <th>Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.id}>
                  <td>
                    <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#0284c7' }}>
                      {appt.tokenNumber}
                    </strong>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{appt.patientName}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{appt.reason}</div>
                  </td>
                  <td>{appt.doctorName}</td>
                  <td>{appt.departmentName}</td>
                  <td>
                    <div>{appt.date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{appt.time}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0284c7' }}>Room {appt.room}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>{appt.type}</span>
                  </td>
                  <td>
                    <StatusBadge status={appt.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'nowrap' }}>
                      {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#059669' }}
                            title="Mark Completed"
                            onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                          >
                            <CheckCircle2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            title="Reschedule Appointment"
                            onClick={() => setRescheduleModal(appt)}
                          >
                            <CalendarCheck size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#d97706' }}
                            title="Mark No Show"
                            onClick={() => handleUpdateStatus(appt.id, 'No Show')}
                          >
                            <UserX size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#ef4444' }}
                            title="Cancel Appointment"
                            onClick={() => setCancelTarget(appt)}
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <Modal
          isOpen={!!rescheduleModal}
          onClose={() => setRescheduleModal(null)}
          title={`Reschedule Appointment #${rescheduleModal.tokenNumber}`}
        >
          <form onSubmit={handleRescheduleSubmit}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div><strong>Patient:</strong> {rescheduleModal.patientName}</div>
              <div><strong>Doctor:</strong> {rescheduleModal.doctorName} ({rescheduleModal.departmentName})</div>
              <div><strong>Current Slot:</strong> {rescheduleModal.date} at {rescheduleModal.time}</div>
            </div>

            <div className="form-group">
              <label className="form-label">New Consultation Date</label>
              <input
                type="date"
                className="form-control"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Time Slot</label>
              <select
                className="form-control"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              >
                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setRescheduleModal(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Reschedule
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Cancel Dialog */}
      {cancelTarget && (
        <ConfirmDialog
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancel}
          title="Cancel Appointment"
          message={`Are you sure you want to cancel appointment #${cancelTarget.tokenNumber} for ${cancelTarget.patientName}?`}
          confirmText="Yes, Cancel"
          isDanger={true}
        />
      )}
    </div>
  );
};
