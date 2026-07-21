import {useEffect, useState} from 'react';
import type {Route} from './+types/favorites';
import {useFavoritesStore} from '~/stores/favoritesStore';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Favoriten'}];
};

/**
 * Client-rendered on purpose: favorites live in localStorage
 * (favoritesStore, see hooks/useFavoritesPersistence.ts), which the server
 * has no access to. Once hydrated, this re-fetches the full product data
 * for the favorited IDs via /api/audio-products (same resource route used
 * to rehydrate the player after reload) so cards show current
 * price/image/tracks rather than stale persisted data.
 */
export default function Favorites() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const isHydrated = useFavoritesStore((s) => s.isHydrated);

  const [products, setProducts] = useState<CollectionItemFragment[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Newest-favorited first; stable string key so the fetch effect only
  // re-runs when the actual set of ids changes, not on every store update.
  const orderedIds = [...favorites]
    .sort((a, b) => b.addedAt - a.addedAt)
    .map((f) => f.productId);
  const idsKey = orderedIds.join(',');

  useEffect(() => {
    if (!isHydrated) return;

    if (orderedIds.length === 0) {
      setProducts([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/audio-products?ids=${encodeURIComponent(idsKey)}`)
      .then((res) =>
        res.ok
          ? (res.json() as Promise<{products?: CollectionItemFragment[]}>)
          : {products: []},
      )
      .then((data) => {
        if (cancelled) return;
        const byId = new Map((data.products ?? []).map((p) => [p.id, p]));
        // Re-apply favorited order; fetched order isn't guaranteed to match.
        const ordered = orderedIds
          .map((id) => byId.get(id))
          .filter((p): p is CollectionItemFragment => Boolean(p));
        setProducts(ordered);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, idsKey]);

  return (
    <div className="favorites">
      <h1>Favoriten</h1>
      {!isHydrated || isLoading ? (
        <p>Lade Favoriten…</p>
      ) : !products || products.length === 0 ? (
        <p className="favorites__empty">
          Noch keine Favoriten. Tippe auf das Herz-Symbol an einem Sound Pack,
          um es hier zu sammeln.
        </p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} loading="lazy" />
          ))}
        </div>
      )}
    </div>
  );
}
