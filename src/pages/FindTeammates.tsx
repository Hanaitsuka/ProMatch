import React from 'react';
import { TagInput } from '../components/ui';
import { StudentCard } from '../components/StudentCard';
import { InviteModal } from '../components/Modals';
import { DEPTS, EXPERIENCE_LEVELS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../api/useAsync';
import { usersApi } from '../api/endpoints';
import { toStudent } from '../api/adapters';
import { CAPS } from '../api/capabilities';

const HOURS_OPTIONS = ['< 5 hrs/week', '5–10 hrs/week', '10–15 hrs/week', '15+ hrs/week'];

export default function FindTeammates() {
  const [skills, setSkills] = React.useState<string[]>([]);
  const [filterDept, setFilterDept] = React.useState('');
  const [filterExp, setFilterExp] = React.useState('');
  const [filterHours, setFilterHours] = React.useState('');
  const [inviteModal, setInviteModal] = React.useState<{ open: boolean; name: string; id?: number }>({ open: false, name: '' });
  const { user } = useAuth();
  const list = useAsync(() => usersApi.list(), []);
  const STUDENTS = (list.data ?? [])
    .filter(u => u.id !== user?.id)
    .map(u => toStudent(u, user?.skills ?? []));

  const filtered = STUDENTS.filter(s => {
    const matchesSearch = skills.every(query => {
      const q = query.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.skills.some(sk => sk.toLowerCase().includes(q)) || s.dept.toLowerCase().includes(q);
    });
    const matchesDept = !filterDept || s.dept === filterDept;
    const matchesExp = !filterExp || s.experience === filterExp;
    const matchesHours = !filterHours || (
      filterHours.startsWith('<') ? s.weeklyHours < 5 :
      filterHours.startsWith('5') ? s.weeklyHours >= 5 && s.weeklyHours <= 10 :
      filterHours.startsWith('10') ? s.weeklyHours > 10 && s.weeklyHours < 15 :
      s.weeklyHours >= 15
    );
    return matchesSearch && matchesDept && matchesExp && matchesHours;
  });

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, color: '#1E293B' }}>Find Teammates</h1>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>Discover students whose skills complement yours</p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ minWidth: 320, flex: 1, position: 'relative' }}>
          <TagInput
            tags={skills}
            onChange={setSkills}
            suggestions={Array.from(new Set(STUDENTS.flatMap(student => student.skills)))}
            placeholder="Type a skill and press Enter (e.g. python, docker, ai)…"
          />
        </div>
        {[
          { label: 'Department', value: filterDept, setter: setFilterDept, opts: DEPTS },
          ...(CAPS.userAvailabilityFields ? [
            { label: 'Experience Level', value: filterExp, setter: setFilterExp, opts: EXPERIENCE_LEVELS },
            { label: 'Weekly Hours', value: filterHours, setter: setFilterHours, opts: HOURS_OPTIONS },
          ] : []),
        ].map(f => (
          <select
            key={f.label}
            value={f.value}
            onChange={e => f.setter(e.target.value)}
            style={{
              height: 48, borderRadius: 10, border: f.value ? '1.5px solid #800020' : '1px solid #E2E8F0',
              padding: '0 32px 0 14px', fontSize: 14, fontWeight: 500,
              color: f.value ? '#800020' : '#475569',
              background: f.value ? '#FBEFF2' : '#fff',
              fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
            }}
          >
            <option value="">{f.label}</option>
            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {list.error && (
        <div style={{ margin: '0 0 16px', padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 14, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{list.error}</span>
          <button onClick={list.reload} style={{ background: 'none', border: 'none', color: '#800020', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
        </div>
      )}
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748B' }}>
        {list.loading && !list.data ? 'Loading students… ' : ''}{filtered.length} student{filtered.length !== 1 ? 's' : ''} found
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px', background: '#FBEFF2', color: '#800020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>×</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#475569' }}>No students match your filters</h3>
          <p style={{ margin: 0, fontSize: 15, color: '#94A3B8' }}>Try broadening your search criteria</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {filtered.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onInvite={() => setInviteModal({ open: true, name: student.name, id: Number(student.id) })}
            />
          ))}
        </div>
      )}

      <InviteModal
        open={inviteModal.open}
        targetName={inviteModal.name}
        targetId={inviteModal.id}
        onClose={() => setInviteModal({ open: false, name: '' })}
      />
    </div>
  );
}
