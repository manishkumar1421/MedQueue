import React from 'react';
import {
  Clock,
  Volume2,
  Stethoscope,
  CheckCircle2,
  SkipForward,
  PauseCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toLowerCase().trim();

  if (norm === 'waiting') {
    return (
      <span className={`badge badge-waiting ${className}`}>
        <Clock size={12} />
        Waiting
      </span>
    );
  }
  if (norm === 'called') {
    return (
      <span className={`badge badge-called ${className}`}>
        <Volume2 size={12} className="text-sky-600 animate-pulse" />
        Called
      </span>
    );
  }
  if (norm === 'in consultation' || norm === 'in_consultation') {
    return (
      <span className={`badge badge-in-consultation ${className}`}>
        <Stethoscope size={12} />
        In Consultation
      </span>
    );
  }
  if (norm === 'completed') {
    return (
      <span className={`badge badge-completed ${className}`}>
        <CheckCircle2 size={12} />
        Completed
      </span>
    );
  }
  if (norm === 'skipped') {
    return (
      <span className={`badge badge-skipped ${className}`}>
        <SkipForward size={12} />
        Skipped
      </span>
    );
  }
  if (norm === 'on hold' || norm === 'on_hold') {
    return (
      <span className={`badge badge-on-hold ${className}`}>
        <PauseCircle size={12} />
        On Hold
      </span>
    );
  }
  if (norm === 'cancelled') {
    return (
      <span className={`badge badge-cancelled ${className}`}>
        <XCircle size={12} />
        Cancelled
      </span>
    );
  }
  if (norm === 'confirmed') {
    return (
      <span className={`badge badge-completed ${className}`}>
        <UserCheck size={12} />
        Confirmed
      </span>
    );
  }

  return (
    <span className={`badge badge-normal ${className}`}>
      {status || 'Unknown'}
    </span>
  );
};

export const PriorityBadge = ({ priority, className = '' }) => {
  const p = (priority || 'Normal').toLowerCase();

  if (p === 'emergency') {
    return (
      <span className={`badge badge-emergency ${className}`}>
        <ShieldAlert size={12} />
        Emergency
      </span>
    );
  }
  if (p === 'senior citizen' || p === 'senior') {
    return (
      <span className={`badge badge-senior ${className}`}>
        <AlertTriangle size={12} />
        Senior Citizen
      </span>
    );
  }
  return (
    <span className={`badge badge-normal ${className}`}>
      Normal
    </span>
  );
};

export const DoctorStatusBadge = ({ status }) => {
  const s = (status || 'Available').toLowerCase();

  if (s === 'available') {
    return (
      <span className="badge badge-completed">
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', marginRight: '4px' }}></span>
        Available
      </span>
    );
  }
  if (s === 'busy') {
    return (
      <span className="badge badge-waiting">
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block', marginRight: '4px' }}></span>
        In OPD / Busy
      </span>
    );
  }
  if (s === 'on leave') {
    return (
      <span className="badge badge-skipped">
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', marginRight: '4px' }}></span>
        On Leave
      </span>
    );
  }
  return (
    <span className="badge badge-cancelled">
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8', display: 'inline-block', marginRight: '4px' }}></span>
      Unavailable
    </span>
  );
};
