import {useEffect, useState} from 'react';
import {Link} from 'react-router';
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

interface RecommendedItem {
  product: AudioProduct;
  track: AudioTrack;
  playlist: AudioTrack[];
}

/**
 * "Das könnte dir auch gefallen" — rule-based recommendations (same
 * genre / close BPM) for the product currently being viewed. Client-
 * rendered: hits /api/recommendations, which does the actual scoring
 * server-side. Renders nothing while loading or if nothing scored above
 * zero (e.g. a near-empty catalog) — no empty-state clutter on the PDP.
 */
export function RecommendedTracksSection({productId}: {productId: string}) {
  const [items, setItems] = useState<RecommendedItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);

    fetch(
      `/api/recommendations?productId=${encodeURIComponent(productId)}&limit=6`,
    )
      .then((res) =>
        res.ok
          ? (res.json() as Promise<{products?: AudioProductJson[]}>)
          : {products: []},
      )
      .then((data) => {
        if (cancelled) return;
        const resolved: RecommendedItem[] = [];
        for (const raw of data.products ?? []) {
          const tracks = mapAudioTracks(raw.audioTracks, raw.id);
          if (tracks.length === 0) continue;
          resolved.push({
            product: toAudioProduct(raw),
            track: tracks[0],
            playlist: tracks,
          });
        }
        setItems(resolved);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (!items || items.length === 0) return null;

  return (
    <section className="recommended-tracks">
      <h2>Das könnte dir auch gefallen</h2>
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
