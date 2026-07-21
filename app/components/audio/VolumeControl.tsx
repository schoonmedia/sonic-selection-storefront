import {usePlayerStore} from '~/stores/playerStore';

function IconVolume({muted}: {muted: boolean}) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2v-5Zm9.5.5 3 3m0-3-3 3" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2v-5Z" />
      <path d="M10.5 5.8a3.2 3.2 0 0 1 0 4.4M12.3 4a5.8 5.8 0 0 1 0 8" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function VolumeControl() {
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);

  const pct = isMuted ? 0 : volume * 100;

  return (
    <div className="ss-volume">
      <button
        type="button"
        className="ss-player-controls__btn"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <IconVolume muted={isMuted} />
      </button>
      <div className="ss-volume__track">
        <div className="ss-volume__fill" style={{width: `${pct}%`}} />
        <input
          className="ss-volume__input"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
