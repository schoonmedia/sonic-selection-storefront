import {create} from 'zustand';
import {MAX_HISTORY, type PersistedHistoryEntry} from '~/services/historyStorage';

export type HistoryEntry = PersistedHistoryEntry;

interface HistoryState {
  history: HistoryEntry[];
  /** True once read from localStorage (see useHistoryPersistence). */
  isHydrated: boolean;
}

interface HistoryActions {
  /** Records (or bumps) a play. Dedupes by productId — replaying a product
   * moves it back to the front with its latest track, rather than showing
   * the same product twice in "Zuletzt gehört". */
  addEntry: (productId: string, trackId: string) => void;
  hydrate: (entries: HistoryEntry[]) => void;
}

export type HistoryStore = HistoryState & HistoryActions;

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  isHydrated: false,

  addEntry: (productId, trackId) =>
    set((s) => {
      const withoutExisting = s.history.filter((h) => h.productId !== productId);
      const next = [{productId, trackId, playedAt: Date.now()}, ...withoutExisting];
      return {history: next.slice(0, MAX_HISTORY)};
    }),

  hydrate: (entries) => set({history: entries, isHydrated: true}),
}));
