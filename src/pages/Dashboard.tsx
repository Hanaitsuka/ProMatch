import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ProgressBar, Avatar, SkillBadge, ModeBadge } from '../components/ui';
import { PitchModal } from '../components/Modals';
import { InviteModal } from '../components/Modals';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../api/useAsync';
import { dashboardApi } from '../api/endpoints';
import { toProject, toStudent, fullDept } from '../api/adapters';

export default function Dashboard() {
  const [pitchOpen, setPitchOpen] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [invitee, setInvitee] = React.useState<{ id: number; name: string } | null>(null);

  const { user } = useAuth();
  const dash = useAsync(() => dashboardApi.get(user!.id), [user?.id]);
  const mySkills = dash.data?.profile.skills ?? [];
  const myName = dash.data?.profile.fullName ?? user?.fullName ?? '';
  const MY_PROJECTS = (dash.data?.activeProjects ?? []).map(p => ({
    ...toProject(p, mySkills),
    role: (p.ownerName === myName ? 'Owner' : 'Member') as 'Owner' | 'Member',
  }));
  const recommended = (dash.data?.recommendedPitches ?? []).map(r => toProject(r.project, mySkills)).slice(0, 3);
  const topStudents = (dash.data?.topTeammateMatches ?? []).map(m => toStudent(m, mySkills, m.matchScore)).slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* ─── GREETING ROW ─── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 28, gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 30, fontWeight: 700, color: '#1E293B' }}>
            {greeting}, {myName.split(' ')[0]}
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: '#64748B' }}>
            {[fullDept(dash.data?.profile.department ?? user?.department), dash.data?.profile.semester ?? user?.semester].filter(Boolean).join(' · ')}
          </p>
        </div>
        <Button variant="primary" size="lg" icon={<span>+</span>} onClick={() => setPitchOpen(true)}>
          Pitch a Project
        </Button>
      </div>

      {dash.loading && !dash.data && (
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748B' }}>Loading your dashboard… (the server may take a few seconds to wake up)</p>
      )}
      {dash.error && (
        <div style={{ margin: '0 0 20px', padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 14, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{dash.error}</span>
          <button onClick={dash.reload} style={{ background: 'none', border: 'none', color: '#800020', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {/* ─── TOP GRID (Card1 + Card2) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 24, marginBottom: 24 }}>

        {/* Card 1: My Active Pitches */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
              My Active Pitches & Joined Projects
            </h3>
            <Link to="/explore" style={{ fontSize: 13, color: '#800020', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ width: '100%', height: 1, background: '#E2E8F0', marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {MY_PROJECTS.map(p => (
              <div key={p.id} style={{
                display: 'flex', flexDirection: 'column', gap: 12,
                paddingBottom: 20, borderBottom: '1px solid #F1F5F9',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                        background: p.role === 'Owner' ? '#FBEFF2' : '#F1F5F9',
                        color: p.role === 'Owner' ? '#800020' : '#475569',
                        border: `1px solid ${p.role === 'Owner' ? '#F3D6DD' : '#E2E8F0'}`,
                      }}>
                        {p.role}
                      </span>
                      <ModeBadge mode={p.mode} />
                    </div>
                    <h4 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: '#1E293B' }} className="line-clamp-2">
                      {p.title}
                    </h4>
                  </div>
                  <Link to="/messages" style={{ fontSize: 13, color: '#800020', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Open workspace →
                  </Link>
                </div>
                <ProgressBar filled={p.teamFilled} total={p.teamSize} label="Team Progress" />
              </div>
            ))}
          </div>
        </Card>

        {/* Card 2: Recommended Pitches */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
              Recommended Pitches
            </h3>
            <Link to="/explore" style={{ fontSize: 13, color: '#800020', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ width: '100%', height: 1, background: '#E2E8F0', marginBottom: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recommended.map(p => (
              <Link to="/explore" key={p.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 8,
                  padding: '12px', borderRadius: 10, border: '1px solid #E2E8F0',
                  transition: 'background 150ms', cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FBEFF2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1E293B' }} className="line-clamp-2">
                    {p.title}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(p.matchedSkills ?? []).slice(0, 2).map(s => (
                      <span key={s} style={{
                        fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                        border: '1px solid #16A34A', background: '#F0FDF4', color: '#16A34A',
                      }}>{s}</span>
                    ))}
                    <ModeBadge mode={p.mode} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* ─── Card 3: Top Teammate Matches ─── */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Top Teammate Matches</h3>
          <Link to="/teammates" style={{ fontSize: 13, color: '#800020', fontWeight: 600, textDecoration: 'none' }}>Browse directory →</Link>
        </div>
        <div style={{ width: '100%', height: 1, background: '#E2E8F0', marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {topStudents.map(s => (
            <div key={s.id} style={{
              border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center',
            }}>
              <Avatar name={s.name} size={48} />
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{s.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>{s.dept}, {s.sem}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                {s.skills.slice(0, 2).map(sk => (
                  <span key={sk} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 4,
                    background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
                  }}>{sk}</span>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setInvitee({ id: Number(s.id), name: s.name }); setInviteOpen(true); }}
                style={{ width: '100%' }}
              >
                Send Invite
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <PitchModal open={pitchOpen} onClose={() => setPitchOpen(false)} onCreated={dash.reload} />
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} targetName={invitee?.name} targetId={invitee?.id} />
    </div>
  );
}
