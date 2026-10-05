import React, { useState } from 'react';
import { Clock, Users, Volume2, Search, Filter, Stethoscope, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';

export const DoctorQueue = () => {
  const { currentUser } = useAuth();
  const { queue, doctors, callNextPatient, startConsultation, completeConsultation } = useHospital();

  const doctorId = currentUser?.role === 'Doctor' ? currentUser?.id || 'doc-1' : 'doc-1';
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const docQueue = queue.filter((q) => q.doctorId === doctorId && q.status !== 'Cancelled');

  const filtered = docQueue.filter((item) => {
    const matchSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = priorityFilter === 'all' ? true : item.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
            Doctor OPD Active Queue List
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
            {doctor.name} • Room {doctor.roomNumber} ({doctor.departmentName})
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => callNextPatient(doctorId)}
        >
          <Volume2 size={16} />
          Call Next Patient
        </button>
      </div>

      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search patient name, token number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="Emergency">Emergency</option>
          <option value="Senior Citizen">Senior Citizen</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      <div className="med-card" style={{ padding: '1.5rem' }}>
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Queue #</th>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Appointment Time</th>
                <th>Priority</th>
                <th>Reason for Visit</th>
                <th>Status</th>
                <th>Desk Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#64748b' }}>#{idx + 1}</span>
                  </td>
                  <td>
                    <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#0284c7' }}>
                      {item.tokenNumber}
                    </strong>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{item.patientName}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.patientMobile}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{item.patientGender}, {item.patientAge}y</span>
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
                        Consult
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
