import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/playlists.$id';
import {usePlaylistStore} from '~/stores/playlistStore';
import {usePlayerStore} from '~/stores/playerStore';
import {mapAudioTracks} from '~/lib/audioTracks';
import {ProductPlayButton} from '~/components/audio/ProductPlayButton';
import {formatTime} from '~/components/audio/ProgressBar';
import type {AudioProduct, AudioTrack} from '~/types/audio';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Playlist'}];
};

/**
 * Client-rendered, same reasoning as playlists._index.tsx. A playlist can
 * span multiple products/packs, so playback uses a synthetic AudioProduct
 * (id `playlist:<id>`) rather than any single track's real product — the
 * player store only needs a stable id + display fields, and playNext/
 * playPrevious just index into the `playlist` AudioTrack[] regardless of
 * which real product each track belongs to (see stores/playerStore.ts).
 */
export default function PlaylistDetail({params}: Route.ComponentProps) {
  const playlistId = params.id;
  const playlist = usePlaylistStore((s) => s.playlists.find((p) => p.id === playlistId));
  const isHydrated = usePlaylistStore((s) => s.isHydrated);
  const removeTrackFromPlaylist = usePlaylistStore((s) => s.removeTrackFromPlaylist);
  const activeTrack = usePlayerStore((s) => s.activeTrack);

  const [tracksById, setTracksById] = useState<Map<string, AudioTrack> | null>(null);

  const productIdsKey = useMemo(
    () => Array.from(new Set((playlist?.tracks ?? []).map((t) => t.productId))).join(','),
    [playlist?.tracks],
  );

  useEffect(() => {
    if (!isHydrated || !playlist) return;
    if (!productIdsKey) {
      setTracksById(new Map());
      return;
    }

    let cancelled = false;
    fetch(`/api/audio-products?ids=${encodeURIComponent(productIdsKey)}`)
      .then((res) =>
        res.ok ? (res.json() as Promise<{products?: CollectionItemFragment[]}>) : {products: []},
      )
      .then((data) => {
        if (cancelled) return;
        const map = new Map<string, AudioTrack>();
        for (const product of data.products ?? []) {
          for (const track of mapAudioTracks(product.audioTracks, product.id)) {
            map.set(track.id, track);
          }
        }
        setTracksById(map);
      })
      .catch(() => {
        if (!cancelled) setTracksById(new Map());
      });

    return () => {
      cancelled = true;
    };
  }, [isHydrated, playlist, productIdsKey]);

  if (!isHydrated || tracksById === null) {
    return (
      <div className="playlist-detail">
        <p>Lade Playlist…</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-detail">
        <p>Playlist nicht gefunden.</p>
        <Link to="/playlists">Zurück zu Playlists</Link>
      </div>
    );
  }

  const orderedTracks = playlist.tracks
    .map((ref) => tracksById.get(ref.trackId))
    .filter((track): track is AudioTrack => Boolean(track));

  const syntheticProduct: AudioProduct = {
    id: `playlist:${playlist.id}`,
    handle: playlist.id,
    title: playlist.name,
  };

  return (
    <div className="playlist-detail">
      <Link to="/playlists" className="playlist-detail__back">
        ← Playlists
      </Link>
      <h1>{playlist.name}</h1>
      <p className="playlist-detail__meta">
        {orderedTracks.length} {orderedTracks.length === 1 ? 'Track' : 'Tracks'}
      </p>

      {orderedTracks.length === 0 ? (
        <p className="playlist-detail__empty">
          Noch keine Tracks. Klicke bei einem Sound Pack auf „+&rdquo; neben einem
          Track, um ihn hier hinzuzufügen.
        </p>
      ) : (
        <ul className="playlist-detail__list">
          {orderedTracks.map((track) => (
            <li
              key={track.id}
              className="playlist-detail__row"
              data-active={activeTrack?.id === track.id}
            >
              <ProductPlayButton product={syntheticProduct} playlist={orderedTracks} track={track} />
              <span className="playlist-detail__title">{track.title}</span>
              <span className="playlist-detail__duration">{formatTime(track.duration)}</span>
              <button
                type="button"
                className="playlist-detail__remove"
                onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}
                aria-label={`${track.title} aus Playlist entfernen`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
