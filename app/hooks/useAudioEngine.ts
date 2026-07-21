import {useEffect, useRef} from 'react';
import {usePlayerStore} from '~/stores/playerStore';
import {emitPlayerEvent} from '~/services/audioAnalytics';

/**
 * Module-level singleton <audio> element.
 *
 * IMPORTANT: this file must stay the ONLY place that constructs `new
 * Audio()`. Do not instantiate audio elements inside components — Hydrogen
 * routes unmount/remount on navigation, and a second instance means two
 * overlapping playbacks plus duplicated analytics events.
 *
 * `typeof document === 'undefined'` guards SSR (Oxygen workers render this
 * module on the server where `Audio` does not exist).
 */
let audioEl: HTMLAudioElement | null = null;
function getAudioElement(): HTMLAudioElement | null {
  if (typeof document === 'undefined') return null;
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'metadata';
  }
  return audioEl;
}

/**
 * Mount this hook exactly once, in <GlobalPlayer />, which itself lives in
 * the root layout. It owns the <audio> element's event listeners and keeps
 * them in sync with playerStore. All other player components should read
 * from usePlayerStore and call its actions — they should never touch the
 * audio element directly.
 */
export function useAudioEngine() {
  const activeTrack = usePlayerStore((s) => s.activeTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);

  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setLoading = usePlayerStore((s) => s.setLoading);
  const playNext = usePlayerStore((s) => s.playNext);
  const pause = usePlayerStore((s) => s.pause);

  // Guards against race conditions when the user skips tracks quickly:
  // only the load initiated for the *current* track is allowed to affect
  // state by the time its events fire.
  const loadTokenRef = useRef(0);

  // Attach listeners once.
  useEffect(() => {
    const audio = getAudioElement();
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setLoading(false);
    };
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onEnded = () => {
      const track = usePlayerStore.getState().activeTrack;
      if (track) {
        emitPlayerEvent({name: 'track_completed', trackId: track.id});
      }
      const {repeatMode} = usePlayerStore.getState();
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        void audio.play().catch(() => undefined);
        return;
      }
      playNext();
    };
    const onError = () => {
      setLoading(false);
      pause();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
    // Listeners close over store getters/actions that are stable
    // (zustand action identities do not change), so this runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to track changes.
  useEffect(() => {
    const audio = getAudioElement();
    if (!audio || !activeTrack) return;

    const token = ++loadTokenRef.current;
    if (audio.src !== activeTrack.previewUrl) {
      setLoading(true);
      audio.src = activeTrack.previewUrl;
      audio.load();
    }

    if (isPlaying) {
      audio
        .play()
        .then(() => {
          if (token !== loadTokenRef.current) return; // a newer track won the race
          emitPlayerEvent({name: 'track_started', trackId: activeTrack.id});
        })
        .catch(() => {
          // Autoplay was blocked (e.g. mobile Safari before user gesture).
          // Reflect reality in the store instead of leaving isPlaying=true.
          if (token === loadTokenRef.current) pause();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrack?.id]);

  // React to play/pause toggles on the current track.
  useEffect(() => {
    const audio = getAudioElement();
    if (!audio || !activeTrack) return;
    if (isPlaying) {
      void audio.play().catch(() => pause());
    } else {
      audio.pause();
      emitPlayerEvent({name: 'track_paused', trackId: activeTrack.id, position: audio.currentTime});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Volume / mute.
  useEffect(() => {
    const audio = getAudioElement();
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  /** Imperative seek, called from <ProgressBar /> on scrub/click. */
  const seek = (seconds: number) => {
    const audio = getAudioElement();
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  return {seek};
}
