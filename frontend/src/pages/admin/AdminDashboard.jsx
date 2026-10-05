import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Building2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Filter,
  Download,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useHospital } from '../../contexts/HospitalContext';

export const AdminDashboard = () => {
  const {
    patients,
    doctors,
    departments,
    appointments,
    queue,
    settings
  } = useHospital();

  const [dateFilter, setDateFilter] = useState('Today');

  // KPI calculations
  const totalPatientsCount = patients.length;
  const todayAppointmentsCount = appointments.length;
  const waitingPatientsCount = queue.filter((q) => q.status === 'Waiting').length;
  const completedAppointmentsCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledAppointmentsCount = appointments.filter((a) => a.status === 'Cancelled').length;
  const totalDoctorsCount = doctors.length;
  const activeDepartmentsCount = departments.filter((d) => d.status === 'Active').length;
  const avgWaitTime = settings.avgConsultationTime || 10;

  // Chart 1: Patients per Day Trend
  const patientsPerDayData = [
    { day: 'Mon', patients: 120, waitingTime: 12 },
    { day: 'Tue', patients: 145, waitingTime: 14 },
    { day: 'Wed', patients: 132, waitingTime: 11 },
    { day: 'Thu', patients: 160, waitingTime: 15 },
    { day: 'Fri', patients: 180, waitingTime: 16 },
    { day: 'Sat', patients: 195, waitingTime: 18 },
    { day: 'Sun', patients: 90, waitingTime: 9 }
  ];

  // Chart 2: Department-wise Volume
  const departmentWorkloadData = [
    { name: 'Cardiology', patients: 38, avgWait: 14 },
    { name: 'Gen Medicine', patients: 52, avgWait: 10 },
    { name: 'Orthopedics', patients: 29, avgWait: 15 },
    { name: 'Dermatology', patients: 22, avgWait: 12 },
    { name: 'Pediatrics', patients: 31, avgWait: 11 },
    { name: 'ENT', patients: 18, avgWait: 13 },
    { name: 'Neurology', patients: 16, avgWait: 20 },
    { name: 'Dental', patients: 20, avgWait: 16 }
  ];

  // Chart 3: Appointment Status Distribution
  const statusPieData = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'Waiting', value: 28, color: '#f59e0b' },
    { name: 'In Consult', value: 12, color: '#8b5cf6' },
    { name: 'Confirmed', value: 10, color: '#0284c7' },
    { name: 'Cancelled / No Show', value: 5, color: '#ef4444' }
  ];

  // Chart 4: Hourly Waiting Time Trend
  const hourlyWaitData = [
    { hour: '08:00 AM', wait: 8 },
    { hour: '10:00 AM', wait: 16 },
    { hour: '12:00 PM', wait: 22 },
    { hour: '02:00 PM', wait: 12 },
    { hour: '04:00 PM', wait: 18 },
    { hour: '06:00 PM', wait: 10 }
  ];

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Top Controls Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Executive OPD Analytics & Performance
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Hospital-wide queue flow telemetry, department bottlenecks, and patient service metrics
          </p>
        </div>

        {/* Date Filter & Export */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '2px' }}>
            {['Today', 'This Week', 'This Month'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDateFilter(tab)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: dateFilter === tab ? '#0284c7' : 'transparent',
                  color: dateFilter === tab ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <Link to="/admin/reports" className="btn btn-secondary btn-sm">
            <Download size={15} />
            Export Reports
          </Link>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Patients
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {totalPatientsCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Today's Appointments
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {todayAppointmentsCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Waiting in Queue
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>
              {waitingPatientsCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Completed Consults
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>
              {completedAppointmentsCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <XCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Cancelled / No Show
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>
              {cancelledAppointmentsCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Specialist Doctors
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed' }}>
              {totalDoctorsCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Departments
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d9488' }}>
              {activeDepartmentsCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f1f5f9', color: '#0284c7' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Avg Wait Time
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>
              {avgWaitTime} Mins
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 1 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Chart 1: Patients per Day */}
        <div className="med-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                1. Patients Served Per Day
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Daily outpatient volume trend
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
              +14.8% vs last week
            </span>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientsPerDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  name="Patients"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0284c7' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Department-wise Volume */}
        <div className="med-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                2. Department-Wise Patient Volume
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Distribution across clinical OPD wings
              </p>
            </div>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="patients" name="Patients" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {/* Chart 3: Appointment Status Distribution */}
        <div className="med-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              3. Appointment Status Distribution
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Breakdown of today's outpatient outcomes
            </p>
          </div>

          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Hourly Waiting Time Trends */}
        <div className="med-card" style={{ padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              4. Waiting Time Trends by Hour
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Peak bottleneck window analysis (minutes)
            </p>
          </div>

          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyWaitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="wait" name="Avg Wait (Minutes)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
