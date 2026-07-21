import {useEffect} from 'react';
import {usePlayerStore} from '~/stores/playerStore';

/**
 * Wires the Media Session API (lock-screen / hardware-key playback
 * controls) to the player store. Safe to mount unconditionally — it no-ops
 * where `navigator.mediaSession` doesn't exist (SSR, older browsers).
 */
export function useMediaSession(seek: (seconds: number) => void) {
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const activeProduct = usePlayerStore((s) => s.activeProduct);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrevious = usePlayerStore((s) => s.playPrevious);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (!activeTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeTrack.title,
      artist: activeProduct?.title ?? 'Sonic Selection',
      album: 'Sonic Selection',
      artwork: activeProduct?.imageUrl
        ? [{src: activeProduct.imageUrl, sizes: '512x512', type: 'image/png'}]
        : [],
    });

    navigator.mediaSession.setActionHandler('play', () => play());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (typeof details.seekTime === 'number') seek(details.seekTime);
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [activeTrack, activeProduct, play, pause, playNext, playPrevious, seek]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (!duration || Number.isNaN(duration)) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(currentTime, duration),
        playbackRate: 1,
      });
    } catch {
      // Some browsers throw if position > duration transiently mid-seek.
    }
  }, [currentTime, duration]);
}
