import React from 'react';
import { notificationsApi } from '../api/endpoints';
import type { ApiNotification } from '../api/adapters';
import { useAuth } from './AuthContext';

interface NotifState {
  items: ApiNotification[];
  count: number;
  loading: boolean;
  error: string | null;
  reload: () => void;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}
const Ctx = React.createContext<NotifState | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = React.useState<ApiNotification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const reload = React.useCallback(() => {
    if (!user) return;
    notificationsApi.unread(user.id)
      .then(list => { setItems(list); setError(null); })
      .catch(e => setError(e instanceof Error ? e.message : 'Could not load notifications'))
      .finally(() => setLoading(false));
  }, [user]);

  React.useEffect(() => {
    reload();
    const t = setInterval(reload, 30000);   // light polling; swap for websockets later
    return () => clearInterval(t);
  }, [reload]);

  const markRead = async (id: number) => {
    await notificationsApi.markRead(id);
    setItems(prev => prev.filter(n => n.id !== id));
  };
  const markAllRead = async () => {
    const ids = items.map(n => n.id);
    await Promise.all(ids.map(id => notificationsApi.markRead(id)));
    setItems([]);
  };

  return <Ctx.Provider value={{ items, count: items.length, loading, error, reload, markRead, markAllRead }}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return c;
}
