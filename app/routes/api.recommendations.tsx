import type {Route} from './+types/api.recommendations';
import {AUDIO_TRACKS_METAFIELD_FRAGMENT} from '~/lib/fragments';
import {mapAudioTracks} from '~/lib/audioTracks';
import type {RawAudioTracksMetafield} from '~/lib/audioTracks';

/**
 * Resource route (no UI). Two seed modes:
 *
 *   GET /api/recommendations?productId=<gid>&limit=6
 *     "You might also like" for a product detail page — seeds from that
 *     product's own tracks.
 *
 *   GET /api/recommendations?genres=Hip-Hop,Lo-Fi&limit=6
 *     "Für dich empfohlen" for a logged-in customer — seeds from their
 *     saved genre preferences (account.preferences.tsx) instead of a
 *     specific product. No BPM signal in this mode (a genre alone has no
 *     BPM), so matches are genre-only.
 *
 * Both modes score a shared candidate pool by genre match + BPM
 * proximity, using the single best-matching track pair per candidate (so
 * a product with more tracks doesn't win purely by having more chances to
 * match). No ML — this is the "erst regelbasiert" step from the roadmap;
 * a smarter engine can replace the scoring function later without
 * touching the response shape.
 *
 * Candidate pool is capped at 50 products fetched fresh per request. Fine
 * for a catalog this size; if the catalog grows a lot this should move to
 * a precomputed/cached index instead of an on-request full scan.
 */
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  const genresParam = url.searchParams.get('genres');
  const limitParam = Number(url.searchParams.get('limit') ?? '6');
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 12)
    : 6;

  const {storefront} = context;
  const noStore = {headers: {'Cache-Control': 'private, no-store'}} as const;

  if (productId) {
    const data = await storefront.query(RECOMMENDATIONS_BY_PRODUCT_QUERY, {
      variables: {seedId: productId, first: 50},
    });

    const seed =
      data.seed && data.seed.__typename === 'Product' ? data.seed : null;
    const seedTracks = seed ? mapAudioTracks(seed.audioTracks, seed.id) : [];

    // No seed product, or it has no playable tracks — nothing to base
    // recommendations on.
    if (!seed || seedTracks.length === 0) {
      return Response.json({products: []}, noStore);
    }

    const scored = scoreCandidates(
      seedTracks,
      data.candidates?.nodes ?? [],
      productId,
      limit,
    );
    return Response.json({products: scored}, noStore);
  }

  if (genresParam) {
    const genres = genresParam
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)
      .slice(0, 10);

    if (genres.length === 0) {
      return Response.json({products: []}, noStore);
    }

    const data = await storefront.query(RECOMMENDATIONS_BY_GENRE_QUERY, {
      variables: {first: 50},
    });

    const seedTracks = genres.map((genre) => ({genre}));
    const scored = scoreCandidates(
      seedTracks,
      data.candidates?.nodes ?? [],
      null,
      limit,
    );
    return Response.json({products: scored}, noStore);
  }

  return Response.json({products: []});
}

/** Minimal shape scoring needs from a seed "track" — a real AudioTrack for
 * productId mode, or just a bare genre for genre mode (no BPM signal). */
interface ScoreSeed {
  genre?: string;
  bpm?: number;
}

function scoreCandidates<
  T extends {id: string; audioTracks?: RawAudioTracksMetafield | null},
>(seedTracks: ScoreSeed[], candidates: T[], excludeId: string | null, limit: number): T[] {
  return candidates
    .filter((candidate) => candidate.id !== excludeId)
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
}

const CANDIDATE_PRODUCT_FIELDS = `#graphql
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
` as const;

const RECOMMENDATIONS_BY_PRODUCT_QUERY = `#graphql
  query RecommendationsByProduct(
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
        ${CANDIDATE_PRODUCT_FIELDS}
      }
    }
  }
  ${AUDIO_TRACKS_METAFIELD_FRAGMENT}
` as const;

const RECOMMENDATIONS_BY_GENRE_QUERY = `#graphql
  query RecommendationsByGenre(
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    candidates: products(first: $first) {
      nodes {
        ${CANDIDATE_PRODUCT_FIELDS}
      }
    }
  }
  ${AUDIO_TRACKS_METAFIELD_FRAGMENT}
` as const;
