import type {Route} from './+types/api.recommendations';
import {AUDIO_TRACKS_METAFIELD_FRAGMENT} from '~/lib/fragments';
import {mapAudioTracks} from '~/lib/audioTracks';

/**
 * Resource route (no UI): GET /api/recommendations?productId=<gid>&limit=6
 *
 * Rule-based "you might also like" for a product detail page: pulls a
 * candidate pool of products and scores each one against the seed
 * product's tracks by genre match + BPM proximity, using the single
 * best-matching track pair per candidate (so a product with more tracks
 * doesn't win purely by having more chances to match). No ML — this is
 * the "erst regelbasiert" step from the roadmap; a smarter engine can
 * replace the scoring function later without touching the response shape.
 *
 * Candidate pool is capped at 50 products fetched fresh per request. Fine
 * for a catalog this size; if the catalog grows a lot this should move to
 * a precomputed/cached index instead of an on-request full scan.
 */
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  const limitParam = Number(url.searchParams.get('limit') ?? '6');
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 12)
    : 6;

  if (!productId) {
    return Response.json({products: []});
  }

  const {storefront} = context;
  const data = await storefront.query(RECOMMENDATIONS_QUERY, {
    variables: {seedId: productId, first: 50},
  });

  const seed =
    data.seed && data.seed.__typename === 'Product' ? data.seed : null;
  const seedTracks = seed ? mapAudioTracks(seed.audioTracks, seed.id) : [];

  // No seed product, or it has no playable tracks — nothing to base
  // recommendations on.
  if (!seed || seedTracks.length === 0) {
    return Response.json(
      {products: []},
      {headers: {'Cache-Control': 'private, no-store'}},
    );
  }

  const candidates = (data.candidates?.nodes ?? []).filter(
    (product) => product.id !== productId,
  );

  const scored = candidates
    .map((candidate) => {
      const candidateTracks = mapAudioTracks(candidate.audioTracks, candidate.id);
      let bestScore = 0;

      for (const seedTrack of seedTracks) {
        for (const track of candidateTracks) {
          let score = 0;
          if (
            seedTrack.genre &&
            track.genre &&
            seedTrack.genre.toLowerCase() === track.genre.toLowerCase()
          ) {
            score += 2;
          }
          if (
            typeof seedTrack.bpm === 'number' &&
            typeof track.bpm === 'number' &&
            Math.abs(seedTrack.bpm - track.bpm) <= 6
          ) {
            score += 1;
          }
          if (score > bestScore) bestScore = score;
        }
      }

      return {candidate, score: bestScore};
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);

  return Response.json(
    {products: scored},
    {headers: {'Cache-Control': 'private, no-store'}},
  );
}

const RECOMMENDATIONS_QUERY = `#graphql
  query Recommendations(
    $seedId: ID!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    seed: node(id: $seedId) {
      __typename
      ... on Product {
        id
        ...AudioTracksMetafield
      }
    }
    candidates: products(first: $first) {
      nodes {
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
            amount
            currencyCode
          }
          maxVariantPrice {
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
