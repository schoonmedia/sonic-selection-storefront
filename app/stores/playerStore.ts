import {create} from 'zustand';
import type {
  AudioProduct,
  AudioTrack,
  PlayerState,
  RepeatMode,
} from '~/types/audio';

export interface PlayerActions {
  /** Load a product + its tracklist and start playing a given track (or the first one). */
  loadProduct: (product: AudioProduct, playlist: AudioTrack[], startTrack?: AudioTrack) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  playTrack: (track: AudioTrack) => void;
  playNext: () => void;
  playPrevious: () => void;
  setCurrentTime: (seconds: number) => void;
  setDuration: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  addToQueue: (track: AudioTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  setLoading: (isLoading: boolean) => void;
  /** Used once by usePlayerPersistence after reading localStorage on mount. */
  hydrate: (partial: Partial<PlayerState>) => void;
  reset: () => void;
}

export type PlayerStore = PlayerState & PlayerActions;

const initialState: PlayerState = {
  activeProduct: null,
  activeTrack: null,
  playlist: [],
  queue: [],
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  repeatMode: 'off',
  isHydrated: false,
};

/**
 * Single global player store. There must only ever be one instance of this
 * store and one <audio> element for it (see hooks/useAudioEngine.ts) —
 * do not create per-component audio elements.
 */
export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  loadProduct: (product, playlist, startTrack) => {
    const track = startTrack ?? playlist[0] ?? null;
    set({
      activeProduct: product,
      playlist,
      activeTrack: track,
      currentTime: 0,
      isPlaying: Boolean(track),
      isLoading: Boolean(track),
    });
  },

  play: () => set({isPlaying: true}),
  pause: () => set({isPlaying: false}),
  togglePlay: () => set((s) => ({isPlaying: !s.isPlaying})),

  playTrack: (track) => {
    const {activeTrack} = get();
    if (activeTrack?.id === track.id) {
      set({isPlaying: true});
      return;
    }
    set({activeTrack: track, currentTime: 0, isPlaying: true, isLoading: true});
  },

  playNext: () => {
    const {playlist, queue, activeTrack, repeatMode} = get();
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      set({activeTrack: next, queue: rest, currentTime: 0, isPlaying: true, isLoading: true});
      return;
    }
    const idx = playlist.findIndex((t) => t.id === activeTrack?.id);
    const next = playlist[idx + 1];
    if (next) {
      set({activeTrack: next, currentTime: 0, isPlaying: true, isLoading: true});
    } else if (repeatMode === 'playlist' && playlist.length > 0) {
      set({activeTrack: playlist[0], currentTime: 0, isPlaying: true, isLoading: true});
    } else {
      set({isPlaying: false, currentTime: 0});
    }
  },

  playPrevious: () => {
    const {playlist, activeTrack} = get();
    const idx = playlist.findIndex((t) => t.id === activeTrack?.id);
    const prev = playlist[idx - 1];
    if (prev) {
      set({activeTrack: prev, currentTime: 0, isPlaying: true, isLoading: true});
    } else {
      // No previous track: restart current one instead of jumping products.
      set({currentTime: 0});
    }
  },

  setCurrentTime: (seconds) => set({currentTime: seconds}),
  setDuration: (seconds) => set({duration: seconds}),
  setVolume: (volume) => set({volume: Math.min(1, Math.max(0, volume)), isMuted: volume === 0}),
  toggleMute: () => set((s) => ({isMuted: !s.isMuted})),
  setRepeatMode: (repeatMode) => set({repeatMode}),

  addToQueue: (track) => set((s) => ({queue: [...s.queue, track]})),
  removeFromQueue: (trackId) =>
    set((s) => ({queue: s.queue.filter((t) => t.id !== trackId)})),
  clearQueue: () => set({queue: []}),

  setLoading: (isLoading) => set({isLoading}),

  hydrate: (partial) => set({...partial, isHydrated: true}),

  reset: () => set({...initialState, isHydrated: true}),
}));
