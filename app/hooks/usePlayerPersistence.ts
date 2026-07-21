import {useEffect, useRef} from 'react';
import {usePlayerStore} from '~/stores/playerStore';
import {
  readPersistedPlayerState,
  writePersistedPlayerState,
  type PersistedPlayerState,
} from '~/services/playerStorage';

/**
 * Mount once in <GlobalPlayer />, alongside useAudioEngine.
 *
 * On mount: reads localStorage and calls `hydrate()` so the UI shows the
 * last-played product/track/position/volume/queue after a reload. It does
 * NOT auto-play — browser autoplay policies block that anyway, and the
 * user should always be the one to press play after a fresh page load.
 *
 * After mount: writes the relevant slice of state to localStorage,
 * debounced, whenever it changes.
 *
 * Note: this only persists IDs for tracks/queue, not full AudioTrack
 * objects (those come from Shopify and can go stale). Rehydrating a full
 * playlist from IDs alone requires re-fetching the product; that wiring
 * happens where the store is consumed (e.g. in root loader/route) once
 * Shopify data is connected. For now `activeTrack`/`playlist` stay empty
 * after reload and only volume/mute/position-intent are restored.
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
      // currentTime is restored but playback stays paused until the user
      // presses play again (and until activeTrack is re-resolved from
      // Shopify data using persisted.activeTrackId).
      currentTime: persisted.position,
    });
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
        queueTrackIds: queue.map((t) => t.id),
      };
      writePersistedPlayerState(next);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [activeProduct?.id, activeTrack?.id, currentTime, volume, isMuted, queue]);
}
