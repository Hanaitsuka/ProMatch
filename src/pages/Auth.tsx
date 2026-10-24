import React from 'react';
import { GithubIcon, LockIcon } from '../components/Icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GECCrestOnDark } from '../components/ui';
import { Button, Input, Select, PillTabs, TagInput } from '../components/ui';
import { authApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { initialsOf } from '../api/adapters';
import { saveExtras } from '../api/extras';
import { DEPTS, SEMESTERS } from '../data/mockData';

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialTab = params.get('tab') === 'register' ? 'New Student Registration' : 'Sign In';
  const [tab, setTab] = React.useState(initialTab);

  // Sign-in state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  // Registration state
  const [name, setName] = React.useState('');
  const [regId, setRegId] = React.useState('');
  const [dept, setDept] = React.useState('');
  const [classLabel, setClassLabel] = React.useState('');
  const [sem, setSem] = React.useState('');
  const [github, setGithub] = React.useState('');
  const [regEmail, setRegEmail] = React.useState('');
  const [regPassword, setRegPassword] = React.useState('');

  const [skills, setSkills] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    setError('');
    if (!email.trim()) { setError('Enter your university email.'); return; }
    setBusy(true);
    try {
      const res = await authApi.login(email.trim());
      signIn({ token: res.token, profile: { ...res.profile, skills: res.profile.skills ?? [] } });
      navigate('/dashboard');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not sign in'); }
    finally { setBusy(false); }
  };

  const handleRegister = async () => {
    setError('');
    if (!name.trim() || !regEmail.trim()) { setError('Full name and university email are required.'); return; }
    if (!dept || !sem) { setError('Please choose your department and semester.'); return; }
    setBusy(true);
    try {
      const res = await authApi.register({
        email: regEmail.trim(), fullName: name.trim(), department: dept, semester: sem,
        skills, avatarInitials: initialsOf(name),
      });
      // GitHub link & class aren't stored by the backend yet — keep them locally.
      saveExtras(res.profile.id, { githubUrl: github.trim(), classLabel });
      signIn({ token: res.token, profile: { ...res.profile, skills: res.profile.skills ?? [] } });
      navigate('/dashboard');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create account'); }
    finally { setBusy(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#800020',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Subtle decorative bg marks */}
      <div style={{
        position: 'fixed', top: '10%', left: '5%', width: 200, height: 200,
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '15%', right: '8%', width: 300, height: 300,
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none',
      }} />

      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 40px',
        width: '100%', maxWidth: 480,
        boxShadow: '0 24px 64px rgba(0,0,0,.3)',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {/* Crest + title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <GECCrestOnDark size={56} />
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#1E293B' }}>
              ProMatch
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>GEC Thrissur Portal</p>
          </div>
        </div>

        <PillTabs
          tabs={['Sign In', 'New Student Registration']}
          active={tab}
          onChange={setTab}
        />

        {tab === 'Sign In' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="University Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="yourname@gecthrissur.ac.in"
            />
            <div>
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
              />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{
                  background: 'none', border: 'none', fontSize: 13,
                  color: '#800020', cursor: 'pointer', marginTop: 6, padding: 0, fontWeight: 500,
                }}
              >
                {showPw ? 'Hide' : 'Show'} password
              </button>
            </div>
            <button style={{
              background: 'none', border: 'none', fontSize: 13, color: '#800020',
              cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: 500,
            }}>
              Forgot password?
            </button>
            {error && <div style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px' }}>{error}</div>}
            <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={handleSignIn} disabled={busy}>
              {busy ? 'Signing in…' : 'Sign In'}
            </Button>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B', textAlign: 'center' }}>
              New student?{' '}
              <button
                onClick={() => setTab('New Student Registration')}
                style={{ background: 'none', border: 'none', color: '#800020', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                Register here
              </button>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
            <Input
              label="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="As on your college ID"
            />
            <Input
              label="College Registration ID"
              value={regId}
              onChange={e => setRegId(e.target.value)}
              placeholder="e.g., TCR22CS013"
              prefix={<LockIcon size={15} />}
              helper="Used only for one-time verification. Never shown publicly. Hidden after account creation."
            />
            <Select
              label="Department"
              value={dept}
              onChange={e => setDept(e.target.value)}
              options={[
                { value: '', label: 'Select department…' },
                { value: 'CSE', label: 'Computer Science & Engineering' },
                { value: 'ECE', label: 'Electronics & Communication Engineering' },
                { value: 'EEE', label: 'Electrical & Electronics Engineering' },
                { value: 'ME', label: 'Mechanical Engineering' },
                { value: 'CE', label: 'Civil Engineering' },
              ]}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Select
                label="Class"
                value={classLabel}
                onChange={e => setClassLabel(e.target.value)}
                options={[
                  { value: '', label: 'Select…' },
                  { value: 'B.Tech', label: 'B.Tech' },
                  { value: 'M.Tech', label: 'M.Tech' },
                  { value: 'MCA', label: 'MCA' },
                ]}
              />
              <Select
                label="Semester"
                value={sem}
                onChange={e => setSem(e.target.value)}
                options={[
                  { value: '', label: 'Select…' },
                  ...SEMESTERS.map(s => ({ value: s, label: s })),
                ]}
              />
            </div>
            <Input
              label="GitHub Profile URL"
              value={github}
              onChange={e => setGithub(e.target.value)}
              placeholder="https://github.com/yourusername"
              prefix={<GithubIcon size={15} />}
            />
            <Input
              label="University Email"
              type="email"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
              placeholder="yourname@gecthrissur.ac.in"
            />
            <TagInput
              label="Your skills"
              tags={skills}
              onChange={setSkills}
              placeholder="Type a skill and press Enter (e.g. React, Python)"
              suggestions={['React', 'TypeScript', 'Python', 'Node.js', 'Java', 'Figma', 'Docker', 'SQL', 'Machine Learning']}
            />
            <Input
              label="Password"
              type="password"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              placeholder="Minimum 8 characters"
            />
            <div style={{
              background: '#FBEFF2', borderRadius: 8, padding: '10px 14px',
              fontSize: 12, color: '#800020', fontWeight: 500, border: '1px solid #F3D6DD',
            }}>
              Reg ID is permanently hidden after verification and never shared with other users.
            </div>
            {error && <div style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px' }}>{error}</div>}
            <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={handleRegister} disabled={busy}>
              {busy ? 'Creating account…' : 'Create Account'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
