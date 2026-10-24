import React from 'react';
import { SearchIcon } from '../components/Icons';
import { SearchBar, Button } from '../components/ui';
import { ProjectCard } from '../components/ProjectCard';
import { JoinModal, PitchModal } from '../components/Modals';
import { DOMAINS, MODES, YEARS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../api/useAsync';
import { projectsApi } from '../api/endpoints';
import { toProject } from '../api/adapters';
import { CAPS } from '../api/capabilities';
import type { Project } from '../data/mockData';

type SortKey = 'match' | 'newest' | 'urgent';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'match', label: 'Most Relevant (Highest Match %)' },
  { value: 'newest', label: 'Newest (Highest Match First)' },
  { value: 'urgent', label: 'Team Size Needed (Urgent)' },
];

export default function Explore() {
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<SortKey>('match');
  const [filterYear, setFilterYear] = React.useState('');
  const [filterDomain, setFilterDomain] = React.useState('');
  const [filterSize, setFilterSize] = React.useState('');
  const [filterMode, setFilterMode] = React.useState('');
  const [joinModal, setJoinModal] = React.useState<{ open: boolean; project: Project | null; mode: 'join' | 'barter' }>({
    open: false, project: null, mode: 'join',
  });
  const [pitchOpen, setPitchOpen] = React.useState(false);

  const { user } = useAuth();
  const list = useAsync(() => projectsApi.list(), []);
  // Don't show your own pitches in Explore; compatibility is computed against your skills.
  const PROJECTS = (list.data ?? [])
    .filter(p => p.owner?.id !== user?.id)
    .map(p => toProject(p, user?.skills ?? []));

  const activeFilters = [filterYear, filterDomain, filterSize, filterMode].filter(Boolean);

  const filtered = PROJECTS
    .filter(p => {
      const q = search.toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q) || p.skills.some(s => s.toLowerCase().includes(q));
      const matchesDomain = !filterDomain || p.domain === filterDomain;
      const matchesMode = !filterMode || p.mode === filterMode;
      return matchesSearch && matchesDomain && matchesMode;
    })
    .sort((a, b) => {
      if (sort === 'match' || sort === 'newest') return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      if (sort === 'urgent') return (a.teamSize - a.teamFilled) - (b.teamSize - b.teamFilled);
      return 0;
    });

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, color: '#1E293B' }}>Explore Projects</h1>
          <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>{filtered.length} projects · sorted by compatibility</p>
        </div>
        <Button variant="primary" size="md" icon={<span>+</span>} onClick={() => setPitchOpen(true)}>
          Pitch a Project
        </Button>
      </div>

      {list.loading && !list.data && <p style={{ margin: '0 0 16px', fontSize: 14, color: '#64748B' }}>Loading projects… (the server may take a few seconds to wake up)</p>}
      {list.error && (
        <div style={{ margin: '0 0 16px', padding: '12px 16px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 14, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{list.error}</span>
          <button onClick={list.reload} style={{ background: 'none', border: 'none', color: '#800020', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {/* ─── TOOLBAR: Search + Sort ─── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, domain, or skill…" />
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          style={{
            height: 48, borderRadius: 10, border: '1px solid #E2E8F0',
            padding: '0 36px 0 14px', fontSize: 14, color: '#1E293B', background: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', cursor: 'pointer',
            appearance: 'none', flexShrink: 0, minWidth: 260,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
          }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* ─── FILTER ROW ─── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28, alignItems: 'center' }}>
        {[
          ...(CAPS.pitchExtraFields ? [
            { label: 'Academic Year', value: filterYear, setter: setFilterYear, opts: YEARS },
            { label: 'Domain', value: filterDomain, setter: setFilterDomain, opts: DOMAINS },
          ] : []),
          { label: 'Collaboration Mode', value: filterMode, setter: setFilterMode, opts: MODES },
        ].map(f => (
          <select
            key={f.label}
            value={f.value}
            onChange={e => f.setter(e.target.value)}
            style={{
              height: 38, borderRadius: 20, border: f.value ? '1.5px solid #800020' : '1px solid #CBD5E1',
              padding: '0 30px 0 14px', fontSize: 13, fontWeight: 500,
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

        {/* Active filter chips */}
        {activeFilters.map(f => (
          <span key={f} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 32, padding: '0 12px', borderRadius: 999,
            background: '#FBEFF2', color: '#800020', border: '1px solid #F3D6DD',
            fontSize: 13, fontWeight: 600,
          }}>
            {f}
            <button
              onClick={() => {
                if (YEARS.includes(f)) setFilterYear('');
                if (DOMAINS.includes(f)) setFilterDomain('');
                if (MODES.includes(f)) setFilterMode('');
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#800020', padding: 0, lineHeight: 1 }}
            >×</button>
          </span>
        ))}

        {activeFilters.length > 0 && (
          <button
            onClick={() => { setFilterYear(''); setFilterDomain(''); setFilterSize(''); setFilterMode(''); }}
            style={{
              background: 'none', border: 'none', fontSize: 13, color: '#64748B',
              cursor: 'pointer', textDecoration: 'underline', fontWeight: 500,
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* ─── RESULTS GRID ─── */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0', color: '#94A3B8',
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px', background: '#FBEFF2', color: '#800020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SearchIcon size={28} /></div>
          <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#475569' }}>No projects match your filters</h3>
          <p style={{ margin: 0, fontSize: 15, color: '#94A3B8' }}>Try adjusting your search or clearing some filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {filtered.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              showMatch
              onJoin={() => setJoinModal({ open: true, project: p, mode: 'join' })}
              onBarter={() => setJoinModal({ open: true, project: p, mode: 'barter' })}
            />
          ))}
        </div>
      )}

      <JoinModal
        open={joinModal.open}
        project={joinModal.project}
        mode={joinModal.mode}
        onClose={() => setJoinModal({ open: false, project: null, mode: 'join' })}
      />
      <PitchModal open={pitchOpen} onClose={() => setPitchOpen(false)} onCreated={list.reload} />
    </div>
  );
}
