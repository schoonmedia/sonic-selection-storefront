import type {Playlist} from '~/types/playlist';

/**
 * Thin, SSR-safe wrapper around localStorage for playlists. Mirrors the
 * pattern in services/favoritesStorage.ts — this is the "always works,
 * even logged out" layer; app/hooks/usePlaylistPersistence.ts adds a
 * customer-metafield sync layer on top for logged-in visitors.
 */

const STORAGE_KEY = 'sonic-selection:playlists:v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readPersistedPlaylists(): Playlist[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Playlist[]) : [];
  } catch {
    // Corrupt or blocked storage (e.g. Safari private mode) — fail soft.
    return [];
  }
}

export function writePersistedPlaylists(playlists: Playlist[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  } catch {
    // Quota exceeded or storage disabled — ignore, playlists still work
    // for the rest of the session, they just won't survive a reload.
  }
}
