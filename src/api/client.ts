// Thin fetch wrapper for the ProMatch Spring Boot backend.
// Base URL comes from VITE_API_URL (see .env.example); defaults to the Render deployment.
export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'https://promatch-backend-1.onrender.com';

const SESSION_KEY = 'promatch-session';

export interface SessionProfile {
  id: number;
  fullName: string;
  department: string;
  semester: string;
  avatarInitials: string;
  skills: string[];
}
export interface Session { token: string; profile: SessionProfile; }

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch { return null; }
}
export function saveSession(s: Session) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
export function clearSession() { localStorage.removeItem(SESSION_KEY); }

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getSession()?.token;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    // Render's free tier sleeps; the first request can take ~30-60s or fail while it wakes up.
    throw new ApiError(0, 'Cannot reach the server. It may be waking up — please try again in a few seconds.');
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch { /* non-JSON error body */ }
    throw new ApiError(res.status, message);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }),
};
