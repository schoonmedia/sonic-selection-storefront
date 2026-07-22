import {Link} from 'react-router';
import type {SonicProduct} from '~/lib/platform/types';
import {getAudioTrackById, getProducerById} from '~/lib/platform/mockData';
import {PlatformCoverImage} from './PlatformCoverImage';
import {PlatformPlayButton} from './PlatformPlayButton';

/**
 * Cinematic, movie-poster style card for Artist Packs (see content-model.md
 * — Artist Packs are a platform-wide commercial/cultural layer, not FPC- or
 * project-specific). Links to the real Shopify product route when a
 * `shopifyHandle` is present; falls back to a non-interactive card
 * otherwise so it can still be used purely editorially (e.g. "coming soon").
 *
 * Also surfaces a "by {producer}" byline linking to the producer's profile —
 * a pack is never just a product, it's also an entry point into that
 * producer's full presence on the platform (affiliations, other packs,
 * stories, external links).
 */
export function ArtistPackCard({product}: {product: SonicProduct}) {
  const previewTrack = product.audioTrackIds.map((id) => getAudioTrackById(id)).find(Boolean);
  const href = product.shopifyHandle ? `/products/${product.shopifyHandle}` : undefined;
  const producer = product.producerIds.map((id) => getProducerById(id)).find(Boolean);

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
        {producer && (
          <Link to={`/producers/${producer.handle}`} prefetch="intent" className="artist-pack-card-producer">
            by {producer.name}
          </Link>
        )}
        <span className="artist-pack-card-label">Artist Pack</span>
        {product.price && <span className="artist-pack-card-price">{product.price}</span>}
      </div>
    </div>
  );
}
