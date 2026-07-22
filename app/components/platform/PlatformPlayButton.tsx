import {usePlayerStore} from '~/stores/playerStore';
import type {AudioProduct, AudioTrack} from '~/types/audio';
import type {PlatformAudioTrack} from '~/lib/platform/types';

/**
 * Adapts a platform-layer PlatformAudioTrack (producer/project/story/artist
 * pack preview) into the real player types and hands it to the existing
 * global `usePlayerStore` — the SAME store and SAME singleton <audio>
 * element used by product cards (see hooks/useAudioEngine.ts). This
 * component must never construct its own audio instance.
 *
 * Preview URLs in Phase 1 mock data are placeholders that don't resolve to
 * real files yet; clicking still exercises the full player (mini player
 * shows loading, then `useAudioEngine`'s `onError` handler pauses
 * gracefully) so this is safe to ship ahead of real audio uploads.
 */
function toPlayerTrack(track: PlatformAudioTrack): AudioTrack {
  return {
    id: track.id,
    title: track.title,
    previewUrl: track.previewUrl,
    duration: track.duration ?? 0,
    bpm: track.bpm,
    key: track.key,
    genre: track.genre,
    position: 0,
    productId: track.productId ?? track.id,
  };
}

function toPlayerProduct(track: PlatformAudioTrack, fallbackTitle: string): AudioProduct {
  return {
    id: track.productId ?? track.id,
    handle: track.productId ?? track.id,
    title: track.title || fallbackTitle,
    imageUrl: track.coverImage,
  };
}

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

export function PlatformPlayButton({
  track,
  contextTitle,
  size = 'md',
}: {
  /** Renders nothing when undefined — cards should only show a play button
   * when they actually have a related preview track. */
  track?: PlatformAudioTrack;
  contextTitle: string;
  size?: 'sm' | 'md';
}) {
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const loadProduct = usePlayerStore((s) => s.loadProduct);
  const togglePlay = usePlayerStore((s) => s.togglePlay);

  if (!track) return null;

  const isActive = activeTrack?.id === track.id;
  const showPlaying = isActive && isPlaying;
  const showLoading = isActive && isLoading;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isActive) {
      togglePlay();
      return;
    }
    loadProduct(toPlayerProduct(track, contextTitle), [toPlayerTrack(track)]);
  };

  return (
    <button
      type="button"
      className={`platform-play-button platform-play-button--${size}`}
      onClick={handleClick}
      aria-label={showPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      aria-pressed={showPlaying}
    >
      {showLoading ? <IconLoading /> : showPlaying ? <IconPause /> : <IconPlay />}
    </button>
  );
}
