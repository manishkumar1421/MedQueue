import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Activity,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Building2,
  Check,
  Star,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { useAuth } from '../../contexts/AuthContext';
import { TokenTicket } from '../../components/common/TokenTicket';

export const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { departments, doctors, bookAppointment } = useHospital();
  const { currentUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || 'dept-1');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-09-29');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [appointmentType, setAppointmentType] = useState('Online Appointment');
  const [reason, setReason] = useState('Routine Medical Consultation');
  const [confirmedToken, setConfirmedToken] = useState(null);

  // Check URL query param if doctor was passed
  useEffect(() => {
    const docParam = searchParams.get('doc');
    if (docParam) {
      const doc = doctors.find((d) => d.id === docParam);
      if (doc) {
        setSelectedDocId(doc.id);
        setSelectedDeptId(doc.departmentId);
        setCurrentStep(2);
      }
    }
  }, [searchParams, doctors]);

  // Doctors in selected department
  const filteredDoctors = doctors.filter((d) => d.departmentId === selectedDeptId);

  // Auto-select first doctor in department if not set
  useEffect(() => {
    if (filteredDoctors.length > 0 && !filteredDoctors.some((d) => d.id === selectedDocId)) {
      setSelectedDocId(filteredDoctors[0].id);
    }
  }, [selectedDeptId, filteredDoctors, selectedDocId]);

  const selectedDepartment = departments.find((d) => d.id === selectedDeptId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDocId);

  // Time Slots
  const morningSlots = [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: false }, // booked
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: false }, // booked
    { time: '12:00 PM', available: true },
    { time: '12:30 PM', available: true }
  ];

  const afternoonSlots = [
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: true },
    { time: '03:00 PM', available: false }, // booked
    { time: '03:30 PM', available: true },
    { time: '04:00 PM', available: true },
    { time: '04:30 PM', available: true }
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedDeptId) {
        toast.error('Please select a department');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDocId) {
        toast.error('Please select a doctor');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedDate) {
        toast.error('Please select a date');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!selectedSlot) {
        toast.error('Please select an appointment time slot');
        return;
      }
      setCurrentStep(5);
    }
  };

  const handleConfirm = () => {
    const bookingResult = bookAppointment({
      patientId: currentUser?.id || 'pat-1',
      patientName: currentUser?.name || 'Rahul Sharma',
      patientMobile: currentUser?.mobile || '9876543210',
      patientAge: currentUser?.age || 32,
      patientGender: currentUser?.gender || 'Male',
      departmentId: selectedDeptId,
      doctorId: selectedDocId,
      date: selectedDate,
      timeSlot: selectedSlot,
      appointmentType,
      reason,
      priority: 'Normal'
    });

    if (bookingResult) {
      setConfirmedToken(bookingResult);
    }
  };

  const steps = [
    { num: 1, title: 'Department' },
    { num: 2, title: 'Doctor' },
    { num: 3, title: 'Date' },
    { num: 4, title: 'Time Slot' },
    { num: 5, title: 'Confirm' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
          Book OPD Appointment
        </h1>
        <p style={{ fontSize: '0.925rem', color: '#64748b', margin: 0 }}>
          Follow 5 quick steps to reserve your consultation and generate your live queue token.
        </p>
      </div>

      {/* Confirmation View If Already Booked */}
      {confirmedToken ? (
        <div className="med-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Appointment Confirmed Successfully!
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 2rem' }}>
            Your electronic token has been registered in the hospital OPD queue system. You can print or download your pass below.
          </p>

          <TokenTicket
            tokenNumber={confirmedToken.tokenNumber}
            patientName={currentUser?.name || 'Rahul Sharma'}
            doctorName={selectedDoctor?.name || 'Dr. Amit Sharma'}
            departmentName={selectedDepartment?.name || 'Cardiology'}
            roomNumber={selectedDoctor?.roomNumber || '204'}
            date={selectedDate}
            time={selectedSlot}
            patientsAhead={4}
            estimatedWait={40}
            status="Waiting"
            appointmentType={appointmentType}
            showActions={true}
          />

          <div style={{ marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setConfirmedToken(null);
                setCurrentStep(1);
              }}
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Form Wizard */
        <div className="med-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          {/* Progress Steps Header */}
          <div className="steps-container">
            {steps.map((st) => {
              const isActive = currentStep === st.num;
              const isCompleted = currentStep > st.num;
              return (
                <div
                  key={st.num}
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => isCompleted && setCurrentStep(st.num)}
                >
                  <div className="step-circle">
                    {isCompleted ? <Check size={18} /> : st.num}
                  </div>
                  <span className="step-title">{st.title}</span>
                </div>
              );
            })}
          </div>

          {/* STEP 1: SELECT DEPARTMENT */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Step 1: Select Clinical Department
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Choose the medical division matching your symptoms or care requirements.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: '1rem'
                }}
              >
                {departments.map((dept) => {
                  const isSelected = selectedDeptId === dept.id;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDeptId(dept.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: isSelected ? '#0284c7' : '#0f172a' }}>
                          {dept.name}
                        </span>
                        {isSelected && <CheckCircle2 size={18} color="#0284c7" />}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                        {dept.description}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                        {dept.room} • {dept.assignedDoctors} Specialists
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DOCTOR */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Step 2: Select Specialist Doctor ({selectedDepartment?.name})
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Browse consultants, experience levels, and OPD room locations.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1.25rem'
                }}
              >
                {filteredDoctors.map((doc) => {
                  const isSelected = selectedDocId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '12px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: isSelected ? '#0284c7' : '#0f172a' }}>
                            {doc.name}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Star size={13} fill="#0284c7" /> {doc.rating}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 4px' }}>
                          {doc.qualification}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                          {doc.experience} Experience • <strong>Room {doc.roomNumber}</strong>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '4px' }}>
                          Timings: {doc.startTime} - {doc.endTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: SELECT DATE */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Step 3: Select Consultation Date
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Select a convenient consultation day with {selectedDoctor?.name}.
              </p>

              <div style={{ maxWidth: '400px' }}>
                <div className="form-group">
                  <label className="form-label">Consultation Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    min="2026-09-28"
                    max="2026-10-30"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.85rem',
                    color: '#64748b'
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                    Doctor Availability:
                  </div>
                  {selectedDoctor?.name} is available on{' '}
                  <strong>{selectedDoctor?.availableDays.slice(0, 5).join(', ')}</strong> from{' '}
                  <strong>{selectedDoctor?.startTime} to {selectedDoctor?.endTime}</strong>.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SELECT TIME SLOT */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Step 4: Select OPD Consultation Time Slot
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Green slots are available for immediate confirmation. Gray slots are booked.
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>
                  Morning Session
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 110px), 1fr))', gap: '0.65rem' }}>
                  {morningSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => slot.available && setSelectedSlot(slot.time)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: '8px',
                          border: `1.5px solid ${
                            !slot.available ? '#e2e8f0' : isSelected ? '#0284c7' : '#cbd5e1'
                          }`,
                          backgroundColor: !slot.available
                            ? '#f1f5f9'
                            : isSelected
                            ? '#0284c7'
                            : '#ffffff',
                          color: !slot.available ? '#94a3b8' : isSelected ? '#ffffff' : '#0f172a',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          cursor: slot.available ? 'pointer' : 'not-allowed',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 500, color: '#94a3b8' }}>
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>
                  Afternoon Session
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 110px), 1fr))', gap: '0.65rem' }}>
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => slot.available && setSelectedSlot(slot.time)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: '8px',
                          border: `1.5px solid ${
                            !slot.available ? '#e2e8f0' : isSelected ? '#0284c7' : '#cbd5e1'
                          }`,
                          backgroundColor: !slot.available
                            ? '#f1f5f9'
                            : isSelected
                            ? '#0284c7'
                            : '#ffffff',
                          color: !slot.available ? '#94a3b8' : isSelected ? '#ffffff' : '#0f172a',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          cursor: slot.available ? 'pointer' : 'not-allowed',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 500, color: '#94a3b8' }}>
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRM APPOINTMENT */}
          {currentStep === 5 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Step 5: Review & Confirm Appointment
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Review details below before generating your unique hospital OPD token.
              </p>

              {/* Summary Card */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
                    gap: '1.25rem'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Patient Name</span>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{currentUser?.name || 'Rahul Sharma'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Department</span>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedDepartment?.name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Consultant Doctor</span>
                    <strong style={{ fontSize: '1rem', color: '#0284c7' }}>{selectedDoctor?.name}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>OPD Room Number</span>
                    <strong style={{ fontSize: '1rem', color: '#0284c7' }}>Room {selectedDoctor?.roomNumber}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Scheduled Date</span>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedDate}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Consultation Slot</span>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedSlot}</strong>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="form-row-2" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Appointment Mode</label>
                  <select
                    className="form-control"
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                  >
                    <option value="Online Appointment">Online Appointment</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Consultation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Follow-up, Chest pain, Routine check"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Wizard Navigation Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1.5rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            {currentStep > 1 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
              >
                Proceed to Step {currentStep + 1}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success btn-lg"
                onClick={handleConfirm}
              >
                <CheckCircle2 size={18} />
                Confirm & Generate Token
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
