import {create} from 'zustand';
import type {Playlist, PlaylistTrackRef} from '~/types/playlist';

interface PlaylistsState {
  playlists: Playlist[];
  /** True once read from localStorage (see usePlaylistPersistence). */
  isHydrated: boolean;
}

interface PlaylistsActions {
  createPlaylist: (name: string) => string;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string, productId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  /** Full replace, used by usePlaylistPersistence for both the initial
   *  localStorage read and after merging in a logged-in customer's
   *  server-side playlists. */
  hydrate: (playlists: Playlist[]) => void;
}

export type PlaylistsStore = PlaylistsState & PlaylistsActions;

function generateId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `playlist-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Single global playlists store, same one-instance pattern as
 * stores/favoritesStore.ts. Components should read via selectors so they
 * re-render on change, e.g.
 * `usePlaylistStore((s) => s.playlists.find((p) => p.id === id))`.
 */
export const usePlaylistStore = create<PlaylistsStore>((set) => ({
  playlists: [],
  isHydrated: false,

  createPlaylist: (name) => {
    const id = generateId();
    const now = Date.now();
    set((s) => ({
      playlists: [
        ...s.playlists,
        {id, name: name.trim() || 'Neue Playlist', createdAt: now, updatedAt: now, tracks: []},
      ],
    }));
    return id;
  },

  renamePlaylist: (id, name) =>
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === id ? {...p, name: name.trim() || p.name, updatedAt: Date.now()} : p,
      ),
    })),

  deletePlaylist: (id) =>
    set((s) => ({playlists: s.playlists.filter((p) => p.id !== id)})),

  addTrackToPlaylist: (playlistId, trackId, productId) =>
    set((s) => ({
      playlists: s.playlists.map((p) => {
        if (p.id !== playlistId) return p;
        if (p.tracks.some((t) => t.trackId === trackId)) return p; // no duplicates
        const ref: PlaylistTrackRef = {
          contentType: 'track',
          trackId,
          productId,
          addedAt: Date.now(),
        };
        return {...p, tracks: [...p.tracks, ref], updatedAt: Date.now()};
      }),
    })),

  removeTrackFromPlaylist: (playlistId, trackId) =>
    set((s) => ({
      playlists: s.playlists.map((p) =>
        p.id === playlistId
          ? {...p, tracks: p.tracks.filter((t) => t.trackId !== trackId), updatedAt: Date.now()}
          : p,
      ),
    })),

  hydrate: (playlists) => set({playlists, isHydrated: true}),
}));
