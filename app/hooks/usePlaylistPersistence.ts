import {useEffect, useRef} from 'react';
import {usePlaylistStore} from '~/stores/playlistStore';
import {readPersistedPlaylists, writePersistedPlaylists} from '~/services/playlistStorage';
import type {Playlist} from '~/types/playlist';

const SYNC_DEBOUNCE_MS = 2000;

/**
 * Mount once, globally (see components/audio/GlobalPlayer.tsx, same as
 * useFavoritesPersistence/useHistoryPersistence). Two layers, per
 * docs/playlists-and-profile.md:
 *
 * 1. localStorage — always on, works logged out. Hydrates immediately so
 *    playlists render with no network round trip.
 * 2. Customer metafield sync (/api/playlists/sync) — only if logged in.
 *    On mount, merges local + server (see mergePlaylists) so playlists
 *    created on one device before ever logging in aren't lost. After that,
 *    changes are debounce-pushed to the server.
 */
export function usePlaylistPersistence() {
  const hasHydrated = useRef(false);
  const isLoggedInRef = useRef(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playlists = usePlaylistStore((s) => s.playlists);
  const hydrate = usePlaylistStore((s) => s.hydrate);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    const local = readPersistedPlaylists();
    hydrate(local);

    fetch('/api/playlists/sync')
      .then((res): Promise<{loggedIn: boolean; playlists?: Playlist[]}> =>
        res.ok
          ? (res.json() as Promise<{loggedIn: boolean; playlists?: Playlist[]}>)
          : Promise.resolve({loggedIn: false}),
      )
      .then((data) => {
        if (!data.loggedIn) return; // logged out — stay local-only, not an error
        isLoggedInRef.current = true;
        hydrate(mergePlaylists(local, data.playlists ?? []));
      })
      .catch(() => {
        // Offline or endpoint error — stay local-only for this session.
      });
  }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    writePersistedPlaylists(playlists);
  }, [playlists]);

  useEffect(() => {
    if (!hasHydrated.current || !isLoggedInRef.current) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      fetch('/api/playlists/sync', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({playlists}),
      }).catch(() => {
        // Best-effort — localStorage remains the local source of truth
        // even if this particular sync attempt fails.
      });
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [playlists]);
}

/** Union by playlist id; on conflict the more recently updated copy wins.
 *  See "Merge-Strategie" in docs/playlists-and-profile.md for the known
 *  limitation (not safe against true concurrent edits). */
function mergePlaylists(local: Playlist[], server: Playlist[]): Playlist[] {
  const byId = new Map<string, Playlist>();
  for (const playlist of local) byId.set(playlist.id, playlist);
  for (const playlist of server) {
    const existing = byId.get(playlist.id);
    if (!existing || playlist.updatedAt > existing.updatedAt) {
      byId.set(playlist.id, playlist);
    }
  }
  return Array.from(byId.values());
}
