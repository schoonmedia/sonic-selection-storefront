/**
 * Thin, SSR-safe wrapper around localStorage for recently-played products.
 * Same pattern as services/playerStorage.ts and services/favoritesStorage.ts.
 */

const STORAGE_KEY = 'sonic-selection:history:v1';
const MAX_HISTORY = 20;

export interface PersistedHistoryEntry {
  /** Shopify product GID. */
  productId: string;
  /** The specific track that was played — used to resume the right one. */
  trackId: string;
  /** Unix ms timestamp of the most recent play. */
  playedAt: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readPersistedHistory(): PersistedHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PersistedHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function writePersistedHistory(entries: PersistedHistoryEntry[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries.slice(0, MAX_HISTORY)),
    );
  } catch {
    // Quota exceeded or storage disabled — ignore, history just won't
    // survive a reload for the rest of this session.
  }
}

export {MAX_HISTORY};
