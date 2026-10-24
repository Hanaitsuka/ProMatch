import { Project } from '../data/mockData';
import {
  DomainTag, ModeBadge, SkillBadge, ExperienceBadge,
  HoursBadge, ProgressBar, ReciprocalBadge, Avatar, Button
} from './ui';

interface ProjectCardProps {
  project: Project;
  onJoin?: () => void;
  onBarter?: () => void;
  showMatch?: boolean;
}

export function ProjectCard({ project, onJoin, onBarter, showMatch = true }: ProjectCardProps) {
  const {
    title, summary, domain, mode, skills, matchedSkills = [],
    weeklyHours, experience, teamSize, teamFilled,
    creatorName, matchScore, isReciprocal,
  } = project;

  const otherSkills = skills.filter(s => !matchedSkills.includes(s));

  return (
    <div
      className="card-hover"
      style={{
        background: '#fff', borderRadius: 16, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 14,
        boxShadow: '0 1px 3px rgba(15,23,42,.08)',
        border: '1px solid #E2E8F0', height: '100%',
      }}
    >
      {/* Row 1: Domain + Mode + compatibility */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          {domain ? <DomainTag label={domain} /> : <span />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModeBadge mode={mode} />
            {showMatch && matchScore !== undefined && (
              <span style={{ fontSize: 12, color: '#800020', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {matchScore}% match
              </span>
            )}
          </div>
        </div>
        {isReciprocal && (
          <div style={{ marginTop: 8 }}>
            <ReciprocalBadge />
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="line-clamp-2" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>
        {title}
      </h3>

      {/* Summary */}
      <p className="line-clamp-2" style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
        {summary}
      </p>

      {/* Creator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={creatorName} size={24} />
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{creatorName}</span>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {matchedSkills.map(s => <SkillBadge key={s} label={s} matched />)}
        {otherSkills.map(s => <SkillBadge key={s} label={s} />)}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {weeklyHours > 0 && <HoursBadge hours={weeklyHours} />}
        {experience && <ExperienceBadge level={experience} />}
      </div>

      {/* Progress */}
      <ProgressBar
        filled={teamFilled}
        total={teamSize}
        label="Team Progress"
      />

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, marginTop: 'auto',
      }}>
        <Button
          variant="primary"
          size="sm"
          onClick={isReciprocal ? onBarter : onJoin}
          style={{ flex: 1 }}
        >
          Send Request
        </Button>
      </div>
    </div>
  );
}
