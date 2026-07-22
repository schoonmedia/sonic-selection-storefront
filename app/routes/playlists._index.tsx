import {useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/playlists._index';
import {usePlaylistStore} from '~/stores/playlistStore';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Sonic Selection | Playlists'}];
};

/**
 * Client-rendered on purpose, same reasoning as routes/favorites.tsx —
 * playlists live in playlistStore (localStorage + optional customer-
 * metafield sync, see docs/playlists-and-profile.md), which the server has
 * no access to.
 */
export default function PlaylistsIndex() {
  const playlists = usePlaylistStore((s) => s.playlists);
  const isHydrated = usePlaylistStore((s) => s.isHydrated);
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist);
  const deletePlaylist = usePlaylistStore((s) => s.deletePlaylist);
  const [newName, setNewName] = useState('');

  const ordered = [...playlists].sort((a, b) => b.updatedAt - a.updatedAt);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createPlaylist(name);
    setNewName('');
  };

  return (
    <div className="playlists-index">
      <h1>Playlists</h1>

      <div className="playlists-index__create">
        <input
          type="text"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Neue Playlist…"
          aria-label="Name der neuen Playlist"
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleCreate();
          }}
        />
        <button type="button" onClick={handleCreate} disabled={!newName.trim()}>
          Erstellen
        </button>
      </div>

      {!isHydrated ? (
        <p>Lade Playlists…</p>
      ) : ordered.length === 0 ? (
        <p className="playlists-index__empty">
          Noch keine Playlists. Klicke bei einem Track auf „+&rdquo;, um deine
          erste anzulegen.
        </p>
      ) : (
        <ul className="playlists-index__list">
          {ordered.map((playlist) => (
            <li key={playlist.id} className="playlists-index__row">
              <Link to={`/playlists/${playlist.id}`} prefetch="intent">
                {playlist.name}
                <span className="playlists-index__count">
                  {playlist.tracks.length} {playlist.tracks.length === 1 ? 'Track' : 'Tracks'}
                </span>
              </Link>
              <button
                type="button"
                className="playlists-index__delete"
                onClick={() => deletePlaylist(playlist.id)}
                aria-label={`Playlist ${playlist.name} löschen`}
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
