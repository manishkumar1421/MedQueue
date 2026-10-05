import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Ticket,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ShieldAlert,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { TokenTicket } from '../../components/common/TokenTicket';

export const WalkInRegistration = () => {
  const { departments, doctors, registerWalkIn } = useHospital();

  const [formData, setFormData] = useState({
    patientName: '',
    mobile: '',
    age: '',
    gender: 'Male',
    departmentId: departments[0]?.id || 'dept-1',
    doctorId: '',
    priority: 'Normal', // Normal, Senior Citizen, Emergency
    reason: 'Acute OPD consultation',
    bloodGroup: 'B+'
  });

  const [generatedResult, setGeneratedResult] = useState(null);

  const filteredDoctors = doctors.filter((d) => d.departmentId === formData.departmentId);

  useEffect(() => {
    if (filteredDoctors.length > 0 && !filteredDoctors.some((d) => d.id === formData.doctorId)) {
      setFormData((prev) => ({ ...prev, doctorId: filteredDoctors[0].id }));
    }
  }, [formData.departmentId, filteredDoctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.mobile) {
      toast.error('Patient Name and Mobile Number are required');
      return;
    }

    const result = registerWalkIn(formData);
    if (result) {
      setGeneratedResult(result);
    }
  };

  const handleReset = () => {
    setGeneratedResult(null);
    setFormData({
      patientName: '',
      mobile: '',
      age: '',
      gender: 'Male',
      departmentId: departments[0]?.id || 'dept-1',
      doctorId: filteredDoctors[0]?.id || '',
      priority: 'Normal',
      reason: 'Acute OPD consultation',
      bloodGroup: 'B+'
    });
  };

  const selectedDepartment = departments.find((d) => d.id === formData.departmentId);
  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
          Walk-in Patient Triage & Token Generation
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Register hospital walk-in patients, assign medical priority, and generate instant OPD queue tokens
        </p>
      </div>

      {generatedResult ? (
        <div className="med-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            Walk-in Token Issued!
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem' }}>
            Token <strong>{generatedResult.tokenNumber}</strong> has been assigned to{' '}
            <strong>{formData.patientName}</strong>. Hand over this pass to the patient.
          </p>

          <TokenTicket
            tokenNumber={generatedResult.tokenNumber}
            patientName={formData.patientName}
            doctorName={selectedDoctor?.name || 'Dr. Amit Sharma'}
            departmentName={selectedDepartment?.name || 'Cardiology'}
            roomNumber={selectedDoctor?.roomNumber || '204'}
            date={new Date().toISOString().split('T')[0]}
            time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            patientsAhead={formData.priority === 'Emergency' ? 1 : 4}
            estimatedWait={formData.priority === 'Emergency' ? 10 : 40}
            status="Waiting"
            priority={formData.priority}
            appointmentType="Walk-in"
            showActions={true}
          />

          <div style={{ marginTop: '2rem' }}>
            <button type="button" className="btn btn-primary" onClick={handleReset}>
              <UserPlus size={16} />
              Register Next Walk-in Patient
            </button>
          </div>
        </div>
      ) : (
        <div className="med-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Priority Selector Banner */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Triage Priority Level <span className="required">*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  {
                    level: 'Normal',
                    desc: 'Standard OPD order',
                    border: '#cbd5e1',
                    color: '#475569',
                    activeBg: '#f1f5f9',
                    icon: CheckCircle2
                  },
                  {
                    level: 'Senior Citizen',
                    desc: 'Age 60+ fast-track',
                    border: '#f59e0b',
                    color: '#b45309',
                    activeBg: '#fef3c7',
                    icon: AlertTriangle
                  },
                  {
                    level: 'Emergency',
                    desc: 'Immediate triage top',
                    border: '#ef4444',
                    color: '#b91c1c',
                    activeBg: '#fee2e2',
                    icon: ShieldAlert
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.priority === item.level;
                  return (
                    <div
                      key={item.level}
                      onClick={() => setFormData((prev) => ({ ...prev, priority: item.level }))}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        border: `2px solid ${isSelected ? item.border : '#e2e8f0'}`,
                        backgroundColor: isSelected ? item.activeBg : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={20} color={isSelected ? item.color : '#94a3b8'} style={{ margin: '0 auto 0.35rem' }} />
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? item.color : '#0f172a' }}>
                        {item.level}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Demographics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Patient Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="patientName"
                  className="form-control"
                  placeholder="e.g. Ramesh Patel"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="mobile"
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age in Years</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  placeholder="e.g. 45"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-control"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department <span className="required">*</span></label>
                <select
                  name="departmentId"
                  className="form-control"
                  value={formData.departmentId}
                  onChange={handleChange}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Doctor <span className="required">*</span></label>
                <select
                  name="doctorId"
                  className="form-control"
                  value={formData.doctorId}
                  onChange={handleChange}
                >
                  {filteredDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} (Room {doc.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Visit / Symptoms</label>
                <input
                  type="text"
                  name="reason"
                  className="form-control"
                  placeholder="e.g. Chest pain, High fever, Sprained ankle"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                <RotateCcw size={16} />
                Clear Form
              </button>
              <button type="submit" className="btn btn-primary btn-lg">
                <Ticket size={18} />
                Generate Walk-in Token
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
