# ProMatch — frontend ↔ backend integration

Backend base URL: `VITE_API_URL` (default `https://promatch-backend-1.onrender.com`). See `.env.example`.
Code: `src/api/*` (client, adapters, endpoints), `src/context/*` (auth, notifications).
`src/api/capabilities.ts` holds flags for features the backend can't support yet — flip to `true` once it can.

## Connected
| Screen | Endpoint(s) |
|---|---|
| Sign in / Register | POST /api/auth/login, /api/auth/register |
| Dashboard | GET /api/dashboard/{id} |
| Explore | GET /api/projects |
| Pitch a project | POST /api/projects |
| Find teammates | GET /api/users |
| Send invite | POST /api/invitations/send |
| Profile (pitched + joined projects, skills) | GET /api/users/{id} |
| Notifications (bell, page, mark read) | GET /api/notifications/{id}, PUT /api/notifications/{id}/read |
| Messages → Direct tab | GET/POST /api/messages |
| Landing "Live Projects" | GET /api/projects |

## Missing on the backend (needed for the full UI)
1. **Passwords** – login is by email/name only; any email signs in as that user. Add a `passwordHash` (BCrypt) to User, check it on login, and enforce JWT on `/api/**` (currently `permitAll`).
2. **PUT /api/users/{id}** – edit semester, department, skills, GitHub, class (profile edit is hidden until this exists).
3. **User columns**: githubUrl, classLabel, weeklyHours, workingTimes, preferredMode, skill levels.
4. **ProjectPitch columns**: domain, experienceLevel, weeklyHours, repoUrl. Also `createProject` rejects mode "Offline" (only Online/Hybrid allowed).
5. **Join requests** – "Send Request" on a project card needs e.g. POST /api/projects/{id}/requests (+ respond). Only owner→user invitations exist.
6. **Notifications** – only unread are returned (no history); no "mark all read"; invitations don't create notifications.
7. **Messages** – no conversation-list endpoint and no project group chat.
8. **Security hygiene** – `application.properties` has the Supabase DB credentials and the JWT secret has a default value in code. Move to environment variables and rotate the DB password.
