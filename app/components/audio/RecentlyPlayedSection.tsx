import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {useHistoryStore} from '~/stores/historyStore';
import {mapAudioTracks, toAudioProduct} from '~/lib/audioTracks';
import type {RawAudioTracksMetafield} from '~/lib/audioTracks';
import {ProductPlayButton} from '~/components/audio/ProductPlayButton';
import type {AudioProduct, AudioTrack} from '~/types/audio';

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

interface ResolvedHistoryItem {
  product: AudioProduct;
  track: AudioTrack;
  playlist: AudioTrack[];
}

/**
 * "Zuletzt gehört" — homepage row of the last few distinct products the
 * visitor played, resuming the specific track they played (not just track
 * 1). Client-rendered: history lives in localStorage (historyStore, see
 * hooks/useHistoryPersistence.ts), which the server has no access to.
 * Renders nothing until there's something to show, so it never leaves an
 * empty gap for first-time visitors.
 */
export function RecentlyPlayedSection() {
  const history = useHistoryStore((s) => s.history);
  const isHydrated = useHistoryStore((s) => s.isHydrated);
  const [items, setItems] = useState<ResolvedHistoryItem[] | null>(null);

  const idsKey = history.map((h) => h.productId).join(',');

  useEffect(() => {
    if (!isHydrated) return;

    if (history.length === 0) {
      setItems([]);
      return;
    }

    let cancelled = false;

    fetch(`/api/audio-products?ids=${encodeURIComponent(idsKey)}`)
      .then((res) =>
        res.ok
          ? (res.json() as Promise<{products?: AudioProductJson[]}>)
          : {products: []},
      )
      .then((data) => {
        if (cancelled) return;
        const byId = new Map((data.products ?? []).map((p) => [p.id, p]));
        const resolved: ResolvedHistoryItem[] = [];
        for (const entry of history) {
          const raw = byId.get(entry.productId);
          if (!raw) continue;
          const tracks = mapAudioTracks(raw.audioTracks, raw.id);
          const track = tracks.find((t) => t.id === entry.trackId) ?? tracks[0];
          if (!track) continue;
          resolved.push({product: toAudioProduct(raw), track, playlist: tracks});
        }
        setItems(resolved);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, idsKey]);

  if (!items || items.length === 0) return null;

  return (
    <section className="recently-played">
      <h2>Zuletzt gehört</h2>
      <div className="recently-played__row">
        {items.map(({product, track, playlist}) => (
          <div key={`${product.id}-${track.id}`} className="recently-played__item">
            <ProductPlayButton product={product} playlist={playlist} track={track} />
            <div className="recently-played__meta">
              <Link
                className="recently-played__title"
                to={`/products/${product.handle}`}
                prefetch="intent"
              >
                {product.title}
              </Link>
              <span className="recently-played__track">{track.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
