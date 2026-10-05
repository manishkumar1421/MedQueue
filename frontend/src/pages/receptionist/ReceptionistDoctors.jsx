import React, { useState } from 'react';
import { Stethoscope, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import { DoctorStatusBadge } from '../../components/common/Badge';

export const ReceptionistDoctors = () => {
  const { doctors, queue, updateDoctor } = useHospital();
  const [selectedDept, setSelectedDept] = useState('all');

  const filtered = doctors.filter(
    (d) => selectedDept === 'all' || d.departmentId === selectedDept
  );

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
          Doctor OPD Roster & Availability
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Real-time room occupancy, status toggles, and consultation queue load
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {filtered.map((doc) => {
          const docQueue = queue.filter((q) => q.doctorId === doc.id && q.status !== 'Cancelled');
          const waitingCount = docQueue.filter((q) => q.status === 'Waiting').length;
          const currentToken = docQueue.find((q) => q.status === 'Called' || q.status === 'In Consultation');

          return (
            <div key={doc.id} className="med-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>
                    {doc.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
                    {doc.departmentName}
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <DoctorStatusBadge status={doc.status} />
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>OPD Room:</span>
                  <strong style={{ color: '#0284c7' }}>Room {doc.roomNumber}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Waiting Patients:</span>
                  <strong style={{ color: '#d97706' }}>{waitingCount} Patients</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Active Token:</span>
                  <strong style={{ color: '#16a34a', fontFamily: 'monospace' }}>
                    {currentToken ? currentToken.tokenNumber : 'None'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Timings:</span>
                  <strong style={{ color: '#475569' }}>{doc.startTime}</strong>
                </div>
              </div>

              {/* Status Toggle for Receptionist */}
              <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Quick Status:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                  value={doc.status}
                  onChange={(e) => updateDoctor(doc.id, { status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
