import {useEffect, useRef} from 'react';
import {usePlayerStore} from '~/stores/playerStore';
import {
  readPersistedPlayerState,
  writePersistedPlayerState,
  type PersistedPlayerState,
} from '~/services/playerStorage';
import {mapAudioTracks, toAudioProduct} from '~/lib/audioTracks';
import type {RawAudioTracksMetafield} from '~/lib/audioTracks';
import type {AudioProduct, AudioTrack, PlayerState} from '~/types/audio';

interface AudioProductJson {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {url?: string | null} | null;
  priceRange?: {
    minVariantPrice?: {amount?: string | null; currencyCode?: string | null} | null;
  } | null;
  audioTracks?: RawAudioTracksMetafield | null;
}

interface AudioProductsResponse {
  products?: AudioProductJson[];
}

/**
 * Mount once in <GlobalPlayer />, alongside useAudioEngine.
 *
 * On mount:
 *  1. Synchronously restores volume/mute/last-position from localStorage
 *     (instant, no network) so those controls are correct immediately.
 *  2. Fires an async fetch to /api/audio-products for the persisted active
 *     product + any queued tracks' products, and once resolved, hydrates
 *     activeProduct/activeTrack/playlist/queue with the real Shopify data.
 *     isPlaying is never set true here — browser autoplay policies block
 *     it anyway, and the user should always press play after a reload.
 *
 * After mount: writes the relevant slice of state to localStorage,
 * debounced, whenever it changes.
 */
export function usePlayerPersistence() {
  const hasHydrated = useRef(false);

  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const activeProduct = usePlayerStore((s) => s.activeProduct);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const queue = usePlayerStore((s) => s.queue);
  const hydrate = usePlayerStore((s) => s.hydrate);

  // Rehydrate once on mount.
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const persisted = readPersistedPlayerState();
    if (!persisted) {
      hydrate({});
      return;
    }

    hydrate({
      volume: persisted.volume,
      isMuted: persisted.isMuted,
      // currentTime is restored immediately for display; useAudioEngine
      // seeks the actual <audio> element to it once the resolved track's
      // metadata has loaded (see onLoadedMetadata in useAudioEngine.ts).
      currentTime: persisted.position,
    });

    void rehydrateFromShopify(persisted, hydrate);
  }, [hydrate]);

  // Persist on change, debounced so scrubbing/timeupdate doesn't thrash
  // localStorage on every animation frame.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hasHydrated.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const next: PersistedPlayerState = {
        activeProductId: activeProduct?.id ?? null,
        activeTrackId: activeTrack?.id ?? null,
        position: currentTime,
        volume,
        isMuted,
        queue: queue.map((t) => ({trackId: t.id, productId: t.productId})),
      };
      writePersistedPlayerState(next);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [activeProduct?.id, activeTrack?.id, currentTime, volume, isMuted, queue]);
}

/**
 * Re-fetches full AudioProduct/AudioTrack data for whatever product IDs
 * were persisted (active product + queued tracks' products) and hydrates
 * the store with the resolved objects. Fails soft on any error — the
 * player simply stays empty, same as before this feature existed.
 */
async function rehydrateFromShopify(
  persisted: PersistedPlayerState,
  hydrate: (partial: Partial<PlayerState>) => void,
): Promise<void> {
  const productIds = new Set<string>();
  if (persisted.activeProductId) productIds.add(persisted.activeProductId);
  for (const entry of persisted.queue) productIds.add(entry.productId);

  if (productIds.size === 0) return;

  try {
    const url = `/api/audio-products?ids=${encodeURIComponent(
      Array.from(productIds).join(','),
    )}`;
    const res = await fetch(url);
    if (!res.ok) return;

    const data = (await res.json()) as AudioProductsResponse;
    const productMap = new Map<
      string,
      {audioProduct: AudioProduct; tracks: AudioTrack[]}
    >();

    for (const raw of data.products ?? []) {
      productMap.set(raw.id, {
        audioProduct: toAudioProduct(raw),
        tracks: mapAudioTracks(raw.audioTracks, raw.id),
      });
    }

    let resolvedActiveProduct: AudioProduct | null = null;
    let resolvedActiveTrack: AudioTrack | null = null;
    let resolvedPlaylist: AudioTrack[] = [];

    if (persisted.activeProductId) {
      const entry = productMap.get(persisted.activeProductId);
      if (entry) {
        resolvedActiveProduct = entry.audioProduct;
        resolvedPlaylist = entry.tracks;
        resolvedActiveTrack =
          entry.tracks.find((t) => t.id === persisted.activeTrackId) ??
          entry.tracks[0] ??
          null;
      }
    }

    const resolvedQueue: AudioTrack[] = persisted.queue
      .map((q) => productMap.get(q.productId)?.tracks.find((t) => t.id === q.trackId))
      .filter((t): t is AudioTrack => Boolean(t));

    // Nothing resolved (e.g. product/track was deleted in Shopify since
    // the last visit) — leave the player empty rather than showing a
    // broken active track with no source.
    if (!resolvedActiveTrack && resolvedQueue.length === 0) return;

    hydrate({
      activeProduct: resolvedActiveProduct,
      activeTrack: resolvedActiveTrack,
      playlist: resolvedPlaylist,
      queue: resolvedQueue,
      isPlaying: false,
    });
  } catch {
    // Network error / offline — fail soft.
  }
}
