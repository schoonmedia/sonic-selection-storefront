import {useState} from 'react';
import {usePlaylistStore} from '~/stores/playlistStore';

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Small "+" button next to a track that opens a popover listing the
 * visitor's playlists (localStorage-backed, see stores/playlistStore.ts —
 * synced to their account if logged in, see usePlaylistPersistence). Click
 * a playlist to add/remove this track from it; a name field at the bottom
 * creates a new one and adds the track in one step.
 *
 * Same "no login required, works instantly" philosophy as FavoriteButton —
 * playlists are visitor-owned, not gated behind an account.
 */
export function AddToPlaylistButton({
  trackId,
  productId,
  trackTitle,
}: {
  trackId: string;
  productId: string;
  trackTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const playlists = usePlaylistStore((s) => s.playlists);
  const createPlaylist = usePlaylistStore((s) => s.createPlaylist);
  const addTrackToPlaylist = usePlaylistStore((s) => s.addTrackToPlaylist);
  const removeTrackFromPlaylist = usePlaylistStore((s) => s.removeTrackFromPlaylist);

  const handleCreateAndAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const id = createPlaylist(name);
    addTrackToPlaylist(id, trackId, productId);
    setNewName('');
    setOpen(false);
  };

  return (
    <span className="add-to-playlist">
      <button
        type="button"
        className="add-to-playlist__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${trackTitle} zu Playlist hinzufügen`}
        title="Zu Playlist hinzufügen"
      >
        <IconPlus />
      </button>
      {open && (
        <div className="add-to-playlist__panel" role="dialog" aria-label="Zu Playlist hinzufügen">
          {playlists.length === 0 ? (
            <p className="add-to-playlist__empty">Noch keine Playlists.</p>
          ) : (
            <ul className="add-to-playlist__list">
              {playlists.map((playlist) => {
                const inPlaylist = playlist.tracks.some((t) => t.trackId === trackId);
                return (
                  <li key={playlist.id}>
                    <button
                      type="button"
                      className="add-to-playlist__item"
                      data-active={inPlaylist}
                      onClick={() =>
                        inPlaylist
                          ? removeTrackFromPlaylist(playlist.id, trackId)
                          : addTrackToPlaylist(playlist.id, trackId, productId)
                      }
                    >
                      {inPlaylist ? '✓ ' : ''}
                      {playlist.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="add-to-playlist__new">
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Neue Playlist…"
              aria-label="Name der neuen Playlist"
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleCreateAndAdd();
              }}
            />
            <button type="button" onClick={handleCreateAndAdd} disabled={!newName.trim()}>
              Erstellen
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
