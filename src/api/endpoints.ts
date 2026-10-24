import { http } from './client';
import type { Session } from './client';
import type {
  ApiDashboard, ApiMessage, ApiNotification, ApiProject, ApiUser, ApiUserProfile,
} from './adapters';

interface AuthResponse { token: string; profile: Session['profile'] & { skills: string[] } }

export const authApi = {
  // NOTE: backend currently identifies users by email (or name) only — there is no password check yet.
  login: (email: string) => http.post<AuthResponse>('/api/auth/login', { email }),
  register: (body: { email: string; fullName: string; department: string; semester: string; skills: string[]; avatarInitials: string }) =>
    http.post<AuthResponse>('/api/auth/register', body),
};

export const dashboardApi = { get: (userId: number) => http.get<ApiDashboard>(`/api/dashboard/${userId}`) };

export const projectsApi = {
  list: () => http.get<ApiProject[]>('/api/projects'),
  create: (body: { title: string; description: string; mode: string; requiredTechStack: string[]; maxMembers: number; ownerId: number }) =>
    http.post<ApiProject>('/api/projects', body),
};

export const usersApi = {
  list: (skill?: string) => http.get<ApiUser[]>(`/api/users${skill ? `?skill=${encodeURIComponent(skill)}` : ''}`),
  profile: (userId: number) => http.get<ApiUserProfile>(`/api/users/${userId}`),
};

export const invitationsApi = {
  send: (body: { senderId: number; receiverId: number; projectId: number }) => http.post('/api/invitations/send', body),
  respond: (inviteId: number, accept: boolean) => http.put(`/api/invitations/${inviteId}/respond?accept=${accept}`),
};

export const notificationsApi = {
  unread: (userId: number) => http.get<ApiNotification[]>(`/api/notifications/${userId}`),
  markRead: (id: number) => http.put<ApiNotification>(`/api/notifications/${id}/read`),
};

export const messagesApi = {
  conversation: (senderId: number, receiverId: number) =>
    http.get<ApiMessage[]>(`/api/messages?senderId=${senderId}&receiverId=${receiverId}`),
  send: (body: { senderId: number; receiverId: number; text: string }) => http.post<ApiMessage>('/api/messages', body),
};
