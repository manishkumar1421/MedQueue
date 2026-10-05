import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HospitalProvider } from './contexts/HospitalContext';

import { DashboardLayout } from './components/layout/DashboardLayout';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { BookAppointment } from './pages/patient/BookAppointment';
import { MyQueue } from './pages/patient/MyQueue';
import { MyAppointments } from './pages/patient/MyAppointments';
import { PatientProfile } from './pages/patient/PatientProfile';

// Receptionist Pages
import { ReceptionistDashboard } from './pages/receptionist/ReceptionistDashboard';
import { WalkInRegistration } from './pages/receptionist/WalkInRegistration';
import { ReceptionistAppointments } from './pages/receptionist/ReceptionistAppointments';
import { ReceptionistDoctors } from './pages/receptionist/ReceptionistDoctors';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorQueue } from './pages/doctor/DoctorQueue';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { DoctorHistory } from './pages/doctor/DoctorHistory';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PatientManagement } from './pages/admin/PatientManagement';
import { DoctorManagement } from './pages/admin/DoctorManagement';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';
import { CounterManagement } from './pages/admin/CounterManagement';
import { AppointmentManagement } from './pages/admin/AppointmentManagement';
import { QueueManagementAdmin } from './pages/admin/QueueManagementAdmin';
import { ReportsAnalytics } from './pages/admin/ReportsAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed, redirect to respective home or dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'Patient') return <Navigate to="/patient/dashboard" replace />;
    if (role === 'Receptionist') return <Navigate to="/receptionist/dashboard" replace />;
    if (role === 'Doctor') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HospitalProvider>
          {/* Light Theme Toaster */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#ffffff',
                color: '#0f172a',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '10px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff'
                }
              }
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Dashboard Routes with Layout */}
            <Route element={<DashboardLayout />}>
              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Patient', 'Admin']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/book-appointment"
                element={
                  <ProtectedRoute allowedRoles={['Patient', 'Admin', 'Receptionist']}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/my-queue"
                element={
                  <ProtectedRoute allowedRoles={['Patient', 'Admin', 'Receptionist', 'Doctor']}>
                    <MyQueue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/my-appointments"
                element={
                  <ProtectedRoute allowedRoles={['Patient', 'Admin']}>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/profile"
                element={
                  <ProtectedRoute allowedRoles={['Patient', 'Receptionist', 'Doctor', 'Admin']}>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />

              {/* Receptionist Routes */}
              <Route
                path="/receptionist/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
                    <ReceptionistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receptionist/walk-in"
                element={
                  <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
                    <WalkInRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receptionist/appointments"
                element={
                  <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
                    <ReceptionistAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receptionist/doctors"
                element={
                  <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
                    <ReceptionistDoctors />
                  </ProtectedRoute>
                }
              />

              {/* Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/queue"
                element={
                  <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                    <DoctorQueue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/schedule"
                element={
                  <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                    <DoctorSchedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/history"
                element={
                  <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                    <DoctorHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <PatientManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <DoctorManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <DepartmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/counters"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <CounterManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AppointmentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/queues"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <QueueManagementAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Receptionist']}>
                    <ReportsAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HospitalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
