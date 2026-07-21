import {usePlayerStore} from '~/stores/playerStore';
import {PlayerControls} from '~/components/audio/PlayerControls';
import {ProgressBar} from '~/components/audio/ProgressBar';
import {VolumeControl} from '~/components/audio/VolumeControl';

/**
 * The always-visible bottom bar (desktop). Renders nothing (collapses to
 * height 0 via the parent) until a track has been loaded, so it doesn't
 * take up space on a fresh session before the user presses play anywhere.
 */
export function MiniPlayer({seek}: {seek: (seconds: number) => void}) {
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const activeProduct = usePlayerStore((s) => s.activeProduct);

  if (!activeTrack) return null;

  return (
    <div className="ss-mini-player">
      <div className="ss-mini-player__track">
        {activeProduct?.imageUrl ? (
          <img
            className="ss-mini-player__art"
            src={activeProduct.imageUrl}
            alt=""
            width={44}
            height={44}
          />
        ) : (
          <div className="ss-mini-player__art" />
        )}
        <div style={{minWidth: 0}}>
          <div className="ss-mini-player__title">{activeTrack.title}</div>
          <div className="ss-mini-player__subtitle ss-mini-player__meta-secondary">
            {activeProduct?.title}
          </div>
        </div>
      </div>

      <div className="ss-mini-player__center">
        <PlayerControls />
        <ProgressBar seek={seek} />
      </div>

      <div className="ss-mini-player__end ss-mini-player__meta-secondary">
        <VolumeControl />
      </div>
    </div>
  );
}
