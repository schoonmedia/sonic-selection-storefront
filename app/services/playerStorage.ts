/**
 * Thin, SSR-safe wrapper around localStorage for player persistence.
 * Never import `window`/`localStorage` directly outside this file — go
 * through these helpers so every call site is guarded the same way.
 */

const STORAGE_KEY = 'sonic-selection:player-state:v1';

export interface PersistedPlayerState {
  activeProductId: string | null;
  activeTrackId: string | null;
  /** Playback position in seconds, saved on pause/unload/interval. */
  position: number;
  volume: number;
  isMuted: boolean;
  /** Track IDs, resolved back to full AudioTrack objects on rehydrate. */
  queueTrackIds: string[];
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readPersistedPlayerState(): PersistedPlayerState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedPlayerState;
  } catch {
    // Corrupt or blocked storage (e.g. Safari private mode) — fail soft.
    return null;
  }
}

export function writePersistedPlayerState(state: PersistedPlayerState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage disabled — ignore, playback still works.
  }
}

export function clearPersistedPlayerState(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
