import {create} from 'zustand';
import type {PersistedFavoriteEntry} from '~/services/favoritesStorage';

export type FavoriteEntry = PersistedFavoriteEntry;

interface FavoritesState {
  favorites: FavoriteEntry[];
  /** True once read from localStorage (see useFavoritesPersistence). */
  isHydrated: boolean;
}

interface FavoritesActions {
  toggleFavorite: (productId: string) => void;
  hydrate: (entries: FavoriteEntry[]) => void;
}

export type FavoritesStore = FavoritesState & FavoritesActions;

/**
 * Single global favorites store, same one-instance pattern as
 * stores/playerStore.ts. Components should read via selectors
 * (e.g. `useFavoritesStore((s) => s.favorites.some((f) => f.productId === id))`)
 * rather than calling a getter method, so they re-render on change.
 */
export const useFavoritesStore = create<FavoritesStore>((set) => ({
  favorites: [],
  isHydrated: false,

  toggleFavorite: (productId) =>
    set((s) => {
      const exists = s.favorites.some((f) => f.productId === productId);
      return {
        favorites: exists
          ? s.favorites.filter((f) => f.productId !== productId)
          : [...s.favorites, {productId, addedAt: Date.now()}],
      };
    }),

  hydrate: (entries) => set({favorites: entries, isHydrated: true}),
}));
