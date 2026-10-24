import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, footer, width = 560 }: ModalProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-enter"
        style={{
          background: '#fff', borderRadius: 24,
          width: '100%', maxWidth: width,
          boxShadow: '0 24px 64px rgba(15,23,42,.24)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '92vh', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 32px 20px',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{title}</h2>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: '#F1F5F9', cursor: 'pointer', fontSize: 18, color: '#64748B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 150ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E2E8F0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '16px 32px 24px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex', justifyContent: 'flex-end', gap: 12,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Drawer (right slide-out) ───────────────────────────────────────────────────
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
export function Drawer({ open, onClose, title, children }: DrawerProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(15,23,42,.45)',
        display: 'flex', justifyContent: 'flex-end',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="drawer-enter"
        style={{
          width: 420, maxWidth: '100vw', background: '#fff',
          height: '100%', overflowY: 'auto',
          boxShadow: '-4px 0 32px rgba(15,23,42,.16)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 24px 16px',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{title}</h3>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: '#F1F5F9', cursor: 'pointer', fontSize: 16, color: '#64748B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
        <div style={{ padding: '20px 24px', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
