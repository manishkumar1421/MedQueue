import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  LogOut,
  Shield,
  Activity,
  ChevronDown,
  Menu,
  X,
  Stethoscope,
  Users,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAuth, demoUsers } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';

export const AppHeader = ({ onToggleSidebar }) => {
  const { currentUser, role, switchRole, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHospital();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const userNotifications = notifications.filter(
    (n) => !n.role || n.role === role || (role === 'Admin')
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === 'Patient') navigate('/patient/dashboard');
    else if (newRole === 'Receptionist') navigate('/receptionist/dashboard');
    else if (newRole === 'Doctor') navigate('/doctor/dashboard');
    else if (newRole === 'Admin') navigate('/admin/dashboard');
  };

  return (
    <>
      {/* Top Quick Role Switcher Banner */}
      <div className="role-switcher-banner no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem' }}>
            <Activity size={15} /> Demo Portals:
          </span>
          <span className="hide-on-mobile" style={{ color: '#64748b', fontSize: '0.8rem' }}>Switch role:</span>
        </div>
        <div className="role-pills-wrap">
          {['Patient', 'Receptionist', 'Doctor', 'Admin'].map((r) => (
            <button
              key={r}
              type="button"
              className={`role-pill ${role === r ? 'active' : ''}`}
              onClick={() => handleRoleChange(r)}
            >
              {r === 'Patient' && <User size={13} />}
              {r === 'Receptionist' && <Users size={13} />}
              {r === 'Doctor' && <Stethoscope size={13} />}
              {r === 'Admin' && <Shield size={13} />}
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Topbar */}
      <header className="app-topbar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onToggleSidebar && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '0.5rem', borderRadius: '8px' }}
              onClick={onToggleSidebar}
              aria-label="Toggle menu"
            >
              <Menu size={22} color="#0f172a" />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div className="live-pulse-dot" />
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f766e' }}>
              OPD Live
            </span>
            <span className="hide-on-mobile" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>•</span>
            <span className="hide-on-mobile" style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Room 204 Active
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ position: 'relative', padding: '0.6rem', borderRadius: '50%' }}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={20} color="#475569" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '18px',
                    height: '18px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '50%',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: '-10px',
                  width: 'min(340px, calc(100vw - 24px))',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '0.925rem', fontWeight: 700 }}>
                    Notifications ({unreadCount})
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {userNotifications.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                      <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>No notifications</p>
                    </div>
                  ) : (
                    userNotifications.slice(0, 6).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #f8fafc',
                          backgroundColor: notif.read ? '#ffffff' : '#f0f9ff',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
                            {notif.title}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{notif.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: '1.5px solid #bae6fd',
                flexShrink: 0
              }}
              title={`${currentUser?.name || 'User'} (${role})`}
            >
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="hide-on-mobile" style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {currentUser?.name || 'Guest User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                {role}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
