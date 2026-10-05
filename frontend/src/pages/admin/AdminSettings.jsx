import React, { useState } from 'react';
import { Sliders, Save, RotateCcw, AlertTriangle, ShieldCheck, Clock, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminSettings = () => {
  const { settings, updateSettings, resetToDemoData } = useHospital();

  const [form, setForm] = useState({ ...settings });
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleConfirmReset = () => {
    resetToDemoData();
    setResetConfirm(false);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
          Hospital OPD Queue Configuration
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Global queue parameters, consultation calculation weights, and operational parameters
        </p>
      </div>

      <div className="med-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Queue Calculation Logic */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#0284c7" />
              Dynamic Waiting Time Logic
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Waiting Time is calculated dynamically: <code>Patients Ahead × Average Consultation Time</code>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Average Consultation Time (Minutes) <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  value={form.avgConsultationTime}
                  min={3}
                  max={60}
                  onChange={(e) => setForm({ ...form, avgConsultationTime: parseInt(e.target.value, 10) || 10 })}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  If 5 patients are ahead: estimated wait = {5 * (form.avgConsultationTime || 10)} mins.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital Working Hours Start</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.workingHoursStart}
                  onChange={(e) => setForm({ ...form, workingHoursStart: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital Working Hours End</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.workingHoursEnd}
                  onChange={(e) => setForm({ ...form, workingHoursEnd: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Tokens / Doctor / Day</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.maxTokensPerDoctorPerDay}
                  onChange={(e) => setForm({ ...form, maxTokensPerDoctorPerDay: parseInt(e.target.value, 10) || 35 })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Priority Engine */}
          <div style={{ marginBottom: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#0284c7" />
              Triage Priority Rules
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Configure how Emergency and Senior Citizen tokens are ordered in active doctor queues.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
              <div
                style={{
                  padding: '1rem',
                  border: '1px solid #fee2e2',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2'
                }}
              >
                <div style={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.9rem' }}>
                  1. Emergency Level
                </div>
                <p style={{ fontSize: '0.78rem', color: '#991b1b', margin: '4px 0 0' }}>
                  Placed immediately behind currently serving token for instant next call.
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  border: '1px solid #fef3c7',
                  borderRadius: '10px',
                  backgroundColor: '#fffbeb'
                }}
              >
                <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.9rem' }}>
                  2. Senior Citizen Level
                </div>
                <p style={{ fontSize: '0.78rem', color: '#92400e', margin: '4px 0 0' }}>
                  Prioritized over standard walk-ins and routine online check-ins.
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc'
                }}
              >
                <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>
                  3. Normal Level
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0' }}>
                  Sequential appointment schedule and walk-in issuance order.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Audio & Notifications */}
          <div style={{ marginBottom: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} color="#0284c7" />
              Notifications & Sound Alerts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={form.soundAlertEnabled}
                  onChange={(e) => setForm({ ...form, soundAlertEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
                />
                Play soft hospital chime audio when doctor/receptionist calls next token
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={form.smsNotificationEnabled}
                  onChange={(e) => setForm({ ...form, smsNotificationEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
                />
                Enable simulated SMS & In-app alerts when patient is within 2 tokens
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              style={{ color: '#ef4444' }}
              onClick={() => setResetConfirm(true)}
            >
              <RotateCcw size={16} />
              Restore All Demo Data
            </button>

            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {resetConfirm && (
        <ConfirmDialog
          isOpen={resetConfirm}
          onClose={() => setResetConfirm(false)}
          onConfirm={handleConfirmReset}
          title="Restore Demo Data"
          message="Are you sure you want to reset all queues, appointments, and doctors back to original factory demo data?"
          confirmText="Yes, Reset"
          isDanger={true}
        />
      )}
    </div>
  );
};
