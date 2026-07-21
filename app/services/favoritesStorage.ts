/**
 * Thin, SSR-safe wrapper around localStorage for favorited products.
 * Mirrors the pattern in services/playerStorage.ts — go through these
 * helpers so every call site is guarded the same way.
 */

const STORAGE_KEY = 'sonic-selection:favorites:v1';

export interface PersistedFavoriteEntry {
  /** Shopify product GID. */
  productId: string;
  /** Unix ms timestamp, used to sort the favorites overview (newest first). */
  addedAt: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readPersistedFavorites(): PersistedFavoriteEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PersistedFavoriteEntry[]) : [];
  } catch {
    // Corrupt or blocked storage (e.g. Safari private mode) — fail soft.
    return [];
  }
}

export function writePersistedFavorites(entries: PersistedFavoriteEntry[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded or storage disabled — ignore, favoriting still works
    // for the rest of the session, it just won't survive a reload.
  }
}
