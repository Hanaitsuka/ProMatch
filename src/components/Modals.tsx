import React from 'react';
import { Modal } from './Modal';
import { Button, Input, Textarea, Select, RadioGroup, TagInput, Stepper, Checkbox, SkillBadge, Avatar } from './ui';
import { DOMAINS, EXPERIENCE_LEVELS } from '../data/mockData';
import type { Project } from '../data/mockData';
import { projectsApi, invitationsApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../api/useAsync';
import { dashboardApi } from '../api/endpoints';
import { CAPS } from '../api/capabilities';

// ─── Modal A: Pitch a Project ─────────────────────────────────────────────────
interface PitchModalProps { open: boolean; onClose: () => void; onCreated?: () => void; }

export function PitchModal({ open, onClose, onCreated }: PitchModalProps) {
  const { user } = useAuth();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [skills, setSkills] = React.useState<string[]>([]);
  const [mode, setMode] = React.useState('');
  const [teamSize, setTeamSize] = React.useState(4);
  const [hours, setHours] = React.useState(6);
  const [exp, setExp] = React.useState('');
  const [repoUrl, setRepoUrl] = React.useState('');

  const allSkills = ['React', 'TypeScript', 'Python', 'Node.js', 'TensorFlow', 'Figma', 'Embedded C',
    'OpenCV', 'MongoDB', 'SQL', 'Flask', 'Docker', 'AWS', 'MATLAB', 'VHDL'];

  const reset = () => { setTitle(''); setSummary(''); setDomain(''); setSkills([]); setMode(''); setTeamSize(4); setHours(6); setExp(''); setRepoUrl(''); setError(''); };

  const publishPitch = async () => {
    setError('');
    if (!title.trim() || !summary.trim() || !mode) { setError('Please add a title, a short summary and a collaboration mode.'); return; }
    if (skills.length === 0) { setError('Add at least one required skill.'); return; }
    if (!user) return;
    setBusy(true);
    try {
      await projectsApi.create({
        title: title.trim(), description: summary.trim(), mode,
        requiredTechStack: skills, maxMembers: teamSize, ownerId: user.id,
      });
      reset();
      onCreated?.();
      onClose();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not publish pitch'); }
    finally { setBusy(false); }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pitch a Project"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={publishPitch} disabled={busy}>{busy ? 'Publishing…' : 'Publish Pitch'}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {error && <div style={{ fontSize: 13, color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px' }}>{error}</div>}
        <Input
          label="Project Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g., Smart Campus IoT Monitoring System"
        />
        <Textarea
          label="Short Public Summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="High-level overview only — detailed implementation stays in your private workspace."
          maxChars={280}
          currentLength={summary.length}
          helper="High-level only. Detailed IP stays in the private workspace."
          style={{ minHeight: 88 }}
        />
        {CAPS.pitchExtraFields && <Select
          label="Domain"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          options={[
            { value: '', label: 'Select domain…' },
            ...DOMAINS.map(d => ({ value: d, label: d })),
          ]}
        />}
        {CAPS.pitchExtraFields && <Input
          label="GitHub Repository URL"
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/project"
          helper="Optional — shown as a clickable portfolio link."
        />}
        <div style={{ position: 'relative' }}>
          <TagInput
            label="Required Skills"
            tags={skills}
            onChange={setSkills}
            suggestions={allSkills}
            placeholder="Type and press Enter to add skills…"
          />
        </div>
        <RadioGroup
          label="Collaboration Mode"
          value={mode}
          onChange={setMode}
          options={[
            ...(CAPS.offlineMode ? [{ value: 'Offline', label: 'Offline / On-Campus' }] : []),
            { value: 'Online', label: 'Online / Remote' },
            { value: 'Hybrid', label: 'Hybrid' },
          ]}
        />
        <div style={{ display: 'grid', gridTemplateColumns: CAPS.pitchExtraFields ? '1fr 1fr 1fr' : '1fr', gap: 16 }}>
          <Stepper label="Team Size" value={teamSize} min={2} max={10} onChange={setTeamSize} />
          {CAPS.pitchExtraFields && <Stepper label="Hrs / Week" value={hours} min={1} max={30} onChange={setHours} />}
          {CAPS.pitchExtraFields && <Select
            label="Experience Level"
            value={exp}
            onChange={e => setExp(e.target.value)}
            options={[
              { value: '', label: 'Select…' },
              ...EXPERIENCE_LEVELS.map(l => ({ value: l, label: l })),
            ]}
          />}
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal B: Request to Join / Reciprocal Request ────────────────────────────
interface JoinModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  mode?: 'join' | 'barter';
}

export function JoinModal({ open, onClose, project, mode = 'join' }: JoinModalProps) {
  const [message, setMessage] = React.useState('');
  const [committed, setCommitted] = React.useState(false);

  const mySkills = ['React', 'UI Design', 'TypeScript', 'Figma'];
  const tradeSkills = project?.matchedSkills ?? [];
  const theyNeed = (project?.skills ?? []).filter(s => mySkills.includes(s));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send Request"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!committed} onClick={onClose}>
            Send Request
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Creator strip */}
        {project && (
          <div style={{
            background: '#F8FAFC', borderRadius: 12, padding: '14px 16px',
            border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={project.creatorName} size={36} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{project.creatorName}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{project.creatorDept} · {project.creatorSem}</div>
              </div>
            </div>
            {mode === 'barter' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>You offer:</span>
                {mySkills.slice(0, 3).map(s => <SkillBadge key={s} label={s} matched />)}
                <span style={{ fontSize: 16, color: '#800020' }}>⇄</span>
                <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>They need:</span>
                {(theyNeed.length > 0 ? theyNeed : ['Frontend']).map(s => <SkillBadge key={s} label={s} />)}
              </div>
            )}
          </div>
        )}

        <Textarea
          label="Introductory Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Introduce yourself and explain why you'd be a great fit for this project…"
          style={{ minHeight: 120 }}
        />

        <Checkbox
          checked={committed}
          onChange={setCommitted}
          label={
            <span>
              I confirm I can commit{' '}
              <strong>{project?.weeklyHours ?? 0} hrs/week</strong> to this project
            </span>
          }
        />
      </div>
    </Modal>
  );
}

// ─── Modal C: Send Invite ──────────────────────────────────────────────────────
interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  targetName?: string;
  targetId?: number;
}
export function InviteModal({ open, onClose, targetName, targetId }: InviteModalProps) {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);

  // Only projects you own can be used to invite people.
  const dash = useAsync(() => (open && user ? dashboardApi.get(user.id) : Promise.resolve(null)), [open, user?.id]);
  const owned = (dash.data?.activeProjects ?? []).filter(p => p.ownerName === dash.data?.profile.fullName);

  React.useEffect(() => { if (open) { setError(''); setSent(false); setSelectedProject(''); } }, [open]);

  const send = async () => {
    setError('');
    if (!user || !targetId) return;
    if (!selectedProject) { setError('Choose one of your pitches first.'); return; }
    setBusy(true);
    try {
      await invitationsApi.send({ senderId: user.id, receiverId: targetId, projectId: Number(selectedProject) });
      setSent(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not send invite'); }
    finally { setBusy(false); }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send Invite"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{sent ? 'Close' : 'Cancel'}</Button>
          {!sent && <Button variant="primary" onClick={send} disabled={busy || owned.length === 0}>{busy ? 'Sending…' : 'Send Invite'}</Button>}
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {targetName && (
          <div style={{
            background: '#FBEFF2', borderRadius: 10, padding: '12px 16px',
            border: '1px solid #F3D6DD', fontSize: 14, color: '#800020', fontWeight: 600,
          }}>
            Inviting: {targetName}
          </div>
        )}
        {sent && <div style={{ fontSize: 14, color: '#15803D', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 14px' }}>Invitation sent to {targetName}.</div>}
        {error && <div style={{ fontSize: 13, color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px' }}>{error}</div>}
        {!dash.loading && owned.length === 0 && !sent && (
          <div style={{ fontSize: 14, color: '#475569' }}>You haven’t pitched a project yet. Pitch one first, then you can invite teammates to it.</div>
        )}
        <Select
          label="Select Active Project"
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          options={[
            { value: '', label: dash.loading ? 'Loading your pitches…' : 'Choose one of your pitches…' },
            ...owned.map(p => ({ value: String(p.id), label: p.title })),
          ]}
        />
      </div>
    </Modal>
  );
}
