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
 * "Für dich empfohlen" — homepage row for logged-in customers who've set
 * genre preferences in the onboarding quiz (account.preferences.tsx).
 * Same /api/recommendations route as RecommendedTracksSection, just seeded
 * by ?genres= instead of ?productId=. The parent (_index.tsx) only renders
 * this once it knows preferences exist, so it never has to render an
 * empty state itself.
 */
export function ForYouSection({genres}: {genres: string[]}) {
  const [items, setItems] = useState<RecommendedItem[] | null>(null);
  const genresKey = genres.join(',');

  useEffect(() => {
    if (!genresKey) {
      setItems([]);
      return;
    }

    let cancelled = false;

    fetch(`/api/recommendations?genres=${encodeURIComponent(genresKey)}&limit=6`)
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
  }, [genresKey]);

  if (!items || items.length === 0) return null;

  return (
    <section className="recommended-tracks">
      <h2>Für dich empfohlen</h2>
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
