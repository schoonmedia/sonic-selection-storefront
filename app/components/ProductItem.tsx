import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  // TODO (Phase 3 - Shopify audio data): once ProductItemFragment includes
  // the "Audio Track" metaobject reference (see docs/shopify-audio-track-metaobject.md),
  // map it to AudioProduct/AudioTrack[] and render:
  //   <ProductPlayButton
  //     product={{id: product.id, handle: product.handle, title: product.title, imageUrl: image?.url}}
  //     playlist={tracks}
  //   />
  // next to the image below. Keep it out of the <Link> so clicking play
  // doesn't also navigate to the PDP.
  const image = product.featuredImage;
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}
