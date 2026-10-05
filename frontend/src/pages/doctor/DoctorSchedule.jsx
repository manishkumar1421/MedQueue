import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';

export const DoctorSchedule = () => {
  const { currentUser } = useAuth();
  const { doctors, updateDoctor } = useHospital();

  const doctorId = currentUser?.role === 'Doctor' ? currentUser?.id || 'doc-1' : 'doc-1';
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

  const [scheduleData, setScheduleData] = useState({
    startTime: doctor.startTime || '09:00 AM',
    endTime: doctor.endTime || '04:00 PM',
    breakTime: doctor.breakTime || '01:00 PM - 02:00 PM',
    maxPatients: doctor.maxPatients || 25,
    roomNumber: doctor.roomNumber || '204',
    status: doctor.status || 'Available',
    availableDays: doctor.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    setScheduleData((prev) => {
      const exists = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: exists
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day]
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateDoctor(doctor.id, scheduleData);
    toast.success('Doctor schedule and OPD availability updated!');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
          Doctor OPD Schedule & Availability
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Manage your consultation hours, room allocation, daily patient intake quotas, and active OPD status
        </p>
      </div>

      <div className="med-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSave}>
          {/* Status Bar */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              marginBottom: '1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                CURRENT AVAILABILITY STATUS
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                Doctor is currently marked as: <strong>{scheduleData.status}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Available', 'Busy', 'On Leave', 'Unavailable'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setScheduleData({ ...scheduleData, status: st })}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    border: `1.5px solid ${scheduleData.status === st ? '#0284c7' : '#cbd5e1'}`,
                    backgroundColor: scheduleData.status === st ? '#0284c7' : '#ffffff',
                    color: scheduleData.status === st ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">OPD Start Time</label>
              <input
                type="text"
                className="form-control"
                value={scheduleData.startTime}
                onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                placeholder="e.g. 09:00 AM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">OPD End Time</label>
              <input
                type="text"
                className="form-control"
                value={scheduleData.endTime}
                onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                placeholder="e.g. 04:00 PM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lunch / Break Period</label>
              <input
                type="text"
                className="form-control"
                value={scheduleData.breakTime}
                onChange={(e) => setScheduleData({ ...scheduleData, breakTime: e.target.value })}
                placeholder="e.g. 01:00 PM - 02:00 PM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input
                type="text"
                className="form-control"
                value={scheduleData.roomNumber}
                onChange={(e) => setScheduleData({ ...scheduleData, roomNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Patients Per Day</label>
              <input
                type="number"
                className="form-control"
                value={scheduleData.maxPatients}
                onChange={(e) => setScheduleData({ ...scheduleData, maxPatients: parseInt(e.target.value, 10) || 25 })}
              />
            </div>
          </div>

          {/* Available Days */}
          <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.65rem', display: 'block' }}>
              Available Consultation Days:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {daysOfWeek.map((day) => {
                const isSelected = scheduleData.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: `1.5px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                      backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                      color: isSelected ? '#0284c7' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={18} />
              Save Schedule Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
