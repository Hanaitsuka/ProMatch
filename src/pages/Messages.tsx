import React from 'react';
import { Avatar, PillTabs, Button } from '../components/ui';
import { Drawer } from '../components/Modal';
import { THREADS, MESSAGES } from '../data/mockData';
import type { Message, Thread } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../api/useAsync';
import { usersApi, messagesApi } from '../api/endpoints';
import { DocumentIcon, ExternalLinkIcon, FigmaIcon, GithubIcon, NoteIcon, PaperclipIcon, SearchIcon, SendIcon } from '../components/Icons';

export default function Messages() {
  const [threadTab, setThreadTab] = React.useState('Projects');
  const [activeThread, setActiveThread] = React.useState(THREADS[0]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState('');
  const [messages, setMessages] = React.useState(MESSAGES);

  const { user } = useAuth();
  const usersList = useAsync(() => usersApi.list(), []);
  const [directMsgs, setDirectMsgs] = React.useState<Message[]>([]);
  const [sendError, setSendError] = React.useState('');

  // Direct chats are real (1:1 via /api/messages). Project group chats have no backend yet, so
  // the Projects tab stays a preview.
  const directThreads: Thread[] = (usersList.data ?? [])
    .filter(u => u.id !== user?.id)
    .map(u => ({ id: `u${u.id}`, type: 'direct', title: u.fullName, lastMessage: 'Start a conversation', time: '', unread: false }));
  const visibleThreads = threadTab === 'Projects' ? THREADS.filter(t => t.type === 'project') : directThreads;
  const isDirect = activeThread.type === 'direct';
  const peerId = isDirect ? Number(activeThread.id.slice(1)) : null;

  const toMessage = (m: { id: number; content: string; timestamp: string; sender: { id: number; fullName: string } }): Message => ({
    id: String(m.id),
    sender: m.sender.fullName,
    senderSelf: m.sender.id === user?.id,
    text: m.content,
    timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  React.useEffect(() => {
    if (!isDirect || !user || peerId === null) return;
    let cancelled = false;
    const load = () => messagesApi.conversation(user.id, peerId)
      .then(list => { if (!cancelled) setDirectMsgs(list.map(toMessage)); })
      .catch(() => undefined);
    setDirectMsgs([]);
    load();
    const t = setInterval(load, 8000);   // simple polling; use websockets later
    return () => { cancelled = true; clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirect, peerId, user?.id]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !user) return;
    if (isDirect && peerId !== null) {
      setSendError('');
      try {
        const saved = await messagesApi.send({ senderId: user.id, receiverId: peerId, text });
        setDirectMsgs(prev => [...prev, toMessage(saved)]);
        setNewMessage('');
      } catch (e) { setSendError(e instanceof Error ? e.message : 'Could not send message'); }
      return;
    }
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`, sender: user.fullName, senderSelf: true, text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
  };

  const shownMessages = isDirect ? directMsgs : messages;

  return (
    <div style={{
      display: 'flex', height: 'calc(100vh - 72px)', overflow: 'hidden',
    }}>
      {/* ─── LEFT PANE ─── */}
      <div style={{
        width: 340, flexShrink: 0, borderRight: '1px solid #E2E8F0',
        background: '#fff', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Messages</h2>
          <PillTabs tabs={['Projects', 'Direct']} active={threadTab} onChange={setThreadTab} />
        </div>

        {/* Search */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' }}><SearchIcon size={14} /></span>
            <input
              placeholder="Search conversations…"
              style={{
                width: '100%', height: 36, borderRadius: 8, border: '1px solid #E2E8F0',
                paddingLeft: 32, fontSize: 13, color: '#1E293B', background: '#F8FAFC', outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            />
          </div>
        </div>

        {/* Thread list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {visibleThreads.map(thread => {
            const isActive = activeThread.id === thread.id;
            return (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: isActive ? '#FBEFF2' : 'transparent',
                  borderLeft: isActive ? '3px solid #800020' : '3px solid transparent',
                  transition: 'background 150ms', position: 'relative',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Avatar name={thread.title} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: thread.unread ? 700 : 600, color: '#1E293B' }}
                      className="line-clamp-2"
                    >
                      {thread.title}
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0, marginLeft: 8 }}>{thread.time}</span>
                  </div>
                  <p style={{
                    margin: 0, fontSize: 13, color: thread.unread ? '#475569' : '#94A3B8',
                    fontWeight: thread.unread ? 600 : 400, overflow: 'hidden',
                    whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                  }}>
                    {thread.lastMessage}
                  </p>
                </div>
                {thread.unread && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#800020',
                    flexShrink: 0, marginTop: 4,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── RIGHT PANE ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: 64, background: '#fff', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={activeThread.title} size={36} />
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{activeThread.title}</h3>
              {activeThread.type === 'project' && (
                <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>Team workspace</p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar stack for project chats */}
            {activeThread.type === 'project' && (
              <div style={{ display: 'flex' }}>
                {['Hadiya Thanveer', 'Mohammed Anees', 'Fathima Rizma'].map((n, i) => (
                  <div key={n} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i }}>
                    <Avatar name={n} size={28} ring />
                  </div>
                ))}
                <span style={{ fontSize: 12, color: '#64748B', marginLeft: 10, alignSelf: 'center' }}>3 members</span>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>
              View Project Brief
            </Button>
          </div>
        </div>

        {/* Chat body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Date separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>Today</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          {shownMessages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.senderSelf ? 'flex-end' : 'flex-start',
                gap: 10, alignItems: 'flex-end',
              }}
            >
              {!msg.senderSelf && <Avatar name={msg.sender} size={32} />}
              <div style={{ maxWidth: '66%' }}>
                {!msg.senderSelf && (
                  <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 4, paddingLeft: 4 }}>
                    {msg.sender}
                  </span>
                )}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: msg.senderSelf ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.senderSelf ? '#800020' : '#fff',
                  color: msg.senderSelf ? '#fff' : '#1E293B',
                  fontSize: 14, lineHeight: 1.6,
                  boxShadow: '0 1px 3px rgba(15,23,42,.08)',
                  border: msg.senderSelf ? 'none' : '1px solid #E2E8F0',
                }}>
                  {msg.text}
                </div>
                <span style={{
                  display: 'block', fontSize: 11, color: '#94A3B8', marginTop: 4,
                  textAlign: msg.senderSelf ? 'right' : 'left', paddingLeft: 4, paddingRight: 4,
                }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {sendError && <div style={{ padding: '8px 20px', fontSize: 13, color: '#B91C1C', background: '#FEF2F2', borderTop: '1px solid #FECACA' }}>{sendError}</div>}
        {!isDirect && <div style={{ padding: '8px 20px', fontSize: 12, color: '#64748B', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>Project workspaces are a preview — switch to the Direct tab for live 1:1 messages.</div>}
        {/* Bottom input */}
        <div style={{
          background: '#fff', borderTop: '1px solid #E2E8F0',
          padding: '12px 20px',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <button style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: '#F1F5F9', cursor: 'pointer', fontSize: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="Attach file"><PaperclipIcon size={17} /></button>
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message…"
            style={{
              flex: 1, height: 44, borderRadius: 22,
              border: '1px solid #E2E8F0', padding: '0 18px',
              fontSize: 15, color: '#1E293B', background: '#F8FAFC',
              fontFamily: 'Inter, system-ui, sans-serif', outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            style={{
              width: 44, height: 44, borderRadius: '50%', border: 'none',
              background: newMessage.trim() ? '#800020' : '#E2E8F0',
              cursor: newMessage.trim() ? 'pointer' : 'default',
              fontSize: 18, color: '#fff', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 150ms',
            }}
          aria-label="Send message"><SendIcon size={18} /></button>
        </div>
      </div>

      {/* ─── PROJECT BRIEF DRAWER ─── */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Project Brief">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1E293B' }}>
              High-level Roadmap
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Design System & Wireframes', status: 'done' },
                { label: 'Authentication & Onboarding', status: 'done' },
                { label: 'Project Explore & Match Engine', status: 'active' },
                { label: 'In-App Messaging Workspace', status: 'pending' },
                { label: 'Beta Testing & Feedback', status: 'pending' },
              ].map((m, i) => (
                <div key={m.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: m.status === 'done' ? '#16A34A' : m.status === 'active' ? '#800020' : '#E2E8F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#fff', fontWeight: 700,
                    }}>
                      {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : ''}
                    </div>
                    {i < 4 && <div style={{ width: 2, height: 28, background: '#E2E8F0' }} />}
                  </div>
                  <span style={{
                    fontSize: 14, color: m.status === 'pending' ? '#94A3B8' : '#1E293B',
                    fontWeight: m.status === 'active' ? 700 : 500, paddingTop: 2,
                  }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1E293B' }}>
              Shared Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Figma Design File', icon: FigmaIcon },
                { label: 'GitHub Repository (Private)', icon: GithubIcon },
                { label: 'Project Notion Doc', icon: DocumentIcon },
                { label: 'Meeting Notes — Sprint 1', icon: NoteIcon },
              ].map(link => (
                <div key={link.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FBEFF2')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFC')}
                >
                  <link.icon size={18} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1E293B' }}>{link.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#94A3B8', display: 'flex' }}><ExternalLinkIcon size={15} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
