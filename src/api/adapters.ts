// Backend DTOs + adapters that turn them into the shapes the UI already renders.
import { DEPT_FULL } from '../data/mockData';
import type { Project, Student } from '../data/mockData';

// ── Backend shapes ───────────────────────────────────────────────────────────
export interface ApiProject {
  id: number;
  title: string;
  description?: string | null;
  mode?: string | null;
  requiredTechStack?: string[] | null;
  ownerName?: string;                                   // DTO form
  owner?: { id: number; fullName: string; department?: string; semester?: string }; // entity form
  currentMembersCount?: number | null;
  maxMembers?: number | null;
  status?: string | null;
}
export interface ApiUser {
  id: number; fullName: string; department?: string | null; semester?: string | null;
  avatarInitials?: string | null; skills?: string[] | null;
}
export interface ApiTeammateMatch extends ApiUser {
  commonSkills: string[]; complementarySkills: string[]; matchScore: number;
}
export interface ApiDashboard {
  profile: ApiUser;
  activeProjects: ApiProject[];
  recommendedPitches: { project: ApiProject; matchingSkills: string[]; skillOverlap: number }[];
  topTeammateMatches: ApiTeammateMatch[];
}
export interface ApiUserProfile extends ApiUser {
  pitchedProjects: ApiProject[];
  joinedProjects: ApiProject[];
}
export interface ApiNotification { id: number; message: string; timestamp: string; readStatus: boolean; }
export interface ApiMessage {
  id: number; content: string; timestamp: string;
  sender: { id: number; fullName: string }; receiver: { id: number; fullName: string };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const lc = (s: string) => s.trim().toLowerCase();
const overlap = (a: string[], b: string[]) => { const set = new Set(b.map(lc)); return a.filter(x => set.has(lc(x))); };

export function shortDept(department?: string | null): string {
  if (!department) return '';
  const hit = Object.entries(DEPT_FULL).find(([, full]) => lc(full) === lc(department));
  return hit ? hit[0] : department;
}
export function fullDept(department?: string | null): string {
  if (!department) return '';
  return DEPT_FULL[department] ?? department;
}
export function initialsOf(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');
}

const asMode = (m?: string | null): Project['mode'] =>
  m === 'Online' || m === 'Offline' || m === 'Hybrid' ? m : 'Hybrid';

// ── Adapters ─────────────────────────────────────────────────────────────────
export function toProject(p: ApiProject, mySkills: string[] = []): Project & { ownerName: string; numericId: number } {
  const skills = p.requiredTechStack ?? [];
  const matched = overlap(skills, mySkills);
  const ownerName = p.ownerName ?? p.owner?.fullName ?? 'Unknown';
  return {
    id: String(p.id),
    numericId: p.id,
    title: p.title,
    summary: p.description ?? '',
    domain: '',                       // not stored by backend
    skills,
    matchedSkills: matched,
    mode: asMode(p.mode),
    experience: undefined,            // not stored by backend
    weeklyHours: 0,                   // not stored by backend
    teamSize: p.maxMembers ?? 0,
    teamFilled: p.currentMembersCount ?? 0,
    creatorName: ownerName,
    ownerName,
    creatorDept: shortDept(p.owner?.department),
    creatorSem: p.owner?.semester ?? '',
    // Client-side compatibility: share of the project's required stack that you already cover.
    matchScore: skills.length ? Math.round((matched.length / skills.length) * 100) : 0,
    isReciprocal: false,
    status: (p.status ?? 'OPEN').toUpperCase() === 'OPEN' ? 'active' : 'completed',
  };
}

export function toStudent(u: ApiUser, mySkills: string[] = [], serverScore?: number): Student & { numericId: number } {
  const skills = u.skills ?? [];
  const common = overlap(skills, mySkills).length;
  return {
    id: String(u.id),
    numericId: u.id,
    name: u.fullName,
    dept: shortDept(u.department),
    classLabel: '',                  // not stored by backend
    sem: u.semester ?? '',
    skills,
    weeklyHours: 0,                  // not stored by backend
    githubUrl: '',                   // not stored by backend
    experience: undefined,
    mode: undefined,
    matchScore: serverScore ?? (skills.length ? Math.round((common / skills.length) * 100) : 0),
  };
}

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}
