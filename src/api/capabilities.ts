// What the current backend can actually store/do. Flip a flag to `true` once the matching
// backend change ships and the hidden UI will light up again.
export const CAPS = {
  /** Pitch fields domain / experience / hrs-per-week / repo URL — no columns on ProjectPitch yet. */
  pitchExtraFields: false,
  /** ProjectService.createProject only accepts "Online" or "Hybrid". */
  offlineMode: false,
  /** "Send Request" to join a project — backend only has owner→user invitations. */
  joinRequests: false,
  /** Weekly hours / experience level / GitHub on User — filters & badges stay hidden until stored. */
  userAvailabilityFields: false,
  /** Editing semester/department/skills — no PUT /api/users/{id} yet. */
  profileUpdate: false,
} as const;
