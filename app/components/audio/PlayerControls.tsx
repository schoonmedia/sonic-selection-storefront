import {usePlayerStore} from '~/stores/playerStore';

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2.5h3v11H4v-11Zm5 0h3v11H9v-11Z" />
    </svg>
  );
}
function IconPrev() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 2.5v11H2.5v-11H4Zm10 0-8 5.5 8 5.5v-11Z" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5v11h1.5v-11H12ZM2 2.5l8 5.5-8 5.5v-11Z" />
    </svg>
  );
}

/**
 * Play/pause + prev/next transport controls. Pure presentation over
 * playerStore — no direct audio-element access (see useAudioEngine).
 */
export function PlayerControls() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isLoading = usePlayerStore((s) => s.isLoading);
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrevious = usePlayerStore((s) => s.playPrevious);

  const disabled = !activeTrack;

  return (
    <div className="ss-player-controls">
      <button
        type="button"
        className="ss-player-controls__btn"
        onClick={playPrevious}
        disabled={disabled}
        aria-label="Previous track"
      >
        <IconPrev />
      </button>
      <button
        type="button"
        className="ss-player-controls__btn ss-player-controls__play"
        onClick={togglePlay}
        disabled={disabled}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        aria-busy={isLoading}
      >
        {isPlaying ? <IconPause /> : <IconPlay />}
      </button>
      <button
        type="button"
        className="ss-player-controls__btn"
        onClick={playNext}
        disabled={disabled}
        aria-label="Next track"
      >
        <IconNext />
      </button>
    </div>
  );
}
