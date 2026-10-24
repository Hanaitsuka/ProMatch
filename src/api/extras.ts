// Profile fields the backend does not store yet (GitHub link, class, weekly hours, preferences,
// skill levels). Kept per-user in localStorage so the UI still works; move to the API once the
// backend's User entity gains these columns.
export interface ProfileExtras {
  githubUrl: string;
  classLabel: string;
  weeklyHours: number;
  times: string[];
  mode: string;
  skillLevels: Record<string, 'Advanced' | 'Intermediate' | 'Learning'>;
}
const DEFAULTS: ProfileExtras = { githubUrl: '', classLabel: 'B.Tech', weeklyHours: 10, times: [], mode: 'Hybrid', skillLevels: {} };
const key = (id: number) => `promatch-extras:${id}`;

export function getExtras(id: number): ProfileExtras {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(key(id)) ?? '{}') }; }
  catch { return DEFAULTS; }
}
export function saveExtras(id: number, patch: Partial<ProfileExtras>) {
  localStorage.setItem(key(id), JSON.stringify({ ...getExtras(id), ...patch }));
}
