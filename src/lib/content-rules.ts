/** Pure helpers for filtering and media handling — shared by public pages and admin. */

export const PLAYER_ROLES = ["IGL", "Rusher", "2nd Rusher", "Sniper", "Support", "Assaulter", "Nader"] as const;

export const TOURNAMENT_STATUSES = ["upcoming", "ongoing", "completed"] as const;
export type TournamentStatus = (typeof TOURNAMENT_STATUSES)[number];

export const NEWS_CATEGORIES = [
  "Official Announcements",
  "New Player Announcements",
  "Tournament News",
  "Tournament Results",
  "Team Updates",
  "Recruitment News",
] as const;

export const GALLERY_CATEGORIES = [
  "Team Photos",
  "Tournaments",
  "Match Highlights",
  "Victory Celebrations",
  "Event Banners",
  "Behind The Scenes",
] as const;

export const PARTNERSHIP_TYPES = [
  "Title Sponsor",
  "Principal Partner",
  "Associate Partner",
  "Community Partner",
  "Other",
] as const;

export const SOCIAL_PLATFORMS = ["facebook", "youtube", "discord", "instagram", "tiktok", "x", "website"] as const;

/**
 * A player matches a role filter when their main role equals it, or their
 * role label (e.g. "Sniper + IGL") lists it.
 */
export function playerMatchesRole(
  player: { role: string; role_label?: string | null },
  filter: string,
): boolean {
  if (filter === "All" || !filter) return true;
  const norm = (s: string) => s.trim().toLowerCase();
  if (norm(player.role) === norm(filter)) return true;
  const parts = (player.role_label ?? "").split(/[+,/&]/).map(norm).filter(Boolean);
  return parts.includes(norm(filter));
}

export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m?.[1] ?? null;
}

export function youtubeThumb(url: string | null | undefined): string | null {
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function isDirectVideo(url: string | null | undefined): boolean {
  return !!url && /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function statusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatDate(d: string | null | undefined): string {
  if (!d) return "";
  const date = new Date(d.length === 10 ? `${d}T00:00:00` : d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
