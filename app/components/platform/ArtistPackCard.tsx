import {Link} from 'react-router';
import type {SonicProduct} from '~/lib/platform/types';
import {getAudioTrackById} from '~/lib/platform/mockData';
import {PlatformCoverImage} from './PlatformCoverImage';
import {PlatformPlayButton} from './PlatformPlayButton';

/**
 * Cinematic, movie-poster style card for Artist Packs (see content-model.md
 * — Artist Packs are a platform-wide commercial/cultural layer, not FPC- or
 * project-specific). Links to the real Shopify product route when a
 * `shopifyHandle` is present; falls back to a non-interactive card
 * otherwise so it can still be used purely editorially (e.g. "coming soon").
 */
export function ArtistPackCard({product}: {product: SonicProduct}) {
  const previewTrack = product.audioTrackIds.map((id) => getAudioTrackById(id)).find(Boolean);
  const href = product.shopifyHandle ? `/products/${product.shopifyHandle}` : undefined;

  const media = (
    <PlatformCoverImage src={product.coverImage} alt={product.title} className="artist-pack-card-image" />
  );

  return (
    <div className="artist-pack-card">
      <div className="artist-pack-card-media">
        {href ? (
          <Link to={href} prefetch="intent" className="artist-pack-card-media-link">
            {media}
          </Link>
        ) : (
          media
        )}
        <PlatformPlayButton track={previewTrack} contextTitle={product.title} size="sm" />
      </div>
      <div className="artist-pack-card-body">
        {href ? (
          <Link to={href} prefetch="intent" className="artist-pack-card-title">
            {product.title}
          </Link>
        ) : (
          <span className="artist-pack-card-title">{product.title}</span>
        )}
        <span className="artist-pack-card-label">Artist Pack</span>
        {product.price && <span className="artist-pack-card-price">{product.price}</span>}
      </div>
    </div>
  );
}
