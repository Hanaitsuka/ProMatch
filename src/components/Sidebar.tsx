import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { GECCrestOnDark } from './ui';
import { DashboardIcon, SearchIcon, UsersIcon, MessageIcon, UserIcon, LogOutIcon } from './Icons';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { label: 'Explore Projects', icon: SearchIcon, path: '/explore' },
  { label: 'Find Teammates', icon: UsersIcon, path: '/teammates' },
  { label: 'Messages', icon: MessageIcon, path: '/messages' },
  { label: 'Profile', icon: UserIcon, path: '/profile' },
];

export function Sidebar() {
  const { signOut } = useAuth();
  return (
    <nav style={{
      width: 264, flexShrink: 0,
      background: '#800020', height: '100vh',
      position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      padding: '24px 12px',
      boxShadow: '2px 0 12px rgba(128,0,32,.15)',
    }}>
      {/* Logo mark at top */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 12px 20px' }}>
        <GECCrestOnDark size={40} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>ProMatch</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>GEC Thrissur</div>
        </div>
      </div>

      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              height: 48, padding: '0 14px', borderRadius: 10,
              textDecoration: 'none', fontSize: 15, fontWeight: 600,
              color: '#fff', position: 'relative', overflow: 'hidden',
              background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
              transition: 'background 150ms',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!el.classList.contains('active')) el.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!el.classList.contains('active')) el.style.background = 'transparent';
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '15%', height: '70%',
                    width: 4, background: '#fff', borderRadius: '0 4px 4px 0',
                  }} />
                )}
                <span style={{ minWidth: 24, display: 'flex', justifyContent: 'center' }}><item.icon size={19} /></span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />

      {/* Sign out */}
      <NavLink
        to="/"
        onClick={() => signOut()}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          height: 48, padding: '0 14px', borderRadius: 10,
          textDecoration: 'none', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
          transition: 'background 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <LogOutIcon size={19} />
        <span>Sign Out</span>
      </NavLink>
    </nav>
  );
}
