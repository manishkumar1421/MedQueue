import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Activity,
  Ticket,
  Users,
  CheckCircle2,
  Volume2,
  Printer,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useHospital } from '../../contexts/HospitalContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { QueueProgressBar } from '../../components/common/QueueProgressBar';
import { Modal } from '../../components/common/Modal';
import { TokenTicket } from '../../components/common/TokenTicket';

export const MyQueue = () => {
  const { currentUser } = useAuth();
  const { queue, getQueueStatsForToken, callNextPatient } = useHospital();
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Match current user's token or fallback to demo token C-025
  const myQueueItem = queue.find(
    (q) => (q.patientId === currentUser?.id || q.patientName === currentUser?.name) &&
           q.status !== 'Completed' && q.status !== 'Cancelled'
  ) || queue.find((q) => q.tokenNumber === 'C-025') || queue[0];

  const doctorId = myQueueItem ? myQueueItem.doctorId : 'doc-1';
  const stats = myQueueItem
    ? getQueueStatsForToken(myQueueItem.tokenNumber, doctorId)
    : { currentServing: null, patientsAhead: 0, estimatedWait: 0, status: 'Not In Queue' };

  // All queue items for this doctor's department today
  const doctorQueue = queue.filter((q) => q.doctorId === doctorId && q.status !== 'Cancelled');
  const completedCount = doctorQueue.filter((q) => q.status === 'Completed').length;
  const waitingList = doctorQueue.filter((q) => q.status === 'Waiting');

  const isMyTokenCalled = myQueueItem?.status === 'Called';
  const isMyTokenInConsultation = myQueueItem?.status === 'In Consultation';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Real-time Header Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="live-pulse-dot" />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Live OPD Queue Monitor
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.2rem 0 0' }}>
            Real-time tracking for {myQueueItem?.doctorName} • {myQueueItem?.departmentName} (Room {myQueueItem?.roomNumber})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowTokenModal(true)}
          >
            <Printer size={15} />
            Print Token
          </button>

          {/* Quick Demo Action to trigger queue progression */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => callNextPatient(doctorId)}
            title="Simulates receptionist/doctor calling the next patient in line"
          >
            <Volume2 size={15} />
            Simulate Next Call
          </button>
        </div>
      </div>

      {/* CALL ALERT BANNER IF PATIENT IS CALLED */}
      {isMyTokenCalled && (
        <div
          style={{
            backgroundColor: '#e0f2fe',
            border: '2px solid #0284c7',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.25)',
            animation: 'pulseLight 1.8s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <BellRing size={28} className="animate-bounce" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                YOUR TOKEN HAS BEEN CALLED!
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                Please proceed immediately to Room {myQueueItem?.roomNumber}
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#475569' }}>
                {myQueueItem?.doctorName} is ready to consult you.
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
              {myQueueItem?.tokenNumber}
            </span>
          </div>
        </div>
      )}

      {/* CORE QUEUE HERO CARD */}
      <div className="med-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {/* Currently Serving Display */}
          <div
            style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '16px',
              padding: '1.75rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.08)'
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#15803d',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              CURRENTLY SERVING
            </span>
            <div
              style={{
                fontSize: '3.6rem',
                fontWeight: 800,
                color: '#166534',
                fontFamily: 'monospace',
                lineHeight: 1.1,
                margin: '0.4rem 0'
              }}
            >
              {stats.currentServing ? stats.currentServing.tokenNumber : 'None'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 600 }}>
              {stats.currentServing ? stats.currentServing.patientName : 'Desk Waiting'}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '0.3rem' }}>
              OPD Room {myQueueItem?.roomNumber || '204'}
            </span>
          </div>

          {/* Your Token Display */}
          <div
            style={{
              background: '#f0f9ff',
              border: '2px solid #7dd3fc',
              borderRadius: '16px',
              padding: '1.75rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.08)'
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0369a1',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              YOUR TOKEN
            </span>
            <div
              style={{
                fontSize: '3.6rem',
                fontWeight: 800,
                color: '#0284c7',
                fontFamily: 'monospace',
                lineHeight: 1.1,
                margin: '0.4rem 0'
              }}
            >
              {myQueueItem ? myQueueItem.tokenNumber : 'C-025'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
              <StatusBadge status={myQueueItem?.status || 'Waiting'} />
              {myQueueItem?.priority && myQueueItem.priority !== 'Normal' && (
                <PriorityBadge priority={myQueueItem.priority} />
              )}
            </div>
          </div>
        </div>

        {/* 3 Secondary Stats Blocks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              PATIENTS AHEAD
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', margin: '0.2rem 0' }}>
              {stats.patientsAhead}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>In waiting line</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              PATIENTS SERVED TODAY
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '0.2rem 0' }}>
              {completedCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Consultations done</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              ESTIMATED WAITING TIME
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7c3aed', margin: '0.2rem 0' }}>
              ~{stats.estimatedWait} Mins
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Approximate wait</span>
          </div>
        </div>

        {/* Queue Progress Bar */}
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Live Queue Progression Status:
          </div>
          <QueueProgressBar status={myQueueItem?.status || 'Waiting'} />
        </div>
      </div>

      {/* LINE-BY-LINE ACTIVE QUEUE TABLE */}
      <div className="med-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Live Queue Sequence for {myQueueItem?.doctorName}
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.825rem', color: '#64748b' }}>
              Shows upcoming tokens in chronological consultation order
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
            {waitingList.length} Currently Waiting
          </span>
        </div>

        <div className="med-table-container">
          <table className="med-table">
            <thead>
              <tr>
                <th>Queue Pos.</th>
                <th>Token</th>
                <th>Patient</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Est. Time</th>
              </tr>
            </thead>
            <tbody>
              {doctorQueue
                .filter((q) => q.status !== 'Completed')
                .map((qItem, idx) => {
                  const isUser = qItem.tokenNumber === myQueueItem?.tokenNumber;
                  return (
                    <tr
                      key={qItem.id}
                      style={{
                        backgroundColor: isUser ? '#f0f9ff' : undefined,
                        borderLeft: isUser ? '4px solid #0284c7' : undefined
                      }}
                    >
                      <td>
                        <span style={{ fontWeight: 700, color: isUser ? '#0284c7' : '#64748b' }}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#0284c7' }}>
                          {qItem.tokenNumber}
                        </strong>
                        {isUser && (
                          <span
                            style={{
                              marginLeft: '0.5rem',
                              backgroundColor: '#0284c7',
                              color: '#ffffff',
                              fontSize: '0.68rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {isUser ? qItem.patientName : `${qItem.patientName.split(' ')[0]} ***`}
                        </div>
                      </td>
                      <td>
                        <PriorityBadge priority={qItem.priority} />
                      </td>
                      <td>
                        <StatusBadge status={qItem.status} />
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {qItem.status === 'In Consultation'
                            ? 'Inside Room'
                            : qItem.status === 'Called'
                            ? 'Calling...'
                            : `~${idx * 10} mins`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal View for Token Pass */}
      {showTokenModal && (
        <Modal
          isOpen={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          title="Print OPD Token"
          maxWidth="460px"
        >
          <TokenTicket
            tokenNumber={myQueueItem ? myQueueItem.tokenNumber : 'C-025'}
            patientName={currentUser?.name || 'Rahul Sharma'}
            doctorName={myQueueItem ? myQueueItem.doctorName : 'Dr. Amit Sharma'}
            departmentName={myQueueItem ? myQueueItem.departmentName : 'Cardiology'}
            roomNumber={myQueueItem ? myQueueItem.roomNumber : '204'}
            date={myQueueItem ? myQueueItem.date : '2026-09-28'}
            time={myQueueItem ? myQueueItem.appointmentTime : '12:30 PM'}
            patientsAhead={stats.patientsAhead}
            estimatedWait={stats.estimatedWait}
            status={myQueueItem ? myQueueItem.status : 'Waiting'}
            priority={myQueueItem ? myQueueItem.priority : 'Normal'}
            onClose={() => setShowTokenModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};
