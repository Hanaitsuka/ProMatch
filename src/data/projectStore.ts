import type { Project } from './mockData';

export type PitchedProject = Project & { role: 'Owner'; repoUrl?: string };

const STORAGE_KEY = 'promatch-pitched-projects';

export function getPitchedProjects(): PitchedProject[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as PitchedProject[];
  } catch {
    return [];
  }
}

export function savePitchedProject(project: PitchedProject) {
  const projects = [project, ...getPitchedProjects()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new CustomEvent('promatch:projects-updated'));
}
