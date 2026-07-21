import {useState} from 'react';
import {usePlayerStore} from '~/stores/playerStore';

/**
 * Collapsible list of user-queued tracks, anchored above the mini player.
 * Purely a store consumer — playing a queued track directly is handled by
 * removing everything before it and calling playNext(), keeping queue
 * order semantics in one place (playerStore.playNext).
 */
export function QueueDrawer() {
  const [open, setOpen] = useState(false);
  const queue = usePlayerStore((s) => s.queue);
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);

  if (queue.length === 0) return null;

  return (
    <>
      <button
        type="button"
        className="ss-player-controls__btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Toggle queue"
      >
        Queue ({queue.length})
      </button>
      {open && (
        <div className="ss-queue-drawer" role="dialog" aria-label="Playback queue">
          <div className="ss-queue-drawer__row">
            <strong>Queue</strong>
            <button type="button" className="ss-player-controls__btn" onClick={clearQueue}>
              Clear
            </button>
          </div>
          {queue.map((track) => (
            <div
              key={track.id}
              className="ss-queue-drawer__row"
              data-active={track.id === activeTrack?.id}
            >
              <span>{track.title}</span>
              <button
                type="button"
                className="ss-player-controls__btn"
                onClick={() => removeFromQueue(track.id)}
                aria-label={`Remove ${track.title} from queue`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
