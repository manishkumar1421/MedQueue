import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Heart, Shield, Save, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';

export const PatientProfile = () => {
  const { currentUser, role } = useAuth();
  const { updatePatient } = useHospital();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Rahul Sharma',
    email: currentUser?.email || 'rahul.sharma@example.com',
    mobile: currentUser?.mobile || '9876543210',
    dob: currentUser?.dob || '1994-06-15',
    gender: currentUser?.gender || 'Male',
    bloodGroup: currentUser?.bloodGroup || 'A+',
    address: currentUser?.address || 'B-402, Green Valley Apartments, Mumbai',
    emergencyContact: '+91 98220 54321 (Spouse)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser?.id) {
      updatePatient(currentUser.id, formData);
    }
    toast.success('Profile details saved successfully!');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
          {role} Profile Settings
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Manage your personal information, contact coordinates, and hospital medical identifiers
        </p>
      </div>

      <div className="med-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        {/* Profile Avatar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '1.75rem',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800,
              border: '2px solid #bae6fd'
            }}
          >
            {formData.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
              {formData.name}
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                {role}
              </span>
              <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
                Blood Group: <strong style={{ color: '#ef4444' }}>{formData.bloodGroup}</strong>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                />
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <textarea
              rows={2}
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact Person & Phone</label>
            <input
              type="text"
              className="form-control"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
