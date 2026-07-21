import {usePlayerStore} from '~/stores/playerStore';
import {PlayerControls} from '~/components/audio/PlayerControls';
import {ProgressBar} from '~/components/audio/ProgressBar';
import {Waveform} from '~/components/audio/Waveform';

/**
 * Full-bleed "now playing" overlay, opened from the mini player (desktop
 * click on art/title, mobile swipe-up — wiring for that trigger lives in
 * GlobalPlayer). Phase-1 stub: shows artwork, waveform, controls. Queue
 * management within this view can reuse <QueueDrawer />.
 */
export function ExpandedPlayer({
  seek,
  onClose,
}: {
  seek: (seconds: number) => void;
  onClose: () => void;
}) {
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const activeProduct = usePlayerStore((s) => s.activeProduct);

  if (!activeTrack) return null;

  return (
    <div
      role="dialog"
      aria-label="Now playing"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'var(--ss-black)',
        color: 'var(--ss-light)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: 24,
      }}
    >
      <button
        type="button"
        className="ss-player-controls__btn"
        onClick={onClose}
        aria-label="Close now playing"
        style={{position: 'absolute', top: 20, right: 20}}
      >
        ✕
      </button>

      {activeProduct?.imageUrl ? (
        <img
          src={activeProduct.imageUrl}
          alt=""
          width={280}
          height={280}
          style={{borderRadius: 12, objectFit: 'cover'}}
        />
      ) : (
        <div
          style={{width: 280, height: 280, borderRadius: 12, background: 'var(--ss-slate)'}}
        />
      )}

      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 18, fontWeight: 700}}>{activeTrack.title}</div>
        <div style={{fontSize: 14, opacity: 0.6}}>{activeProduct?.title}</div>
      </div>

      <div style={{width: '100%', maxWidth: 480}}>
        <Waveform />
      </div>

      <div style={{width: '100%', maxWidth: 480}}>
        <ProgressBar seek={seek} />
      </div>

      <PlayerControls />
    </div>
  );
}
