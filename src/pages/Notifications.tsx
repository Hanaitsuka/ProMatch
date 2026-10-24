import { BellIcon, CheckIcon } from '../components/Icons';
import { Card, Button } from '../components/ui';
import { useNotifications } from '../context/NotificationsContext';
import { timeAgo } from '../api/adapters';

export default function Notifications() {
  const { items, loading, error, reload, markRead, markAllRead } = useNotifications();

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, color: '#1E293B' }}>Notifications</h1>
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>Requests, project activity, and workspace updates</p>
        </div>
        {items.length > 0 && <Button variant="secondary" size="sm" onClick={() => markAllRead().catch(() => reload())}>Mark all as read</Button>}
      </div>

      {error && (
        <div style={{ margin: '0 0 16px', padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 14 }}>
          {error} <button onClick={reload} style={{ background: 'none', border: 'none', color: '#800020', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {items.length > 0 && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {items.map((n, index) => (
            <div key={n.id} style={{
              display: 'flex', gap: 14, padding: '18px 22px', alignItems: 'flex-start',
              borderBottom: index < items.length - 1 ? '1px solid #E2E8F0' : 'none',
              background: '#FBEFF2',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#800020', color: '#fff', flexShrink: 0 }}>
                <BellIcon size={19} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#1E293B', lineHeight: 1.5 }}>{n.message}</p>
                  <span style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>{timeAgo(n.timestamp)}</span>
                </div>
                <button onClick={() => markRead(n.id).catch(() => reload())} style={{ background: 'none', border: 'none', padding: 0, color: '#800020', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <CheckIcon size={14} /> Mark as read
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {!loading && !error && items.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94A3B8', fontSize: 14, justifyContent: 'center', padding: '48px 0' }}>
          <BellIcon size={16} /> You’re all caught up
        </div>
      )}
    </div>
  );
}
