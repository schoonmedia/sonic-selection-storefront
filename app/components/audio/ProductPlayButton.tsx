import {usePlayerStore} from '~/stores/playerStore';
import type {AudioProduct, AudioTrack} from '~/types/audio';
import {emitPlayerEvent} from '~/services/audioAnalytics';

function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2.5h3v11H4v-11Zm5 0h3v11H9v-11Z" />
    </svg>
  );
}
function IconLoading() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="28"
        strokeDashoffset="10"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/**
 * Drop this into ProductItem / product detail pages. It renders one of
 * play / pause / loading based on *global* player state — i.e. it knows
 * whether this specific product+track is the one currently active,
 * distinct from every other play button on the page.
 */
export function ProductPlayButton({
  product,
  playlist,
  track,
}: {
  product: AudioProduct;
  playlist: AudioTrack[];
  track?: AudioTrack;
}) {
  const activeProduct = usePlayerStore((s) => s.activeProduct);
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const loadProduct = usePlayerStore((s) => s.loadProduct);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const targetTrack = track ?? playlist[0];
  const isActiveTrack = activeTrack?.id === targetTrack?.id && activeProduct?.id === product.id;
  const showPlaying = isActiveTrack && isPlaying;
  const showLoading = isActiveTrack && isLoading;

  const handleClick = () => {
    if (!targetTrack) return;

    if (isActiveTrack) {
      togglePlay();
      return;
    }

    if (activeProduct?.id === product.id) {
      playTrack(targetTrack);
    } else {
      loadProduct(product, playlist, targetTrack);
      emitPlayerEvent({name: 'product_opened', productId: product.id, trackId: targetTrack.id});
    }
  };

  return (
    <button
      type="button"
      className="ss-play-button"
      data-active={isActiveTrack}
      data-loading={showLoading}
      onClick={handleClick}
      disabled={!targetTrack}
      aria-label={showPlaying ? `Pause ${targetTrack?.title}` : `Play ${targetTrack?.title}`}
      aria-pressed={showPlaying}
    >
      {showLoading ? <IconLoading /> : showPlaying ? <IconPause /> : <IconPlay />}
    </button>
  );
}
