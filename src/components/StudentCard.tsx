import { Student } from '../data/mockData';
import { Avatar, SkillBadge, HoursBadge, ExperienceBadge, Button, ModeBadge } from './ui';
import { GithubIcon } from './Icons';

interface StudentCardProps {
  student: Student;
  onInvite?: () => void;
}

export function StudentCard({ student, onInvite }: StudentCardProps) {
  const { name, dept, classLabel, sem, skills, weeklyHours, githubUrl, experience, mode, matchScore } = student;
  const displaySkills = skills.slice(0, 5);
  const overflow = skills.length - 5;

  return (
    <div
      className="card-hover"
      style={{
        background: '#fff', borderRadius: 16, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 1px 3px rgba(15,23,42,.08)',
        border: '1px solid #E2E8F0', alignItems: 'center', textAlign: 'center',
      }}
    >
      <Avatar name={name} size={64} />

      <div>
        <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{name}</h3>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B', fontWeight: 500 }}>
          {[dept, [classLabel, sem].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* GitHub link */}
      {githubUrl && <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${name}'s GitHub`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: '#800020', fontWeight: 600, textDecoration: 'none',
          padding: '4px 10px', borderRadius: 6,
          border: '1px solid #F3D6DD', background: '#FBEFF2',
          transition: 'background 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F3D6DD')}
        onMouseLeave={e => (e.currentTarget.style.background = '#FBEFF2')}
      >
        <GithubIcon size={15} /> GitHub Profile
      </a>}

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {displaySkills.map(s => <SkillBadge key={s} label={s} />)}
        {overflow > 0 && (
          <span style={{
            height: 28, padding: '0 10px', borderRadius: 6, display: 'inline-flex',
            alignItems: 'center', fontSize: 13, fontWeight: 600,
            background: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1',
          }}>
            +{overflow}
          </span>
        )}
      </div>

      {/* Availability + Experience */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {weeklyHours > 0 && <HoursBadge hours={weeklyHours} />}
        {experience && <ExperienceBadge level={experience} />}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        {mode && <ModeBadge mode={mode} />}
        <span style={{ fontSize: 12, color: '#800020', fontWeight: 700 }}>{matchScore}% match</span>
      </div>

      <Button variant="primary" size="sm" onClick={onInvite} style={{ width: '100%' }}>
        Send Invite
      </Button>
    </div>
  );
}
