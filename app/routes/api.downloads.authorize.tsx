import type {Route} from './+types/api.downloads.authorize';
import {CUSTOMER_PRODUCT_ORDERS_QUERY} from '~/graphql/customer-account/CustomerProductOrdersQuery';

/**
 * Resource route (no UI). GET /api/downloads/authorize?productId=<gid>
 *
 * Gate for the Ableton drag-and-drop feature (docs/ableton-drag-and-drop.md
 * has the full design). Returns the audio tracks' *master* download URLs
 * for a product — but ONLY if the visitor is entitled: the product sits in
 * the "free" collection, or the logged-in customer has an order containing
 * it (checked against their last 50 orders via the Customer Account API).
 * Everyone else gets 401 with no URLs.
 *
 * This is deliberately the ONLY place `download_url` is ever queried — see
 * the security note in docs/shopify-audio-track-metaobject.md. The shared
 * AUDIO_TRACK_FIELDS_FRAGMENT used by every product-listing page must never
 * fetch it, since that response ships to the browser.
 */
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  const noStore = {headers: {'Cache-Control': 'private, no-store'}} as const;

  if (!productId) {
    return Response.json({authorized: false, error: 'missing productId'}, {status: 400, ...noStore});
  }

  const {storefront, customerAccount} = context;

  const authorized =
    (await isFreeProduct(storefront, productId)) ||
    (await customerOwnsProduct(customerAccount, productId));

  if (!authorized) {
    return Response.json({authorized: false}, {status: 401, ...noStore});
  }

  const tracks = await fetchDownloadableTracks(storefront, productId);
  return Response.json({authorized: true, tracks}, noStore);
}

/** True if the product is in the "free" collection — free packs need no
 *  purchase/login to drag into a DAW. */
async function isFreeProduct(
  storefront: Route.LoaderArgs['context']['storefront'],
  productId: string,
): Promise<boolean> {
  try {
    const data = await storefront.query(PRODUCT_COLLECTIONS_QUERY, {
      variables: {id: productId},
    });
    const collections = data.product?.collections?.nodes ?? [];
    return collections.some((collection) => collection.handle === 'free');
  } catch (error) {
    console.error('[downloads-authorize] free-collection check failed', error);
    return false;
  }
}

/** True if the logged-in customer's recent orders include this product.
 *  Logged-out visitors, or customers without a matching order, get false
 *  — same outcome either way (no download), so no need to distinguish. */
async function customerOwnsProduct(
  customerAccount: Route.LoaderArgs['context']['customerAccount'],
  productId: string,
): Promise<boolean> {
  try {
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) return false;

    const {data} = await customerAccount.query(CUSTOMER_PRODUCT_ORDERS_QUERY, {
      variables: {first: 50},
    });
    const orders = data?.customer?.orders?.nodes ?? [];
    return orders.some((order) =>
      order.lineItems?.nodes?.some((lineItem) => lineItem.productId === productId),
    );
  } catch (error) {
    console.error('[downloads-authorize] order ownership check failed', error);
    return false;
  }
}

interface DownloadableTrack {
  trackId: string;
  title: string;
  downloadUrl: string;
}

/** Fetches download_url for every track of an authorized product. Tracks
 *  without a populated download_url (no master file uploaded yet) are
 *  skipped — the drag handle simply won't render for those. */
async function fetchDownloadableTracks(
  storefront: Route.LoaderArgs['context']['storefront'],
  productId: string,
): Promise<DownloadableTrack[]> {
  try {
    const data = await storefront.query(PRODUCT_DOWNLOAD_URLS_QUERY, {
      variables: {id: productId},
    });
    const nodes = data.product?.audioTracks?.references?.nodes ?? [];
    return nodes
      .map((node) => ({
        trackId: node.id,
        title: node.title?.value ?? 'Untitled',
        downloadUrl: node.downloadUrl?.reference?.url ?? '',
      }))
      .filter((track): track is DownloadableTrack => track.downloadUrl !== '');
  } catch (error) {
    console.error('[downloads-authorize] fetching download URLs failed', error);
    return [];
  }
}

const PRODUCT_COLLECTIONS_QUERY = `#graphql
  query ProductCollectionsForDownloadGate($id: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(id: $id) {
      collections(first: 10) {
        nodes {
          handle
        }
      }
    }
  }
` as const;

// Deliberately separate from AUDIO_TRACK_FIELDS_FRAGMENT (fragments.ts) —
// see the security note above. Never reused by a public-facing query.
const PRODUCT_DOWNLOAD_URLS_QUERY = `#graphql
  query ProductDownloadUrls($id: ID!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(id: $id) {
      audioTracks: metafield(namespace: "custom", key: "audio_tracks") {
        references(first: 20) {
          nodes {
            ... on Metaobject {
              id
              title: field(key: "title") {
                value
              }
              downloadUrl: field(key: "download_url") {
                reference {
                  ... on GenericFile {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;
