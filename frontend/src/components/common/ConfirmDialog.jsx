import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: isDanger ? '#fee2e2' : '#e0f2fe',
            color: isDanger ? '#ef4444' : '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <AlertTriangle size={28} />
        </div>
        <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ minWidth: '100px' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ minWidth: '100px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
