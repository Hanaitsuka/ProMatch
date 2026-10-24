import React from 'react';
import { Link } from 'react-router-dom';
import { TopHeader } from '../components/TopHeader';
import { ProjectCard } from '../components/ProjectCard';
import { Button, Accordion, GECCrest, DomainTag, ModeBadge, SkillBadge, ExperienceBadge } from '../components/ui';
import { Modal } from '../components/Modal';
import { useAsync } from '../api/useAsync';
import { projectsApi } from '../api/endpoints';
import { toProject } from '../api/adapters';
import { CheckIcon, ClipboardIcon, GraduationCapIcon, LockIcon, PuzzleIcon } from '../components/Icons';

const FAQ_ITEMS = [
  {
    question: 'Who can join ProMatch?',
    answer: 'Any currently enrolled student at Government Engineering College, Thrissur. Your university email and enrolment are verified during registration.',
  },
  {
    question: 'Is my College Registration ID visible to other students?',
    answer: 'No. Your Reg ID is collected only once during registration for backend verification. It is never displayed on your profile, project cards, or any public interface.',
  },
  {
    question: 'How does reciprocal skill trade work?',
    answer: 'When two students each have a skill the other needs, ProMatch highlights this as a "Reciprocal Trade" inline on the project card. You can send a request, and if both parties agree, the collaboration begins with shared workspace access.',
  },
  {
    question: 'Who can see my project details?',
    answer: 'Only a high-level summary is shown publicly on Explore cards. Full project details, source code, roadmaps, and files live exclusively in your private team workspace.',
  },
  {
    question: 'How is the compatibility score calculated?',
    answer: 'Match scores are generated silently in the background based on your declared skills, experience level, and availability versus the project\'s requirements. The score appears only as a small footnote on Explore cards — it is not shown on the dashboard or in notifications.',
  },
  {
    question: 'Can I use ProMatch for hackathon teams?',
    answer: 'Absolutely. ProMatch is designed for both ongoing academic projects and hackathon team formation. Use the "Online" or "Hybrid" collaboration mode and set a realistic weekly hours commitment to attract the right teammates.',
  },
];

export default function Landing() {
  // Live pitches from the backend; the section simply hides if the server is unreachable or empty.
  const live = useAsync(() => projectsApi.list(), []);
  const previewProjects = (live.data ?? []).slice(0, 3).map(p => toProject(p));
  const [infoModal, setInfoModal] = React.useState<'Guidelines' | 'Privacy Policy' | null>(null);
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      <TopHeader variant="public" />

      {/* ─── HERO ─── */}
      <section className="hero-animated-gradient" style={{
        padding: '96px 80px 120px',
        borderRadius: '0 0 24px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Four-corner rotating ripple field */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
          <div key={corner} className={`hero-ripple hero-ripple-${corner}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ))}

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
              background: 'rgba(255,255,255,0.15)', borderRadius: 999, padding: '6px 16px',
              fontSize: 13, fontWeight: 600, color: '#fff',
            }}>
              <GraduationCapIcon size={16} /> Exclusively for GEC Thrissur Students
            </div>
            <h1 style={{
              margin: '0 0 20px', fontSize: 52, fontWeight: 800, color: '#fff',
              lineHeight: 1.12, maxWidth: 820, letterSpacing: '-0.5px',
            }}>
              Build Your Dream Academic &amp; Hackathon Team at GEC Thrissur
            </h1>
            <p style={{ margin: '0 0 36px', fontSize: 20, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 600 }}>
              ProMatch connects GEC students with the right project partners — matched by skills, availability, and collaboration style.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <Link to="/auth?tab=explore" style={{ textDecoration: 'none' }}>
                <Button variant="on-brand" size="lg">Explore Pitches</Button>
              </Link>
              <Link to="/auth?tab=register" style={{ textDecoration: 'none' }}>
                <Button size="lg" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
                  Find Teammates
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating feature pills */}
          <div style={{ position: 'relative', height: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
            {[
              { text: 'Skill Compatibility Matching', cls: 'float-a' },
              { text: 'Private Workspace & IP Protection', cls: 'float-b' },
              { text: 'Reciprocal Skill Trade', cls: 'float-c' },
            ].map(pill => (
              <div key={pill.text} className={pill.cls} style={{
                background: 'rgba(255,255,255,0.92)', borderRadius: 999,
                padding: '12px 22px', fontSize: 15, fontWeight: 700, color: '#1E293B',
                boxShadow: '0 8px 24px rgba(15,23,42,.20)',
                alignSelf: 'flex-start', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 9,
              }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FBEFF2', color: '#800020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckIcon size={14} />
                </span>
                {pill.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE PROJECTS PREVIEW ─── */}
      {previewProjects.length > 0 && <section style={{ padding: '80px 80px', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 700, color: '#1E293B' }}>Live Projects</h2>
            <p style={{ margin: 0, color: '#64748B', fontSize: 16 }}>Active pitches looking for teammates right now</p>
          </div>
          <Link to="/auth" style={{
            fontSize: 14, fontWeight: 600, color: '#800020', textDecoration: 'none',
          }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {previewProjects.map(project => (
            <div key={project.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                background: '#fff', borderRadius: 16, padding: 24,
                boxShadow: '0 1px 3px rgba(15,23,42,.08)', border: '1px solid #E2E8F0',
                display: 'flex', flexDirection: 'column', gap: 14, height: '100%',
              }} className="card-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <DomainTag label={project.domain} />
                  <ModeBadge mode={project.mode} />
                </div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }} className="line-clamp-2">
                  {project.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }} className="line-clamp-2">
                  {project.summary}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {project.skills.slice(0, 3).map(s => <SkillBadge key={s} label={s} />)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {project.experience && <ExperienceBadge level={project.experience} />}
                </div>
                <Link to="/auth" style={{ textDecoration: 'none', marginTop: 'auto' }}>
                  <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                    Sign in to join
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>}

      {/* ─── HOW IT WORKS ─── */}
      <section id="about" style={{ padding: '0 80px 80px', maxWidth: 1440, margin: '0 auto', scrollMarginTop: 90 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1E293B', textAlign: 'center', marginBottom: 48 }}>
          How ProMatch Works
        </h2>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            {
              n: '1',
              title: 'Register & Pitch',
              desc: 'Create your GEC-verified profile with your skills, availability, and experience. Pitch your project idea or browse existing ones.',
              icon: ClipboardIcon,
            },
            {
              n: '2',
              title: 'Smart Skill Match',
              desc: 'Our algorithm quietly ranks pitches and teammates by compatibility. Matched skills are highlighted; your score appears only as a discreet footnote.',
              icon: PuzzleIcon,
            },
            {
              n: '3',
              title: 'Private Workspace Collaboration',
              desc: 'Once your team forms, all collaboration happens in a secure workspace. IP stays protected — only high-level summaries are ever public.',
              icon: LockIcon,
            },
          ].map((step, idx) => (
            <div key={step.n}>
              <div style={{
                background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16,
                padding: '28px 32px', display: 'flex', alignItems: 'flex-start', gap: 24,
                boxShadow: '0 1px 3px rgba(15,23,42,.06)',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#800020',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>{step.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ width: 34, height: 34, borderRadius: 8, background: '#FBEFF2', color: '#800020', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <step.icon size={19} />
                    </span>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1E293B' }}>{step.title}</h3>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: 15, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
              {idx < 2 && (
                <div style={{ height: 32, borderLeft: '2px dashed #CBD5E1', marginLeft: 52 }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={{ background: '#fff', padding: '72px 80px', borderTop: '1px solid #E2E8F0', scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#1E293B', marginBottom: 40 }}>
            Campus Community FAQ
          </h2>
          <Accordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#1E293B', padding: '48px 80px', color: '#94A3B8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <GECCrest size={40} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>ProMatch</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Government Engineering College, Thrissur</div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, maxWidth: 400 }}>
              An academic project-partner and skill-matching platform built for GEC Thrissur students, by GEC Thrissur students.
            </p>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['About', 'FAQ', 'Guidelines', 'Privacy Policy'] as const).map(link => (
              <button key={link} type="button"
                onClick={() => link === 'About' ? goTo('about') : link === 'FAQ' ? goTo('faq') : setInfoModal(link)}
                style={{ fontSize: 14, color: '#94A3B8', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', transition: 'color 150ms', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >{link}</button>
            ))}
          </nav>
        </div>
        <div style={{ maxWidth: 1280, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid #334155', fontSize: 13 }}>
          © 2025 ProMatch · Government Engineering College, Thrissur. All rights reserved.
        </div>
      </footer>
      <Modal open={infoModal !== null} onClose={() => setInfoModal(null)} title={infoModal ?? ''}>
        {infoModal === 'Guidelines' ? (
          <ul style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 15, lineHeight: 1.8 }}>
            <li>ProMatch is for currently enrolled GEC Thrissur students.</li>
            <li>Be honest about your skills and the weekly hours you can commit.</li>
            <li>Keep public pitch summaries high-level — detailed IP stays in your private team workspace.</li>
            <li>Respond to requests and invitations promptly, and be respectful in every conversation.</li>
          </ul>
        ) : (
          <div style={{ color: '#475569', fontSize: 15, lineHeight: 1.8 }}>
            <p style={{ marginTop: 0 }}>Your College Registration ID is used once for verification and is never shown on your profile, project cards or any public page.</p>
            <p>Only high-level project summaries are public. Source code, roadmaps and files live in your private team workspace.</p>
            <p style={{ marginBottom: 0 }}>Compatibility scores are calculated in the background from your declared skills and availability.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
