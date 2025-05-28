import { create } from 'zustand';
import { AppState } from './slices/types';
import { createAuthSlice, AuthSlice } from './slices/authSlice';

interface AppStore extends AppState, AuthSlice {
  // UI State
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  // Location State
  setLocation: (location: Location | null) => void;
  setSelectedCategory: (category: string | null) => void;
  // Reset
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  location: null,
  selectedCategory: null,
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppStore>()((set) => ({
  ...initialState,
  ...createAuthSlice(set),

  // UI Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Location Actions
  setLocation: (location) => set({ location }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  // Reset
  reset: () => set(initialState),
})); 