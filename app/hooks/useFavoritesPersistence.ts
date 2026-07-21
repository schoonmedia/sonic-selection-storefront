import {useEffect, useRef} from 'react';
import {useFavoritesStore} from '~/stores/favoritesStore';
import {
  readPersistedFavorites,
  writePersistedFavorites,
} from '~/services/favoritesStorage';

/**
 * Mount once, globally (see components/audio/GlobalPlayer.tsx — it's the
 * one component that's always mounted regardless of route). Reads
 * localStorage on mount and hydrates the store, then writes back to
 * localStorage whenever favorites change.
 */
export function useFavoritesPersistence() {
  const hasHydrated = useRef(false);
  const favorites = useFavoritesStore((s) => s.favorites);
  const hydrate = useFavoritesStore((s) => s.hydrate);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    hydrate(readPersistedFavorites());
  }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    writePersistedFavorites(favorites);
  }, [favorites]);
}
