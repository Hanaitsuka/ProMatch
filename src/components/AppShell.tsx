import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { useAuth } from '../context/AuthContext';
import { NotificationsProvider } from '../context/NotificationsContext';

export function AppShell() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/auth" replace />;
  return (
    <NotificationsProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopHeader variant="auth" />
          <main style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationsProvider>
  );
}
