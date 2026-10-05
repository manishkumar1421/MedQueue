import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';

export const ReportsAnalytics = () => {
  const { queue, appointments, doctors, departments } = useHospital();

  const [activeReport, setActiveReport] = useState('daily');
  const [dateRange, setDateRange] = useState('2026-09-28');

  const reportTabs = [
    { id: 'daily', label: 'Daily Patient Report' },
    { id: 'doctor', label: 'Doctor-Wise Report' },
    { id: 'dept', label: 'Department-Wise Report' },
    { id: 'appointment', label: 'Appointment Report' },
    { id: 'queue', label: 'Queue Performance Report' },
    { id: 'wait', label: 'Waiting Time Report' },
    { id: 'cancelled', label: 'Cancelled Appointments' },
    { id: 'noshow', label: 'No-Show Report' }
  ];

  // Export to Real CSV Function
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeReport === 'doctor') {
      csvContent += 'Doctor Name,Department,Room,Patients Served,Avg Consult Time,Rating\n';
      doctors.forEach((d) => {
        csvContent += `"${d.name}","${d.departmentName}","Room ${d.roomNumber}",18,"12 Mins",${d.rating}\n`;
      });
    } else {
      csvContent += 'Token Number,Patient Name,Doctor,Department,Status,Date,Time,Priority\n';
      queue.forEach((q) => {
        csvContent += `"${q.tokenNumber}","${q.patientName}","${q.doctorName}","${q.departmentName}","${q.status}","${q.date}","${q.appointmentTime}","${q.priority}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medqueue_${activeReport}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Report CSV exported successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div
        className="no-print"
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
            Reports & Clinical Analytics
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Generate executive compliance reports, audit trails, and outpatient utilization summaries
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            Print Report
          </button>
          <button type="button" className="btn btn-primary" onClick={handleExportCSV}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem'
        }}
      >
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveReport(tab.id)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: `1.5px solid ${activeReport === tab.id ? '#0284c7' : '#cbd5e1'}`,
              backgroundColor: activeReport === tab.id ? '#0284c7' : '#ffffff',
              color: activeReport === tab.id ? '#ffffff' : '#475569',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="med-card printable-token" style={{ padding: '2rem' }}>
        {/* Document Header */}
        <div
          style={{
            borderBottom: '2px solid #0284c7',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              MEDQUEUE HOSPITAL INFORMATION SYSTEM
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              {reportTabs.find((t) => t.id === activeReport)?.label}
            </h2>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b' }}>
            <div>Date: <strong>28 September 2026</strong></div>
            <div>Generated By: <strong>Admin / CMO Office</strong></div>
          </div>
        </div>

        {/* Dynamic Table Content based on active report */}
        {activeReport === 'doctor' ? (
          <div className="med-table-container">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Department</th>
                  <th>OPD Room</th>
                  <th>Daily Quota</th>
                  <th>Patients Served</th>
                  <th>Avg Consult Time</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{d.name}</strong>
                    </td>
                    <td>{d.departmentName}</td>
                    <td>Room {d.roomNumber}</td>
                    <td>{d.maxPatients} Patients</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#059669' }}>
                        {Math.floor(d.maxPatients * 0.75)} Served
                      </span>
                    </td>
                    <td>10-12 Mins</td>
                    <td>★ {d.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeReport === 'dept' ? (
          <div className="med-table-container">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Head of Department</th>
                  <th>Room Wings</th>
                  <th>Specialists</th>
                  <th>Daily OPD Volume</th>
                  <th>Avg Queue Pacing</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{dept.name}</strong>
                    </td>
                    <td>{dept.head}</td>
                    <td>{dept.room}</td>
                    <td>{dept.assignedDoctors || 1} Consultants</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0284c7' }}>
                        ~35 Patients
                      </span>
                    </td>
                    <td>14 Mins</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="med-table-container">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Token Number</th>
                  <th>Patient Name</th>
                  <th>Consultant Doctor</th>
                  <th>Department</th>
                  <th>Time Slot</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.slice(0, 12).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ fontFamily: 'monospace', color: '#0284c7' }}>
                        {item.tokenNumber}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{item.patientName}</strong>
                    </td>
                    <td>{item.doctorName}</td>
                    <td>{item.departmentName}</td>
                    <td>{item.appointmentTime}</td>
                    <td>{item.priority}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Footer */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          <div>Report Hash: <code>MQ-REP-20260928-8904</code> • Confidential Clinical Data</div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    </div>
  );
};
