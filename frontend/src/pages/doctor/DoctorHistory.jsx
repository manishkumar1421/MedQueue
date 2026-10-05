import React, { useState } from 'react';
import { History, Search, FileText, CheckCircle2, User, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge } from '../../components/common/Badge';

export const DoctorHistory = () => {
  const { currentUser } = useAuth();
  const { queue, doctors } = useHospital();

  const doctorId = currentUser?.role === 'Doctor' ? currentUser?.id || 'doc-1' : 'doc-1';
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const [searchTerm, setSearchTerm] = useState('');

  const completedList = queue.filter(
    (q) => q.doctorId === doctorId && q.status === 'Completed'
  );

  const filtered = completedList.filter((item) =>
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
          Completed Patient Consultations
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Archive of discharged consultations, diagnoses, and outpatient visits for {doctor.name}
        </p>
      </div>

      <div className="med-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', maxWidth: '420px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search completed patient records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>
      </div>

      <div className="med-card" style={{ padding: '1.5rem' }}>
        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Completed Time</th>
                <th>Chief Complaint</th>
                <th>Status</th>
                <th>Clinical Records</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                    No completed patient records match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#0284c7' }}>
                        {item.tokenNumber}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{item.patientName}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.patientMobile}</div>
                    </td>
                    <td>
                      {item.patientGender}, {item.patientAge}y
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{item.completedAt || '10:45 AM'}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: '#475569' }}>{item.reasonForVisit}</span>
                    </td>
                    <td>
                      <StatusBadge status="Completed" />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Prescribed & Closed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
