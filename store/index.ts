import { create } from 'zustand';
import { AppState, User, Location } from '../types';

interface AppStore extends AppState {
  // Acciones
  setUser: (user: User | null) => void;
  setLocation: (location: Location | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  location: null,
  selectedCategory: null,
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  setLocation: (location) => set({ location }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
})); 