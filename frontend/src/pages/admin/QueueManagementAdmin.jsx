import React, { useState } from 'react';
import {
  Clock,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  PauseCircle,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Activity,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const QueueManagementAdmin = () => {
  const {
    departments,
    doctors,
    queue,
    pauseDepartmentQueue,
    resetDepartmentQueue,
    skipPatient,
    holdPatient,
    rejoinQueue
  } = useHospital();

  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleTogglePause = (dept) => {
    pauseDepartmentQueue(dept.id);
  };

  const handleResetQueue = (dept) => {
    setConfirmDialog({
      title: `Reset ${dept.name} Queue`,
      message: `Are you sure you want to reset all active tokens for ${dept.name}? This will clear waiting tokens.`,
      confirmText: 'Reset Queue',
      isDanger: true,
      onConfirm: () => resetDepartmentQueue(dept.id)
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Central OPD Queue Command Center
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Administrative multi-department triage control, emergency overrides, and OPD pause/resume operations
          </p>
        </div>
      </div>

      {/* Department Queues Grid Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        {departments.map((dept) => {
          const deptQueue = queue.filter((q) => q.departmentId === dept.id && q.status !== 'Cancelled');
          const waitingCount = deptQueue.filter((q) => q.status === 'Waiting').length;
          const currentToken = deptQueue.find((q) => q.status === 'Called' || q.status === 'In Consultation');
          const isPaused = dept.queuePaused;

          return (
            <div
              key={dept.id}
              className="med-card"
              style={{
                padding: '1.5rem',
                borderTop: `4px solid ${isPaused ? '#ef4444' : '#0284c7'}`,
                backgroundColor: isPaused ? '#fffbfb' : '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                    {dept.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
                    {dept.room} • Head: {dept.head}
                  </span>
                </div>

                <span
                  style={{
                    backgroundColor: isPaused ? '#fee2e2' : '#d1fae5',
                    color: isPaused ? '#991b1b' : '#065f46',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  {isPaused ? 'PAUSED' : 'ACTIVE QUEUE'}
                </span>
              </div>

              {/* Numbers */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    CURRENT TOKEN
                  </span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                    {currentToken ? currentToken.tokenNumber : 'None'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    WAITING LINE
                  </span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>
                    {waitingCount} Patients
                  </div>
                </div>
              </div>

              {/* Administrative Queue Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn ${isPaused ? 'btn-success' : 'btn-secondary'} btn-sm`}
                  style={{ flex: 1 }}
                  onClick={() => handleTogglePause(dept)}
                >
                  {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  {isPaused ? 'Resume Queue' : 'Pause Queue'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#ef4444' }}
                  onClick={() => handleResetQueue(dept)}
                  title="Reset Queue"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Tokens Table with Priority Overrides */}
      <div className="med-card" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Live Queue Line Control & Override
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.825rem', color: '#64748b' }}>
            Adjust patient priorities, skip non-responsive patients, or hold consultations
          </p>
        </div>

        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient</th>
                <th>Doctor Assigned</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.slice(0, 10).map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#0284c7' }}>
                      {item.tokenNumber}
                    </strong>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{item.patientName}</strong>
                  </td>
                  <td>{item.doctorName}</td>
                  <td>{item.departmentName}</td>
                  <td>
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {item.status === 'Waiting' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => skipPatient(item.id)}
                            title="Skip"
                          >
                            <SkipForward size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => holdPatient(item.id)}
                            title="Hold"
                          >
                            <PauseCircle size={13} />
                          </button>
                        </>
                      )}
                      {(item.status === 'Skipped' || item.status === 'On Hold') && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => rejoinQueue(item.id)}
                        >
                          Rejoin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmDialog && (
        <ConfirmDialog
          isOpen={!!confirmDialog}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          isDanger={confirmDialog.isDanger}
        />
      )}
    </div>
  );
};
