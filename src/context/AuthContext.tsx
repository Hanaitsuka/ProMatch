import React from 'react';
import { getSession, saveSession, clearSession } from '../api/client';
import type { Session, SessionProfile } from '../api/client';

interface AuthState {
  session: Session | null;
  user: SessionProfile | null;
  signIn: (s: Session) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<SessionProfile>) => void;
}
const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(getSession);

  const value: AuthState = {
    session,
    user: session?.profile ?? null,
    signIn: s => { saveSession(s); setSession(s); },
    signOut: () => { clearSession(); setSession(null); },
    updateProfile: patch => setSession(prev => {
      if (!prev) return prev;
      const next = { ...prev, profile: { ...prev.profile, ...patch } };
      saveSession(next);
      return next;
    }),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
