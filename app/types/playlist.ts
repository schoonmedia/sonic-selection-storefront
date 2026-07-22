/**
 * Playlist data model. See docs/playlists-and-profile.md for the full
 * architecture (local-first + customer-metafield sync for logged-in
 * customers, merge strategy, why `contentType` exists ahead of need).
 */

/** `'episode'` is intentionally not implemented yet — no podcast content
 *  model exists. The field is here so adding podcasts later doesn't
 *  require a breaking change to persisted playlist data. */
export type PlaylistItemContentType = 'track';

export interface PlaylistTrackRef {
  contentType: PlaylistItemContentType;
  trackId: string;
  productId: string;
  addedAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  tracks: PlaylistTrackRef[];
}
