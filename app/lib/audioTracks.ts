import type {AudioProduct, AudioTrack} from '~/types/audio';

/**
 * Shapes for the raw Storefront API response produced by
 * AUDIO_TRACKS_METAFIELD_FRAGMENT (app/lib/fragments.ts). Kept loose /
 * hand-written rather than imported from the generated types because the
 * generated `Metaobject` shape doesn't distinguish our custom field aliases
 * — this is the single place that knows how the raw JSON maps to AudioTrack.
 */
interface RawAudioTrackNode {
  id: string;
  title?: {value?: string | null} | null;
  previewUrl?: {
    reference?: {
      url?: string | null;
      image?: {url?: string | null} | null;
    } | null;
  } | null;
  durationSeconds?: {value?: string | null} | null;
  bpm?: {value?: string | null} | null;
  key?: {value?: string | null} | null;
  genre?: {value?: string | null} | null;
  position?: {value?: string | null} | null;
}

export interface RawAudioTracksMetafield {
  references?: {nodes?: RawAudioTrackNode[] | null} | null;
}

/**
 * Converts the `audioTracks` metafield (as fetched by
 * AUDIO_TRACKS_METAFIELD_FRAGMENT) into a sorted AudioTrack[] ready for
 * playerStore.loadProduct(). Returns [] for products with no tracks —
 * callers don't need to null-check.
 */
export function mapAudioTracks(
  metafield: RawAudioTracksMetafield | null | undefined,
  productId: string,
): AudioTrack[] {
  const nodes = metafield?.references?.nodes ?? [];

  return nodes
    .map((node): AudioTrack => ({
      id: node.id,
      title: node.title?.value ?? 'Untitled',
      previewUrl:
        node.previewUrl?.reference?.url ??
        node.previewUrl?.reference?.image?.url ??
        '',
      duration: Number(node.durationSeconds?.value ?? 0),
      bpm: node.bpm?.value ? Number(node.bpm.value) : undefined,
      key: node.key?.value ?? undefined,
      genre: node.genre?.value ?? undefined,
      position: Number(node.position?.value ?? 0),
      productId,
    }))
    // Tracks without a resolved preview file are unplayable — skip them
    // instead of surfacing a broken play button.
    .filter((track) => track.previewUrl !== '')
    .sort((a, b) => a.position - b.position);
}

/**
 * Builds the lightweight AudioProduct used by the player store from any
 * product-shaped object that has at least id/handle/title (works for
 * ProductItemFragment, CollectionItemFragment, RecommendedProductFragment,
 * and the full ProductFragment).
 */
export function toAudioProduct(product: {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {url?: string | null} | null;
  priceRange?: {
    minVariantPrice?: {amount?: string | null; currencyCode?: string | null} | null;
  } | null;
}): AudioProduct {
  const price = product.priceRange?.minVariantPrice;
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    imageUrl: product.featuredImage?.url ?? undefined,
    price:
      price?.amount && price.currencyCode
        ? `${price.amount} ${price.currencyCode}`
        : undefined,
  };
}
