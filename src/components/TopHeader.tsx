import { Link, useNavigate } from 'react-router-dom';
import { GECCrest, NotificationBell, Avatar } from './ui';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';

function HeaderBell({ onClick }: { onClick: () => void }) {
  const { count } = useNotifications();
  return <NotificationBell count={count} onClick={onClick} />;
}

interface TopHeaderProps {
  variant?: 'public' | 'auth';
  userName?: string;
}

export function TopHeader({ variant = 'auth', userName }: TopHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const displayName = userName ?? user?.fullName ?? 'Student';
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      width: '100%', height: 72, background: '#fff',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
      boxShadow: '0 1px 3px rgba(15,23,42,.06)',
    }}>
      {/* LEFT: Crest + College Name */}
      <Link to={variant === 'public' ? '/' : '/dashboard'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
        <GECCrest size={48} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
            Government Engineering College, Thrissur
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>GEC · ProMatch Portal</div>
        </div>
      </Link>

      {/* RIGHT */}
      {variant === 'public' ? (
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/auth" style={{
            height: 40, padding: '0 18px', borderRadius: 10, display: 'flex', alignItems: 'center',
            fontSize: 14, fontWeight: 600, color: '#1E293B', textDecoration: 'none',
            border: 'none', background: 'transparent', cursor: 'pointer',
            transition: 'background 150ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Sign In
          </Link>
          <Link to="/auth?tab=register" style={{
            height: 40, padding: '0 18px', borderRadius: 10, display: 'flex', alignItems: 'center',
            fontSize: 14, fontWeight: 600, color: '#fff', background: '#800020',
            textDecoration: 'none', transition: 'background 150ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#A30000')}
            onMouseLeave={e => (e.currentTarget.style.background = '#800020')}
          >
            Register
          </Link>
        </nav>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeaderBell onClick={() => navigate('/notifications')} />
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px',
                borderRadius: 8, transition: 'background 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Avatar name={displayName} size={36} />
              <span style={{ fontSize: 13, color: '#64748B' }}>▾</span>
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%',
                background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
                boxShadow: '0 8px 24px rgba(15,23,42,.12)', minWidth: 160, zIndex: 200,
                padding: 6, overflow: 'hidden',
              }}>
                {[
                  { label: 'View Profile', action: () => { navigate('/profile'); setMenuOpen(false); } },
                  { label: 'Sign Out', action: () => { signOut(); navigate('/'); setMenuOpen(false); } },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '9px 14px', border: 'none', background: 'none',
                      cursor: 'pointer', fontSize: 14, color: '#1E293B', borderRadius: 8,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
