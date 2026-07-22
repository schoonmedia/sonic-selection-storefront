import {useEffect, useRef} from 'react';
import {usePlayerStore} from '~/stores/playerStore';
import {useHistoryStore} from '~/stores/historyStore';
import {readPersistedHistory, writePersistedHistory} from '~/services/historyStorage';

/**
 * Mount once, globally (see components/audio/GlobalPlayer.tsx). Hydrates
 * "Zuletzt gehört" from localStorage on mount, then records an entry
 * whenever the active track changes to a real track — this is what
 * powers the homepage's RecentlyPlayedSection.
 */
export function useHistoryPersistence() {
  const hasHydrated = useRef(false);

  const history = useHistoryStore((s) => s.history);
  const hydrate = useHistoryStore((s) => s.hydrate);
  const addEntry = useHistoryStore((s) => s.addEntry);

  const activeProduct = usePlayerStore((s) => s.activeProduct);
  const activeTrack = usePlayerStore((s) => s.activeTrack);

  // Hydrate once on mount.
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    hydrate(readPersistedHistory());
  }, [hydrate]);

  // Record a play whenever the active track changes (after hydration, so
  // we don't race the read above). Skip synthetic products — playing a
  // track from inside a playlist (routes/playlists.$id.tsx) loads a
  // synthetic AudioProduct with id `playlist:<id>` rather than a real
  // Shopify product GID, since a playlist can span multiple products.
  // historyStore's contract requires a real GID (it's later sent straight
  // to /api/audio-products' `nodes(ids:)` query, which fails outright —
  // for the whole batch, not just the bad id — if handed a malformed id),
  // so recording it would silently break "Zuletzt gehört" everywhere.
  useEffect(() => {
    if (!hasHydrated.current) return;
    if (!activeProduct || !activeTrack) return;
    if (!activeProduct.id.startsWith('gid://')) return;
    addEntry(activeProduct.id, activeTrack.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProduct?.id, activeTrack?.id]);

  // Persist on every change.
  useEffect(() => {
    if (!hasHydrated.current) return;
    writePersistedHistory(history);
  }, [history]);
}
