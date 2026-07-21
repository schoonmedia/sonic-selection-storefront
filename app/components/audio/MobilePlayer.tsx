import {usePlayerStore} from '~/stores/playerStore';
import {PlayerControls} from '~/components/audio/PlayerControls';

/**
 * Compact mobile bar: art, title, play/pause only — no scrub/volume (those
 * live in <ExpandedPlayer />, opened by tapping this bar). Rendered instead
 * of <MiniPlayer /> below the `640px` breakpoint by <GlobalPlayer />.
 */
export function MobilePlayer({onExpand}: {onExpand: () => void}) {
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const activeProduct = usePlayerStore((s) => s.activeProduct);

  if (!activeTrack) return null;

  return (
    <div
      className="ss-mini-player"
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onExpand();
      }}
    >
      <div className="ss-mini-player__track">
        {activeProduct?.imageUrl ? (
          <img className="ss-mini-player__art" src={activeProduct.imageUrl} alt="" width={44} height={44} />
        ) : (
          <div className="ss-mini-player__art" />
        )}
        <div style={{minWidth: 0}}>
          <div className="ss-mini-player__title">{activeTrack.title}</div>
        </div>
      </div>
      {/* Stop click-through to onExpand when using transport controls.
          onClickCapture (not onClick) so this stays a plain, non-interactive
          wrapper for a11y-lint purposes — the actual interactive elements
          are the buttons inside <PlayerControls />. */}
      <div onClickCapture={(e) => e.stopPropagation()}>
        <PlayerControls />
      </div>
    </div>
  );
}
