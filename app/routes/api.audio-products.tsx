import type {Route} from './+types/api.audio-products';
import {AUDIO_TRACKS_METAFIELD_FRAGMENT} from '~/lib/fragments';

/**
 * Resource route (no UI): GET /api/audio-products?ids=gid://shopify/Product/1,gid://shopify/Product/2
 *
 * Used by usePlayerPersistence to re-fetch full AudioProduct/AudioTrack data
 * for whatever product IDs were persisted to localStorage (active product +
 * queued tracks' products), since only IDs are persisted, not full Shopify
 * data. Runs server-side so the Storefront API token never reaches the
 * browser.
 */
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const idsParam = url.searchParams.get('ids');

  if (!idsParam) {
    return Response.json({products: []});
  }

  const ids = Array.from(
    new Set(
      idsParam
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ).slice(0, 25); // sane upper bound, this is a small rehydration lookup

  if (ids.length === 0) {
    return Response.json({products: []});
  }

  const {storefront} = context;
  const data = await storefront.query(AUDIO_PRODUCTS_BY_IDS_QUERY, {
    variables: {ids},
  });

  const products = (data.nodes ?? []).filter(
    (node): node is Extract<(typeof data.nodes)[number], {id: string}> =>
      Boolean(node) && (node as {__typename?: string}).__typename === 'Product',
  );

  return Response.json(
    {products},
    {
      headers: {
        // Player state is per-visitor and can go stale (new tracks added) —
        // never cache this at the edge.
        'Cache-Control': 'private, no-store',
      },
    },
  );
}

const AUDIO_PRODUCTS_BY_IDS_QUERY = `#graphql
  query AudioProductsByIds(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      __typename
      ... on Product {
        id
        handle
        title
        featuredImage {
          url
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        ...AudioTracksMetafield
      }
    }
  }
  ${AUDIO_TRACKS_METAFIELD_FRAGMENT}
` as const;
