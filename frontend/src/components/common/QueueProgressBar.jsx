import React from 'react';
import { Clock, Volume2, Stethoscope, CheckCircle2 } from 'lucide-react';

export const QueueProgressBar = ({ status = 'Waiting' }) => {
  const norm = (status || '').toLowerCase().trim();

  const steps = [
    { id: 'waiting', label: 'In Queue', icon: Clock },
    { id: 'called', label: 'Token Called', icon: Volume2 },
    { id: 'in consultation', label: 'In Consultation', icon: Stethoscope },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 }
  ];

  const getStepIndex = (st) => {
    if (st === 'waiting') return 0;
    if (st === 'called') return 1;
    if (st === 'in consultation' || st === 'in_consultation') return 2;
    if (st === 'completed') return 3;
    return 0;
  };

  const currentIndex = getStepIndex(norm);

  return (
    <div style={{ padding: '1rem 0', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        {/* Background track line */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '4px',
            backgroundColor: '#e2e8f0',
            zIndex: 1
          }}
        />

        {/* Active colored progress line */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            width: `${(currentIndex / (steps.length - 1)) * 82}%`,
            height: '4px',
            backgroundColor: '#0284c7',
            transition: 'width 0.4s ease',
            zIndex: 1
          }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          let circleBg = '#ffffff';
          let circleBorder = '#cbd5e1';
          let iconColor = '#94a3b8';
          let textColor = '#64748b';

          if (isDone) {
            circleBg = '#10b981';
            circleBorder = '#10b981';
            iconColor = '#ffffff';
            textColor = '#065f46';
          } else if (isCurrent) {
            circleBg = '#0284c7';
            circleBorder = '#0284c7';
            iconColor = '#ffffff';
            textColor = '#0284c7';
          }

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                position: 'relative',
                zIndex: 2,
                minWidth: '70px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: circleBg,
                  border: `2.5px solid ${circleBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? '0 0 0 4px #e0f2fe' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <Icon size={18} color={iconColor} />
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: textColor
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
