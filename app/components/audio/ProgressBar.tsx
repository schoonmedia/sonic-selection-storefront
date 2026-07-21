import {usePlayerStore} from '~/stores/playerStore';

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Scrub bar. Reads position from the store, seeks via the imperative
 * `seek` fn passed down from useAudioEngine (owned by GlobalPlayer).
 */
export function ProgressBar({seek}: {seek: (seconds: number) => void}) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="ss-progress">
      <span className="ss-progress__time">{formatTime(currentTime)}</span>
      <div className="ss-progress__track">
        <div className="ss-progress__fill" style={{width: `${pct}%`}} />
        <input
          className="ss-progress__input"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
        />
      </div>
      <span className="ss-progress__time">{formatTime(duration)}</span>
    </div>
  );
}
