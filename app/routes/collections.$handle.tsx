import {redirect, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {AUDIO_TRACKS_METAFIELD_FRAGMENT} from '~/lib/fragments';
import {MUSIC_GENRES} from '~/lib/musicGenres';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

// Genre is modeled as a product tag prefixed "genre:<Genre>" (see
// app/lib/musicGenres.ts) rather than its own Shopify filter/metafield, so it
// stays a plain Storefront API tag filter under the hood and combines freely
// with the existing Type-based collections (a collection page can be
// "Drum Kits" + "Trap" at once, which separate genre collections couldn't do).
const GENRE_TAG_PREFIX = 'genre:';

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const selectedGenres = new URL(request.url).searchParams.getAll('genre');
  const filters = selectedGenres.map((genre) => ({
    tag: `${GENRE_TAG_PREFIX}${genre}`,
  }));

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, filters, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    selectedGenres,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, selectedGenres} = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      <h1>{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <GenreFilterRow
        filters={collection.products.filters}
        selectedGenres={selectedGenres}
      />
      <PaginatedResourceSection<ProductItemFragment>
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/** Reads a FilterValue's `input` field (the Storefront API's JSON scalar —
 * arrives as a JSON string over the wire, but defend against an already-
 * parsed object too) and returns the `tag` it represents, if any. */
function readTagFromFilterInput(input: unknown): string | null {
  const parsed =
    typeof input === 'string'
      ? safeJsonParse(input)
      : input && typeof input === 'object'
        ? input
        : null;
  const tag = (parsed as {tag?: unknown} | null)?.tag;
  return typeof tag === 'string' ? tag : null;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function GenreFilterRow({
  filters,
  selectedGenres,
}: {
  filters: Filter[];
  selectedGenres: string[];
}) {
  const genreOptions = filters
    .flatMap((filter) => filter.values)
    .map((value) => {
      const tag = readTagFromFilterInput(value.input);
      if (!tag || !tag.startsWith(GENRE_TAG_PREFIX)) return null;
      return {genre: tag.slice(GENRE_TAG_PREFIX.length), count: value.count};
    })
    .filter((option): option is {genre: string; count: number} => option !== null)
    // Stable, curated order instead of whatever order the API returns.
    .sort(
      (a, b) =>
        MUSIC_GENRES.indexOf(a.genre as (typeof MUSIC_GENRES)[number]) -
        MUSIC_GENRES.indexOf(b.genre as (typeof MUSIC_GENRES)[number]),
    );

  if (genreOptions.length === 0) return null;

  return (
    <div className="genre-filter-row" role="group" aria-label="Filter by genre">
      {genreOptions.map(({genre, count}) => {
        const isSelected = selectedGenres.includes(genre);
        const nextGenres = isSelected
          ? selectedGenres.filter((g) => g !== genre)
          : [...selectedGenres, genre];
        const params = new URLSearchParams();
        nextGenres.forEach((g) => params.append('genre', g));
        const href = params.toString() ? `?${params.toString()}` : '';

        return (
          <Link
            key={genre}
            to={href || '.'}
            className={
              isSelected ? 'genre-filter-chip is-active' : 'genre-filter-chip'
            }
            preventScrollReset
            prefetch="intent"
          >
            {genre}
            <span className="genre-filter-chip-count">{count}</span>
          </Link>
        );
      })}
      {selectedGenres.length > 0 && (
        <Link to="." className="genre-filter-clear" preventScrollReset>
          Clear
        </Link>
      )}
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    ...AudioTracksMetafield
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${AUDIO_TRACKS_METAFIELD_FRAGMENT}
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
