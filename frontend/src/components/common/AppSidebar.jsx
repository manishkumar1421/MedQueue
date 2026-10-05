import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  CalendarPlus,
  Clock,
  CalendarCheck,
  History,
  Bell,
  User,
  LogOut,
  Users,
  Stethoscope,
  Building2,
  Sliders,
  FileText,
  Shield,
  Layers,
  Calendar,
  Ticket,
  UserPlus,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';

export const AppSidebar = ({ isOpen, onClose }) => {
  const { role, currentUser, logout } = useAuth();
  const { notifications, queue } = useHospital();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (role === 'Patient') {
      return [
        { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/patient/book-appointment', label: 'Book Appointment', icon: CalendarPlus },
        { to: '/patient/my-queue', label: 'My Live Queue', icon: Clock, badge: 'Live' },
        { to: '/patient/my-appointments', label: 'My Appointments', icon: CalendarCheck },
        { to: '/patient/profile', label: 'My Profile', icon: User }
      ];
    }

    if (role === 'Receptionist') {
      return [
        { to: '/receptionist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/receptionist/walk-in', label: 'Walk-in / Register', icon: UserPlus, badge: 'Quick' },
        { to: '/receptionist/appointments', label: 'Appointments', icon: CalendarCheck },
        { to: '/receptionist/doctors', label: 'Doctor Availability', icon: Stethoscope },
        { to: '/admin/reports', label: 'Queue Reports', icon: FileText }
      ];
    }

    if (role === 'Doctor') {
      return [
        { to: '/doctor/dashboard', label: 'OPD Dashboard', icon: LayoutDashboard },
        { to: '/doctor/queue', label: "Today's Queue", icon: Clock },
        { to: '/doctor/schedule', label: 'My Schedule', icon: Calendar },
        { to: '/doctor/history', label: 'Patient Consults', icon: History }
      ];
    }

    // Default to Admin
    return [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/patients', label: 'Patients', icon: Users },
      { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
      { to: '/admin/departments', label: 'Departments', icon: Building2 },
      { to: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
      { to: '/admin/queues', label: 'Live Queues', icon: Clock },
      { to: '/admin/counters', label: 'OPD Counters', icon: Layers },
      { to: '/admin/reports', label: 'Reports & Analytics', icon: FileText },
      { to: '/admin/settings', label: 'Hospital Settings', icon: Sliders }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="sidebar-backdrop show-on-tablet"
          aria-hidden="true"
        />
      )}

      <aside className={`dashboard-sidebar no-print ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Hospital Brand Header */}
        <div
          style={{
            padding: '1.15rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                flexShrink: 0
              }}
            >
              <Activity size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                MedQueue
              </div>
              <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>
                Hospital OPD System
              </div>
            </div>
          </div>

          {/* Close button for mobile & tablet drawer */}
          <button
            type="button"
            className="show-on-tablet btn btn-ghost"
            style={{ padding: '0.35rem', color: '#64748b' }}
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Context Card */}
        <div
          style={{
            margin: '1rem 0.85rem 0.5rem',
            padding: '0.85rem 1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
          }}
        >
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
            Current Portal
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            {role} Workspace
          </div>
          <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '2px' }}>
            {currentUser?.name || 'Authorized Staff'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: item.badge === 'Live' ? '#10b981' : '#0284c7',
                      color: '#ffffff',
                      fontWeight: 700
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '0.85rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            className="nav-item"
            style={{ width: '100%', color: '#ef4444', margin: 0 }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
