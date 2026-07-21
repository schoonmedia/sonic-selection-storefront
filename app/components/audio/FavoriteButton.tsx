import {useFavoritesStore} from '~/stores/favoritesStore';
import {emitPlayerEvent} from '~/services/audioAnalytics';

function IconHeart({filled}: {filled: boolean}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M8 13.6s-5.6-3.5-5.6-7.3C2.4 3.9 4.2 2.4 6.1 2.4c1 0 1.7.5 1.9 1 .2-.5 1-1 1.9-1 1.9 0 3.7 1.4 3.7 3.9 0 3.8-5.6 7.3-5.6 7.3Z" />
    </svg>
  );
}

/**
 * Heart toggle for favoriting a product. Reads/writes the client-only
 * favoritesStore (localStorage-backed, see hooks/useFavoritesPersistence.ts)
 * — no Shopify customer account required. Drop this next to
 * <ProductPlayButton> on product cards and the PDP; keep it out of any
 * wrapping <Link> so clicking it doesn't also navigate.
 */
export function FavoriteButton({productId}: {productId: string}) {
  const isFavorite = useFavoritesStore((s) =>
    s.favorites.some((f) => f.productId === productId),
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const handleClick = () => {
    const nextIsFavorite = !isFavorite;
    toggleFavorite(productId);
    emitPlayerEvent({
      name: nextIsFavorite ? 'favorite_added' : 'favorite_removed',
      productId,
    });
  };

  return (
    <button
      type="button"
      className="ss-favorite-button"
      data-active={isFavorite}
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
    >
      <IconHeart filled={isFavorite} />
    </button>
  );
}
