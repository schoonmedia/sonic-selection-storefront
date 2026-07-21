import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {NewReleaseProductFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {ProductPlayButton} from '~/components/audio/ProductPlayButton';
import {FavoriteButton} from '~/components/audio/FavoriteButton';
import {mapAudioTracks, toAudioProduct} from '~/lib/audioTracks';

/** "New Releases" grid — newest products, styled per the mockup with a
 * "New" badge on each card. Falls back to the brand mark when a product has
 * no featured image yet (all current placeholder products). */
export function NewReleasesSection({
  products,
}: {
  products: NewReleaseProductFragment[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <section
      className="home-section"
      id="new-releases"
      aria-labelledby="new-releases-heading"
    >
      <div className="section-header">
        <h2 id="new-releases-heading">New Releases</h2>
        <Link className="section-view-all" to="/collections" prefetch="intent">
          View all →
        </Link>
      </div>
      <div className="new-releases-grid">
        {products.map((product) => (
          <ReleaseCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ReleaseCard({product}: {product: NewReleaseProductFragment}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const tracks = mapAudioTracks(product.audioTracks, product.id);
  const audioProduct = toAudioProduct(product);

  return (
    <div className="release-card-wrapper">
      <Link className="release-card" to={variantUrl} prefetch="intent">
        <span className="release-badge">New</span>
        <div className="release-card-art">
          {image ? (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              sizes="(min-width: 45em) 300px, 50vw"
            />
          ) : (
            <span className="release-card-art-mark" aria-hidden="true">
              S
            </span>
          )}
        </div>
        <div className="release-card-info">
          <p className="release-card-title">{product.title}</p>
          <p className="release-card-price">
            <Money data={product.priceRange.minVariantPrice} />
          </p>
        </div>
      </Link>
      <FavoriteButton productId={product.id} />
      {tracks.length > 0 && (
        <ProductPlayButton
          product={audioProduct}
          playlist={tracks}
          track={tracks[0]}
        />
      )}
    </div>
  );
}
