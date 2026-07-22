import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import type {
  RecommendedProductsQuery,
  HomeCategoriesQuery,
  HomeNewReleasesQuery,
  HomeHeroProductQuery,
} from 'storefrontapi.generated';
import {AUDIO_TRACKS_METAFIELD_FRAGMENT} from '~/lib/fragments';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import {RecentlyPlayedSection} from '~/components/audio/RecentlyPlayedSection';
import {ForYouSection} from '~/components/audio/ForYouSection';
import {CUSTOMER_MUSIC_PREFERENCES_QUERY} from '~/graphql/customer-account/CustomerMusicPreferencesQuery';
import {Hero} from '~/components/home/Hero';
import {FeatureIconsRow} from '~/components/home/FeatureIconsRow';
import {CategoryGrid} from '~/components/home/CategoryGrid';
import {NewReleasesSection} from '~/components/home/NewReleasesSection';
import {ArtistPacksTeaser} from '~/components/home/ArtistPacksTeaser';
import {ProducersTeaser} from '~/components/home/ProducersTeaser';
import {ProjectsTeaser} from '~/components/home/ProjectsTeaser';
import {StoriesTeaser} from '~/components/home/StoriesTeaser';
import {FreeStarterKitTeaser} from '~/components/home/FreeStarterKitTeaser';
import {CommunityCta} from '~/components/home/CommunityCta';

export const meta: Route.MetaFunction = () => {
  return [
    {
      title:
        'Sonic Selection | Sounds that inspire. Tools that elevate.',
    },
  ];
};

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
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, {products: newReleaseProducts}, heroProductData] =
    await Promise.all([
      context.storefront.query(HOME_CATEGORIES_QUERY),
      context.storefront.query(HOME_NEW_RELEASES_QUERY),
      context.storefront
        .query(HOME_HERO_PRODUCT_QUERY)
        .catch((error: Error) => {
          console.error(error);
          return {products: {nodes: []}};
        }),
    ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    // "Home page" is a manual collection Shopify creates by default and
    // isn't one of the Sonic Selection sample-pack categories — hide it
    // from the Browse by Category grid.
    categories: collections.nodes
      .filter((collection) => collection.title !== 'Home page')
      .slice(0, 10),
    newReleases: newReleaseProducts.nodes,
    heroProduct: heroProductData.products.nodes[0] ?? null,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const preferredGenres = loadPreferredGenres(context);

  return {
    recommendedProducts,
    preferredGenres,
  };
}

/** Logged-in customers who completed the onboarding quiz get a "Für dich
 * empfohlen" section, seeded by their saved genres. Everyone else (logged
 * out, or logged in but skipped the quiz) sees nothing extra — this
 * resolves to null in both cases so ForYouSection never renders. */
async function loadPreferredGenres(
  context: Route.LoaderArgs['context'],
): Promise<string[] | null> {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) return null;

    const {data} = await context.customerAccount.query(
      CUSTOMER_MUSIC_PREFERENCES_QUERY,
    );
    const raw = data?.customer?.musicPreferences?.value;
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {genres?: string[]};
    return parsed.genres && parsed.genres.length > 0 ? parsed.genres : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <Hero heroProduct={data.heroProduct} />
      <FeatureIconsRow />
      <CategoryGrid categories={data.categories} />
      <NewReleasesSection products={data.newReleases} />
      <ArtistPacksTeaser />
      <ProducersTeaser />
      <ProjectsTeaser />
      <StoriesTeaser />
      <FreeStarterKitTeaser />
      <CommunityCta />
      <ForYou genres={data.preferredGenres} />
      <RecentlyPlayedSection />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function ForYou({genres}: {genres: Promise<string[] | null>}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={genres}>
        {(resolvedGenres) =>
          resolvedGenres && resolvedGenres.length > 0 ? (
            <ForYouSection genres={resolvedGenres} />
          ) : null
        }
      </Await>
    </Suspense>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section
      className="recommended-products home-section"
      aria-labelledby="recommended-products"
    >
      <h2 id="recommended-products">Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </section>
  );
}

const HOME_CATEGORIES_QUERY = `#graphql
  fragment HomeCategory on Collection {
    id
    title
    handle
    products(first: 50) {
      nodes {
        id
      }
    }
  }
  query HomeCategories($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 12, sortKey: TITLE) {
      nodes {
        ...HomeCategory
      }
    }
  }
` as const;

const HOME_NEW_RELEASES_QUERY = `#graphql
  ${AUDIO_TRACKS_METAFIELD_FRAGMENT}
  fragment NewReleaseProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    ...AudioTracksMetafield
  }
  query HomeNewReleases($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...NewReleaseProduct
      }
    }
  }
` as const;

const HOME_HERO_PRODUCT_QUERY = `#graphql
  fragment HeroProduct on Product {
    id
    title
    handle
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
  query HomeHeroProduct($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 1, query: "title:'Dark Trap Vol. 5'") {
      nodes {
        ...HeroProduct
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${AUDIO_TRACKS_METAFIELD_FRAGMENT}
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    ...AudioTracksMetafield
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
