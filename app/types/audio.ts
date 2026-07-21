/**
 * Core types for the Sonic Selection global audio player.
 * Keep this file framework-agnostic (no React, no Zustand) so it can be
 * imported from components, hooks, services and Shopify GraphQL mappers
 * without creating circular deps.
 */

/** A single playable preview, mapped from a Shopify "Audio Track" metaobject. */
export interface AudioTrack {
  /** Metaobject GID, e.g. "gid://shopify/Metaobject/123" */
  id: string;
  /** Track title, e.g. "808 Mob - Hard 808" */
  title: string;
  /** Public URL to the MP3/audio preview file (Shopify file or CDN). */
  previewUrl: string;
  /** Duration in seconds. Falls back to 0 until metadata loads. */
  duration: number;
  bpm?: number;
  /** Musical key, e.g. "F# Minor" */
  key?: string;
  genre?: string;
  /** Explicit sort order within its parent product's tracklist. */
  position: number;
  /** GID of the Shopify product this track belongs to. */
  productId: string;
}

/** The product a track (or group of tracks) belongs to — enough to render
 *  a mini player without re-fetching the full product. */
export interface AudioProduct {
  id: string;
  handle: string;
  title: string;
  /** Square artwork, e.g. pack cover. */
  imageUrl?: string;
  /** Selected/default variant price, formatted for display. */
  price?: string;
}

export type RepeatMode = 'off' | 'track' | 'playlist';

export interface PlayerState {
  activeProduct: AudioProduct | null;
  activeTrack: AudioTrack | null;
  /** Full ordered tracklist of the active product (used for prev/next). */
  playlist: AudioTrack[];
  /** User-queued tracks, played after the current playlist is exhausted. */
  queue: AudioTrack[];
  isPlaying: boolean;
  /** True while the audio element is buffering the active track. */
  isLoading: boolean;
  currentTime: number;
  duration: number;
  /** 0..1 */
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  /** True once the store has been rehydrated from localStorage. */
  isHydrated: boolean;
}

/** Analytics event names emitted by the player. See services/audioAnalytics.ts */
export type PlayerEventName =
  | 'track_started'
  | 'track_paused'
  | 'track_completed'
  | 'product_opened'
  | 'product_added_to_cart'
  | 'favorite_added'
  | 'favorite_removed';

export interface PlayerEvent {
  name: PlayerEventName;
  trackId?: string;
  productId?: string;
  /** Playback position in seconds at time of event, where relevant. */
  position?: number;
  timestamp: number;
}
