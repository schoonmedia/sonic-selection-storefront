import {usePlayerStore} from '~/stores/playerStore';

/**
 * Lightweight placeholder waveform: evenly spaced bars whose fill reflects
 * playback progress. Real per-track waveform data (peaks array) isn't part
 * of the Phase-1 metaobject yet — swap the `bars` generation for decoded
 * peak data once that field exists, the fill-by-progress logic stays.
 */
export function Waveform({barCount = 48}: {barCount?: number}) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const pct = duration > 0 ? currentTime / duration : 0;

  // Deterministic pseudo-random heights so the bar pattern is stable across
  // re-renders without needing real peak data yet.
  const bars = Array.from({length: barCount}, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    const frac = seed - Math.floor(seed);
    return 20 + frac * 80; // 20%..100% height
  });

  return (
    <div
      style={{display: 'flex', alignItems: 'flex-end', gap: 2, height: 32, width: '100%'}}
      aria-hidden="true"
    >
      {bars.map((h, i) => {
        const played = i / barCount < pct;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: 1,
              background: played ? 'var(--ss-lime)' : 'var(--ss-slate)',
              transition: 'background 0.1s linear',
            }}
          />
        );
      })}
    </div>
  );
}
