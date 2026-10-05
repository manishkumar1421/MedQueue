import React, { useState } from 'react';
import { Search, Filter, Calendar, Stethoscope, Ticket, CheckCircle2 } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TokenTicket } from '../../components/common/TokenTicket';

export const ReceptionistAppointments = () => {
  const { appointments, departments, doctors } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState(null);

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = deptFilter === 'all' ? true : a.departmentId === deptFilter;
    const matchStatus = statusFilter === 'all' ? true : a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
          Hospital OPD Appointments Registry
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Master directory of all scheduled and walk-in patient consultations today
        </p>
      </div>

      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search patient, token, doctor..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="waiting">Waiting</option>
          <option value="confirmed">Confirmed</option>
          <option value="in consultation">In Consultation</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="med-card" style={{ padding: '1.5rem' }}>
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Time & Date</th>
                <th>Room</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
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
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{appt.patientName}</div>
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
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedAppt(appt)}
                    >
                      <Ticket size={13} />
                      Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
            patientsAhead={2}
            estimatedWait={20}
            status={selectedAppt.status}
            appointmentType={selectedAppt.type}
            onClose={() => setSelectedAppt(null)}
          />
        </Modal>
      )}
    </div>
  );
};
