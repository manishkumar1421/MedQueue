import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  PhoneCall,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Ticket,
  UserCheck,
  Sliders,
  Send,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { AuthPopup } from '../../components/common/AuthPopup';
import { useHospital } from '../../contexts/HospitalContext';
import { useAuth } from '../../contexts/AuthContext';

export const LandingPage = () => {
  const { departments, doctors } = useHospital();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 30-second auto popup for unauthenticated visitors
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [popupTab, setPopupTab] = useState('login');

  useEffect(() => {
    if (isAuthenticated) return; // already logged in, no popup needed
    const timer = setTimeout(() => {
      setShowAuthPopup(true);
    }, 30000); // 30 seconds
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Medicine',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Your message has been sent to our Patient Support Team!');
    setContactForm({ name: '', email: '', phone: '', department: 'General Medicine', message: '' });
  };

  const faqs = [
    {
      q: 'How does MedQueue real-time queue tracking work?',
      a: 'When you book an appointment or register at the hospital walk-in desk, a unique smart token (e.g. C-025) is generated. You can view live queue progress on your phone or clinic displays, seeing the exact number of patients ahead and the dynamic estimated waiting time, so you only arrive at the OPD room right when you are called.'
    },
    {
      q: 'Can walk-in patients receive a queue token without prior booking?',
      a: 'Yes! Our Receptionist and Triage desk issues instant walk-in tokens. Emergency and Senior Citizen priority rules are applied automatically so urgent cases are addressed swiftly while maintaining queue fairness.'
    },
    {
      q: 'How is the estimated waiting time calculated?',
      a: 'Estimated waiting time is dynamically calculated: Estimated Wait = Patients Ahead × Doctor Average Consultation Time. The time updates live as doctors complete consultations or call next patients.'
    },
    {
      q: 'What happens if I miss my token number call?',
      a: 'If a patient does not respond when called, the doctor or receptionist marks the token as "Skipped". You can easily request the reception to "Rejoin Queue" once you arrive at the clinic without losing your appointment.'
    },
    {
      q: 'Can I access MedQueue on mobile without installing an app?',
      a: 'Absolutely. MedQueue is a fully responsive, lightweight web application that runs smoothly on any smartphone, tablet, or desktop browser with zero downloads required.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Auth Popup — auto-shows after 30s for unauthenticated users */}
      {showAuthPopup && (
        <AuthPopup
          defaultTab={popupTab}
          onClose={() => setShowAuthPopup(false)}
        />
      )}

      <Navbar onOpenLogin={() => { setPopupTab('login'); setShowAuthPopup(true); }} onOpenRegister={() => { setPopupTab('register'); setShowAuthPopup(true); }} />

      {/* HERO SECTION */}
      <section
        id="home"
        style={{
          background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
          padding: '4.5rem 0 3.5rem',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  backgroundColor: '#e0f2fe',
                  borderRadius: '9999px',
                  color: '#0284c7',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem'
                }}
              >
                <Zap size={15} />
                <span>Next-Gen Smart Hospital OPD Platform</span>
              </div>

              <h1
                style={{
                  fontSize: '2.85rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem'
                }}
              >
                Smart Hospital <br />
                <span style={{ color: '#0284c7' }}>Queue Management</span>
              </h1>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                  maxWidth: '540px'
                }}
              >
                Book appointments, get your token, track your queue and reduce waiting time. Experience modern healthcare without long, stressful waiting rooms.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link to="/patient/book-appointment" className="btn btn-primary btn-lg">
                  <Calendar size={18} />
                  Book Appointment
                </Link>
                <Link to="/patient/my-queue" className="btn btn-secondary btn-lg">
                  <Clock size={18} color="#0284c7" />
                  Join Queue / Track
                </Link>
              </div>

              {/* Key Trust Highlights */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.75rem',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                    Zero Queue Congestion
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                    Live OPD Screen Sync
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                    Triage & Priority Flow
                  </span>
                </div>
              </div>
            </div>

            {/* Right Healthcare Visual & Interactive Queue Preview */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div className="live-pulse-dot" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      OPD Live Queue Monitor
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600, background: '#e0f2fe', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                    Cardiology • Room 204
                  </span>
                </div>

                {/* Serving & Token Card */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '12px',
                      padding: '1.1rem',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      CURRENTLY SERVING
                    </span>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#15803d', fontFamily: 'monospace', margin: '0.2rem 0' }}>
                      C-018
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#166534' }}>In Room 204</span>
                  </div>

                  <div
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      padding: '1.1rem',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      NEXT TOKEN CALLED
                    </span>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', margin: '0.2rem 0' }}>
                      C-019
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#1e40af' }}>Ramesh Verma</span>
                  </div>
                </div>

                {/* Queue Progress Strip */}
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#64748b' }}>Queue Progress:</span>
                    <strong style={{ color: '#0284c7' }}>Token C-025 (6 Patients Ahead)</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: '68%', height: '100%', backgroundColor: '#0284c7', borderRadius: '9999px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.4rem', color: '#64748b' }}>
                    <span>C-001 (Start)</span>
                    <span style={{ fontWeight: 600, color: '#0284c7' }}>Estimated Wait: ~30 Mins</span>
                    <span>C-035 (End)</span>
                  </div>
                </div>

                {/* Quick patient demo ticket */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#e0f2fe',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Ticket size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        Your Demo Token: C-025
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Dr. Amit Sharma • Cardiology
                      </div>
                    </div>
                  </div>
                  <Link to="/patient/my-queue" className="btn btn-outline-primary btn-sm">
                    Track Live
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS (7 STEPS) */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SEAMLESS PATIENT JOURNEY
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem' }}>
              How MedQueue Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
              A 7-step frictionless hospital experience from appointment booking to doctor consultation.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {[
              { step: '01', title: 'Register', desc: 'Create your secure medical profile with essential demographics and blood group.', icon: UserCheck },
              { step: '02', title: 'Select Department', desc: 'Choose from 8+ specialized clinical departments such as Cardiology or Pediatrics.', icon: Building2 },
              { step: '03', title: 'Select Doctor', desc: 'Review credentials, experience, OPD room, and patient ratings to pick your specialist.', icon: Stethoscope },
              { step: '04', title: 'Book Appointment', desc: 'Pick your preferred date and convenient consultation time slot in seconds.', icon: Calendar },
              { step: '05', title: 'Get Token', desc: 'Receive your unique alphanumeric OPD token (e.g. C-025) with printable pass.', icon: Ticket },
              { step: '06', title: 'Track Queue', desc: 'Monitor live patient progress, token calls, and dynamic wait times in real time.', icon: Clock },
              { step: '07', title: 'Meet Doctor', desc: 'Step straight into your assigned room when called without waiting room chaos.', icon: HeartPulse }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="med-card"
                  style={{
                    padding: '1.5rem',
                    position: 'relative',
                    borderTop: '3px solid #0284c7'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: '#f0f9ff',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#cbd5e1',
                        fontFamily: 'monospace'
                      }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: HOSPITAL SERVICES */}
      <section id="services" style={{ padding: '5rem 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              COMPREHENSIVE CLINICAL EXCELLENCE
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem' }}>
              Hospital Services & Facilities
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
              World-class healthcare services powered by integrated queue management and compassionate patient care.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {[
              { title: '24/7 Acute Emergency Triage', desc: 'Immediate priority triage queue for critical cardiovascular, trauma, and acute distress cases.', icon: HeartPulse, color: '#ef4444' },
              { title: 'Specialist Outpatient OPD', desc: 'Over 8 specialized consultation clinics operating simultaneously with smart token management.', icon: Stethoscope, color: '#0284c7' },
              { title: 'Advanced Pathology & Labs', desc: 'Fast diagnostic sample collection and digital report delivery linked to patient token.', icon: Activity, color: '#0d9488' },
              { title: 'Senior Citizen Priority Desk', desc: 'Dedicated queue weighting and fast-track consultation for elderly patients over 60.', icon: Award, color: '#f59e0b' },
              { title: 'Digital Pharmacy Dispensing', desc: 'Automated prescription queuing at counter reduces medication pickup delays by 75%.', icon: Zap, color: '#8b5cf6' },
              { title: 'Preventative Health Checkups', desc: 'Full-body executive screening packages with scheduled multi-department token routing.', icon: ShieldCheck, color: '#10b981' }
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className="med-card"
                  style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: `${srv.color}15`,
                      color: srv.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {srv.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: DEPARTMENTS */}
      <section id="departments" style={{ padding: '5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SPECIALIZED DIVISIONS
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem' }}>
              Clinical Departments
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
              Select your department to view available senior specialists, OPD room numbers, and current queue volumes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="med-card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Activity size={22} />
                  </div>
                  <span
                    style={{
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#475569'
                    }}
                  >
                    {dept.room}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  {dept.name}
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.5, flex: 1, marginBottom: '1.25rem' }}>
                  {dept.description}
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Head: <strong>{dept.head}</strong>
                  </span>
                  <Link
                    to="/patient/book-appointment"
                    style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Book <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED DOCTORS */}
      <section id="doctors" style={{ padding: '5rem 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              RENOWNED CONSULTANTS
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem' }}>
              Meet Our Specialist Doctors
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
              Board-certified specialists dedicated to delivering exceptional medical outcomes with minimal patient waiting times.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="med-card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0' }}>
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    ★ {doc.rating}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    Room {doc.roomNumber}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {doc.departmentName}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0.2rem 0 0.35rem' }}>
                    {doc.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem' }}>
                    {doc.specialization}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.25rem' }}>
                    <div><strong>Experience:</strong> {doc.experience}</div>
                    <div><strong>OPD Timings:</strong> {doc.startTime} - {doc.endTime}</div>
                  </div>

                  <Link
                    to={`/patient/book-appointment?doc=${doc.id}`}
                    className="btn btn-outline-primary btn-sm"
                    style={{ marginTop: 'auto', width: '100%' }}
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE MEDQUEUE */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              TRANSFORMATIVE ADVANTAGES
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem' }}>
              Why Choose MedQueue
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
              Designed hand-in-hand with leading hospital administrators and chief medical officers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {[
              { title: 'Reduced Waiting Time', desc: 'Average outpatient wait dropped from 65 minutes to under 14 minutes with dynamic pacing.', icon: Clock },
              { title: 'Real-Time Queue Tracking', desc: 'Patients track live token progression directly from their mobile browser or waiting screens.', icon: Zap },
              { title: 'Easy Appointment Booking', desc: '5-step self-service booking with instantaneous slot validation and token generation.', icon: Calendar },
              { title: 'Multiple Departments', desc: 'Seamlessly coordinate consultations across Cardiology, Orthopedics, Medicine, and Diagnostics.', icon: Building2 },
              { title: 'Smart Token Management', desc: 'Priority rule engine respects emergencies and senior citizens without stalling regular OPD flow.', icon: Award }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="med-card"
                  style={{ padding: '1.75rem', textAlign: 'center' }}
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem'
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {feature.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: STATISTICS */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '4rem 0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                45+
              </div>
              <div style={{ fontSize: '1rem', color: '#e0f2fe', fontWeight: 600 }}>
                Total Specialist Doctors
              </div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                12
              </div>
              <div style={{ fontSize: '1rem', color: '#e0f2fe', fontWeight: 600 }}>
                Clinical Departments
              </div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                85,000+
              </div>
              <div style={{ fontSize: '1rem', color: '#e0f2fe', fontWeight: 600 }}>
                Patients Served
              </div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                14 Min
              </div>
              <div style={{ fontSize: '1rem', color: '#e0f2fe', fontWeight: 600 }}>
                Average Waiting Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ (INTERACTIVE ACCORDION) */}
      <section id="faq" style={{ padding: '5rem 0', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem' }}>
              Everything You Need to Know
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b' }}>
              Clear answers regarding tokens, priority queues, and appointment schedules.
            </p>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="med-card"
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    borderColor: isOpen ? '#bae6fd' : '#e2e8f0',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '1.025rem',
                      color: isOpen ? '#0284c7' : '#0f172a'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1.25rem', color: '#475569', fontSize: '0.925rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8: CONTACT SECTION */}
      <section id="contact" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start'
            }}
          >
            {/* Contact Details */}
            <div>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PATIENT HELP & SUPPORT
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem' }}>
                Contact Hospital Desk
              </h2>
              <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
                Have inquiries regarding queue status, special doctor appointments, or corporate insurance coverage? Our helpdesk is here to assist 24/7.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.2rem' }}>Hospital Address</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      MedQueue Central Hospital Campus, Sector 12, Medical Corridor, Mumbai, MH - 400051
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.2rem' }}>Emergency OPD Hotline</h4>
                    <p style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600, margin: 0 }}>
                      +91 (022) 4900-8800 / 9999
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.2rem' }}>Email Inquiries</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      appointments@medqueue.hospital.org
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="med-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Send Us a Message
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Fill out the form below and our patient relations coordinator will respond promptly.
              </p>

              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Patel"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department of Interest</label>
                  <select
                    className="form-control"
                    value={contactForm.department}
                    onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Inquiry Details <span className="required">*</span></label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Describe your inquiry or requirement..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={16} />
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FOOTER */}
      <Footer />
    </div>
  );
};
