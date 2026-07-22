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
 * Tracks how long a track was *actually audible* in the current listen —
 * distinct from `position` (last known playhead), since seeking around
 * doesn't reset it. Wall-clock based (Date.now() deltas between play and
 * pause/track-switch/track-end), not audio-time based, which is the right
 * measure for "was this engaged with" analytics.
 *
 * Module-level (like audioEl) so it survives whichever component instance
 * currently mounts useAudioEngine, and is a single source of truth shared
 * by the two effects below that can each start/stop a segment.
 */
let listenSegment: {
  trackId: string;
  productId?: string;
  durationSec: number;
  segmentStartedAt: number | null;
  accumulatedMs: number;
} | null = null;

function startListenSegment() {
  if (listenSegment && listenSegment.segmentStartedAt == null) {
    listenSegment.segmentStartedAt = Date.now();
  }
}

/** Finalizes the current segment (if any) and emits a listen-duration
 *  event for it. Call on pause, track switch, and track completion. */
function finalizeListenSegment(name: 'track_paused' | 'track_completed', position?: number) {
  const seg = listenSegment;
  if (!seg) return;
  if (seg.segmentStartedAt != null) {
    seg.accumulatedMs += Date.now() - seg.segmentStartedAt;
    seg.segmentStartedAt = null;
  }
  if (seg.accumulatedMs <= 0) return;
  const percentComplete =
    seg.durationSec > 0 ? Math.min(1, seg.accumulatedMs / 1000 / seg.durationSec) : undefined;
  emitPlayerEvent({
    name,
    trackId: seg.trackId,
    productId: seg.productId,
    position,
    listenedMs: Math.round(seg.accumulatedMs),
    percentComplete,
  });
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
      // Resume from a persisted position (see usePlayerPersistence). Normal
      // track changes (playTrack/loadProduct/playNext/playPrevious) always
      // reset the store's currentTime to 0 first, so this is a no-op for
      // every case except rehydration-after-reload.
      const resumeAt = usePlayerStore.getState().currentTime;
      if (resumeAt > 0 && Math.abs(audio.currentTime - resumeAt) > 0.5) {
        audio.currentTime = resumeAt;
      }
    };
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onEnded = () => {
      finalizeListenSegment('track_completed', audio.currentTime);
      const {repeatMode} = usePlayerStore.getState();
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        if (listenSegment) listenSegment.accumulatedMs = 0;
        void audio.play().catch(() => undefined);
        startListenSegment();
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

    // Skipping/auto-advancing to a new track doesn't always go through an
    // explicit pause — finalize whatever the previous track accumulated
    // before starting a fresh segment for this one.
    if (listenSegment && listenSegment.trackId !== activeTrack.id) {
      finalizeListenSegment('track_paused');
    }
    listenSegment = {
      trackId: activeTrack.id,
      productId: usePlayerStore.getState().activeProduct?.id,
      durationSec: activeTrack.duration,
      segmentStartedAt: null,
      accumulatedMs: 0,
    };

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
          emitPlayerEvent({
            name: 'track_started',
            trackId: activeTrack.id,
            productId: usePlayerStore.getState().activeProduct?.id,
          });
          startListenSegment();
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
      startListenSegment();
    } else {
      audio.pause();
      finalizeListenSegment('track_paused', audio.currentTime);
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

  /** Imperative seek, called from <ProgressBar /> on scrub/click. Doesn't
   *  touch the listen-duration accumulator — scrubbing around is still
   *  "engaged listening" time, just emits its own event for skip-pattern
   *  analysis (e.g. "everyone skips the first 8 bars"). */
  const seek = (seconds: number) => {
    const audio = getAudioElement();
    if (!audio || !activeTrack) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
    emitPlayerEvent({
      name: 'track_seeked',
      trackId: activeTrack.id,
      productId: usePlayerStore.getState().activeProduct?.id,
      position: seconds,
    });
  };

  return {seek};
}
