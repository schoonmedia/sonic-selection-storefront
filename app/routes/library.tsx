import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/library';
import {useFavoritesStore} from '~/stores/favoritesStore';
import {useHistoryStore} from '~/stores/historyStore';
import {usePlaylistStore} from '~/stores/playlistStore';
import {ProductItem} from '~/components/ProductItem';
import {ProductPlayButton} from '~/components/audio/ProductPlayButton';
import {mapAudioTracks, toAudioProduct} from '~/lib/audioTracks';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Mediathek'}];
};

const FAVORITES_PREVIEW_COUNT = 8;
const HISTORY_PREVIEW_COUNT = 8;

/**
 * Aggregated "Mediathek" — one landing page for everything the visitor has
 * collected: Playlists, Favoriten, Zuletzt gehört. Each section shows a
 * preview and links out to its full page (/playlists, /favorites already
 * exist and keep their full management UI — this page doesn't duplicate
 * delete/rename logic, just gives a single overview + entry point, per the
 * "Player ist das Herz der Plattform" profile vision).
 *
 * Client-rendered like the other library routes: all three sources
 * (favoritesStore, historyStore, playlistStore) live in localStorage /
 * customer metafields, not server-fetchable in a loader.
 */
export default function Library() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const favoritesHydrated = useFavoritesStore((s) => s.isHydrated);

  const history = useHistoryStore((s) => s.history);
  const historyHydrated = useHistoryStore((s) => s.isHydrated);

  const playlists = usePlaylistStore((s) => s.playlists);
  const playlistsHydrated = usePlaylistStore((s) => s.isHydrated);

  const isHydrated = favoritesHydrated && historyHydrated && playlistsHydrated;

  const orderedFavoriteIds = useMemo(
    () => [...favorites].sort((a, b) => b.addedAt - a.addedAt).map((f) => f.productId),
    [favorites],
  );
  const orderedPlaylists = useMemo(
    () => [...playlists].sort((a, b) => b.updatedAt - a.updatedAt),
    [playlists],
  );

  // One combined product lookup for everything this page needs to render:
  // favorite products, history products, and every product referenced by a
  // playlist track — avoids three separate round trips.
  const combinedIdsKey = useMemo(() => {
    const ids = new Set<string>();
    for (const id of orderedFavoriteIds) ids.add(id);
    for (const entry of history) ids.add(entry.productId);
    for (const playlist of playlists) {
      for (const track of playlist.tracks) ids.add(track.productId);
    }
    return Array.from(ids).join(',');
  }, [orderedFavoriteIds, history, playlists]);

  const [productsById, setProductsById] = useState<Map<
    string,
    CollectionItemFragment
  > | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    if (!combinedIdsKey) {
      setProductsById(new Map());
      return;
    }

    let cancelled = false;
    fetch(`/api/audio-products?ids=${encodeURIComponent(combinedIdsKey)}`)
      .then((res) =>
        res.ok
          ? (res.json() as Promise<{products?: CollectionItemFragment[]}>)
          : {products: []},
      )
      .then((data) => {
        if (cancelled) return;
        setProductsById(new Map((data.products ?? []).map((p) => [p.id, p])));
      })
      .catch(() => {
        if (!cancelled) setProductsById(new Map());
      });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, combinedIdsKey]);

  const isLoading = !isHydrated || productsById === null;

  const favoriteProducts = isLoading
    ? []
    : orderedFavoriteIds
        .map((id) => productsById!.get(id))
        .filter((p): p is CollectionItemFragment => Boolean(p));

  const historyItems = isLoading
    ? []
    : history
        .slice(0, HISTORY_PREVIEW_COUNT)
        .map((entry) => {
          const raw = productsById!.get(entry.productId);
          if (!raw) return null;
          const tracks = mapAudioTracks(raw.audioTracks, raw.id);
          const track = tracks.find((t) => t.id === entry.trackId) ?? tracks[0];
          if (!track) return null;
          return {product: toAudioProduct(raw), track, playlist: tracks};
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="library">
      <h1>Mediathek</h1>
      <p className="library__intro">
        Alles, was du gesammelt hast — an einem Ort.
      </p>

      {isLoading ? (
        <p>Lade Mediathek…</p>
      ) : (
        <>
          <LibrarySection
            title="Zuletzt gehört"
            emptyText="Noch nichts gehört. Sobald du einen Track abspielst, taucht er hier auf."
            viewAllTo={null}
          >
            {historyItems.length > 0 && (
              <div className="library__history-row">
                {historyItems.map(({product, track, playlist}) => (
                  <div key={`${product.id}-${track.id}`} className="library__history-item">
                    <ProductPlayButton product={product} playlist={playlist} track={track} />
                    <div className="library__history-meta">
                      <Link
                        className="library__history-title"
                        to={`/products/${product.handle}`}
                        prefetch="intent"
                      >
                        {product.title}
                      </Link>
                      <span className="library__history-track">{track.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </LibrarySection>

          <LibrarySection
            title="Playlists"
            emptyText="Noch keine Playlists. Klicke bei einem Track auf „+&rdquo;, um deine erste anzulegen."
            viewAllTo="/playlists"
            viewAllLabel="Playlists verwalten"
          >
            {orderedPlaylists.length > 0 && (
              <ul className="library__playlists-list">
                {orderedPlaylists.slice(0, 6).map((playlist) => (
                  <li key={playlist.id}>
                    <Link to={`/playlists/${playlist.id}`} prefetch="intent">
                      {playlist.name}
                      <span className="library__playlists-count">
                        {playlist.tracks.length}{' '}
                        {playlist.tracks.length === 1 ? 'Track' : 'Tracks'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </LibrarySection>

          <LibrarySection
            title="Favoriten"
            emptyText="Noch keine Favoriten. Tippe auf das Herz-Symbol an einem Sound Pack, um es hier zu sammeln."
            viewAllTo={favoriteProducts.length > FAVORITES_PREVIEW_COUNT ? '/favorites' : null}
            viewAllLabel="Alle Favoriten anzeigen"
          >
            {favoriteProducts.length > 0 && (
              <div className="products-grid">
                {favoriteProducts.slice(0, FAVORITES_PREVIEW_COUNT).map((product) => (
                  <ProductItem key={product.id} product={product} loading="lazy" />
                ))}
              </div>
            )}
          </LibrarySection>
        </>
      )}
    </div>
  );
}

function LibrarySection({
  title,
  emptyText,
  viewAllTo,
  viewAllLabel,
  children,
}: {
  title: string;
  emptyText: string;
  viewAllTo: string | null;
  viewAllLabel?: string;
  children: React.ReactNode;
}) {
  const hasContent = Boolean(children);

  return (
    <section className="library__section">
      <div className="library__section-header">
        <h2>{title}</h2>
        {viewAllTo && (
          <Link to={viewAllTo} prefetch="intent" className="library__section-link">
            {viewAllLabel ?? 'Alle anzeigen'} →
          </Link>
        )}
      </div>
      {hasContent ? children : <p className="library__section-empty">{emptyText}</p>}
    </section>
  );
}
