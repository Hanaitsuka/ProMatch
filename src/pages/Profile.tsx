import React from 'react';
import { Avatar, Card, ModeBadge, SkillBadge } from '../components/ui';
import { CheckIcon, ExternalLinkIcon, GithubIcon, PencilIcon } from '../components/Icons';
import { SEMESTERS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../api/useAsync';
import { usersApi } from '../api/endpoints';
import { toProject, fullDept } from '../api/adapters';
import { getExtras, saveExtras } from '../api/extras';
import { CAPS } from '../api/capabilities';

type SkillLevel = 'Advanced' | 'Intermediate' | 'Learning';

interface SkillGroup {
  level: SkillLevel;
  skills: string[];
}

const LEVEL_COLORS: Record<SkillLevel, { bg: string; border: string; text: string }> = {
  Advanced:     { bg: '#F0FDF4', border: '#A7F3D0', text: '#059669' },
  Intermediate: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' },
  Learning:     { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' },
};

const MODE_PREFS = ['Online', 'Offline', 'Hybrid'];
const TIME_PREFS = ['Mornings', 'Evenings', 'Weekends'];

export default function Profile() {
  const { user } = useAuth();
  const profile = useAsync(() => usersApi.profile(user!.id), [user?.id]);
  const extras = React.useMemo(() => getExtras(user!.id), [user?.id]);

  const [skillGroups, setSkillGroups] = React.useState<SkillGroup[]>([]);
  const [editingSkills, setEditingSkills] = React.useState(false);
  const [editingIdentity, setEditingIdentity] = React.useState(false);
  const [githubUrl, setGithubUrl] = React.useState(extras.githubUrl);
  const [weeklyHours, setWeeklyHours] = React.useState(extras.weeklyHours);
  const [selectedMode, setSelectedMode] = React.useState<string[]>([extras.mode]);
  const [selectedTimes, setSelectedTimes] = React.useState<string[]>(extras.times);

  // Skills come from the backend (a flat set). The Advanced/Intermediate/Learning grouping is
  // stored locally until the backend gains a skill-level field.
  React.useEffect(() => {
    const skills = profile.data?.skills ?? [];
    const levels: SkillLevel[] = ['Advanced', 'Intermediate', 'Learning'];
    setSkillGroups(levels.map(level => ({
      level,
      skills: skills.filter(sk => (extras.skillLevels[sk] ?? 'Intermediate') === level),
    })));
  }, [profile.data, extras]);

  // Persist the locally-stored fields.
  React.useEffect(() => {
    saveExtras(user!.id, { githubUrl, weeklyHours, times: selectedTimes, mode: selectedMode[0] ?? 'Hybrid' });
  }, [user, githubUrl, weeklyHours, selectedTimes, selectedMode]);

  const toggleList = (list: string[], item: string, setter: (items: string[]) => void) => {
    setter(list.includes(item) ? list.filter(value => value !== item) : [...list, item]);
  };

  const addSkill = (level: SkillLevel, skill: string) => {
    setSkillGroups(previous => previous.map(group => group.level === level && !group.skills.includes(skill)
      ? { ...group, skills: [...group.skills, skill] }
      : group
    ));
  };

  const removeSkill = (level: SkillLevel, skill: string) => {
    setSkillGroups(previous => previous.map(group => group.level === level
      ? { ...group, skills: group.skills.filter(item => item !== skill) }
      : group
    ));
  };

  const mySkills = profile.data?.skills ?? [];
  const portfolioProjects = [
    ...(profile.data?.pitchedProjects ?? []).map(p => ({ ...toProject(p, mySkills), role: 'Owner' as const })),
    ...(profile.data?.joinedProjects ?? []).map(p => ({ ...toProject(p, mySkills), role: 'Member' as const })),
  ];
  const semester = profile.data?.semester ?? user?.semester ?? '';
  const displayName = profile.data?.fullName ?? user?.fullName ?? '';
  const progress = Math.min(100, weeklyHours * 5);
  const circumference = 2 * Math.PI * 48;

  return (
    <div style={{ padding: 32, maxWidth: 940, margin: '0 auto' }}>
      <div style={{
        background: '#800020', borderRadius: 24, padding: '32px 36px',
        display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -60, top: -60, width: 280, height: 280,
          borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', pointerEvents: 'none',
        }} />
        <Avatar name={displayName} size={96} ring />
        <div style={{ flex: 1, position: 'relative' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#fff' }}>{displayName}</h1>
          <p style={{ margin: '0 0 12px', fontSize: 15, color: 'rgba(255,255,255,0.80)', fontWeight: 500 }}>
            {[fullDept(profile.data?.department ?? user?.department), extras.classLabel, semester].filter(Boolean).join(' · ')}
          </p>
          {editingIdentity ? (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CAPS.profileUpdate && <select
                value={semester}
                onChange={() => undefined}
                aria-label="Semester"
                style={{ height: 38, borderRadius: 8, border: '1px solid rgba(255,255,255,.4)', padding: '0 30px 0 12px', background: '#fff', color: '#1E293B', fontWeight: 600 }}
              >
                {SEMESTERS.map(item => <option key={item}>{item}</option>)}
              </select>}
              <input
                value={githubUrl}
                onChange={event => setGithubUrl(event.target.value)}
                aria-label="GitHub profile URL"
                style={{ height: 38, minWidth: 280, borderRadius: 8, border: '1px solid rgba(255,255,255,.4)', padding: '0 12px', color: '#1E293B' }}
              />
            </div>
          ) : (
            githubUrl ? <a href={githubUrl} target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 13, fontWeight: 600, display: 'inline-flex', gap: 7, alignItems: 'center', textDecoration: 'none' }}>
              <GithubIcon size={16} /> @{githubUrl.split('/').filter(Boolean).pop()} <ExternalLinkIcon size={13} />
            </a> : <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>No GitHub link yet — click the pencil to add one</span>
          )}
        </div>
        <button
          onClick={() => setEditingIdentity(!editingIdentity)}
          aria-label={editingIdentity ? 'Save profile details' : 'Edit profile details'}
          style={{
            width: 42, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,.28)',
            background: 'rgba(255,255,255,.14)', color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', position: 'relative',
          }}
        >
          {editingIdentity ? <CheckIcon size={18} /> : <PencilIcon size={18} />}
        </button>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Technical Skillsets</h2>
          {CAPS.profileUpdate && <button
            onClick={() => setEditingSkills(!editingSkills)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: editingSkills ? '#FBEFF2' : '#F1F5F9',
              border: `1px solid ${editingSkills ? '#F3D6DD' : '#E2E8F0'}`,
              color: editingSkills ? '#800020' : '#475569',
              borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {editingSkills ? <CheckIcon size={15} /> : <PencilIcon size={15} />}
            {editingSkills ? 'Done Editing' : 'Edit Skills'}
          </button>}
        </div>
        <div style={{ width: '100%', height: 1, background: '#E2E8F0', marginBottom: 20 }} />
        {skillGroups.map(({ level, skills }) => {
          const colors = LEVEL_COLORS[level];
          return (
            <div key={level} style={{ marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: colors.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{level}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map(skill => (
                  <span key={skill} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px',
                    borderRadius: 8, background: colors.bg, color: colors.text,
                    border: `1px solid ${colors.border}`, fontSize: 14, fontWeight: 600,
                  }}>
                    {skill}
                    {editingSkills && (
                      <button onClick={() => removeSkill(level, skill)} aria-label={`Remove ${skill}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text, padding: 0, lineHeight: 1, fontSize: 16 }}>×</button>
                    )}
                  </span>
                ))}
                {editingSkills && (
                  <button
                    onClick={() => {
                      const newSkill = prompt(`Add a skill to ${level}:`);
                      if (newSkill) addSkill(level, newSkill.trim());
                    }}
                    style={{
                      height: 32, padding: '0 12px', borderRadius: 8, background: 'transparent',
                      border: `1.5px dashed ${colors.border}`, color: colors.text, cursor: 'pointer',
                      fontSize: 13, fontWeight: 600,
                    }}
                  >
                    + Add skill
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 32, alignItems: 'start' }}>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Availability & Capacity</h2>
            <p style={{ margin: 0, color: '#64748B', fontSize: 14, lineHeight: 1.6 }}>Set the time you can reliably commit to active project work each week.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 128, height: 128, position: 'relative' }}>
              <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="64" cy="64" r="48" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <circle
                  cx="64" cy="64" r="48" fill="none" stroke="#800020" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  style={{ transition: 'stroke-dashoffset 240ms ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ color: '#800020', fontSize: 26, lineHeight: 1 }}>{weeklyHours}</strong>
                <span style={{ color: '#64748B', fontSize: 11, marginTop: 5 }}>hrs/week</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => setWeeklyHours(Math.max(1, weeklyHours - 1))} aria-label="Decrease weekly hours" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #CBD5E1', background: '#fff', color: '#475569', cursor: 'pointer', fontSize: 18 }}>−</button>
              <button onClick={() => setWeeklyHours(Math.min(20, weeklyHours + 1))} aria-label="Increase weekly hours" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #800020', background: '#FBEFF2', color: '#800020', cursor: 'pointer', fontSize: 18 }}>+</button>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: 1, background: '#E2E8F0', margin: '22px 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Working Time Preferences</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIME_PREFS.map(time => (
                <button key={time} onClick={() => toggleList(selectedTimes, time, setSelectedTimes)} style={{
                  height: 36, padding: '0 16px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  border: '1px solid', background: selectedTimes.includes(time) ? '#800020' : '#fff',
                  color: selectedTimes.includes(time) ? '#fff' : '#475569',
                  borderColor: selectedTimes.includes(time) ? '#800020' : '#CBD5E1',
                }}>{time}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1E293B' }}>Preferred Collaboration Mode</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {MODE_PREFS.map(mode => (
                <button key={mode} onClick={() => setSelectedMode([mode])} style={{
                  height: 36, padding: '0 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  border: '1px solid', background: selectedMode.includes(mode) ? '#FBEFF2' : '#fff',
                  color: selectedMode.includes(mode) ? '#800020' : '#475569',
                  borderColor: selectedMode.includes(mode) ? '#800020' : '#CBD5E1',
                }}>{mode}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Projects & Portfolio</h2>
        <div style={{ width: '100%', height: 1, background: '#E2E8F0', marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {portfolioProjects.map(project => {
            const repoUrl: string | undefined = undefined; // repo links aren't stored by the backend yet
            return (
              <div key={project.id} style={{
                border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 20px',
                background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1E293B' }} className="line-clamp-2">{project.title}</h3>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6,
                    background: project.status === 'completed' ? '#F0FDF4' : '#FBEFF2',
                    color: project.status === 'completed' ? '#16A34A' : '#800020',
                    border: `1px solid ${project.status === 'completed' ? '#A7F3D0' : '#F3D6DD'}`,
                    flexShrink: 0,
                  }}>{project.status === 'completed' ? 'Completed' : project.role === 'Member' ? 'Joined' : 'Active pitch'}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#64748B', lineHeight: 1.6 }} className="line-clamp-2">{project.summary}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {project.skills.slice(0, 3).map(skill => <SkillBadge key={skill} label={skill} />)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <ModeBadge mode={project.mode} />
                  {repoUrl ? (
                    <a href={repoUrl} target="_blank" rel="noreferrer" style={{ color: '#800020', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <GithubIcon size={15} /> Repository <ExternalLinkIcon size={13} />
                    </a>
                  ) : (
                    <span style={{ color: '#94A3B8', fontSize: 12 }}>Repository not linked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
