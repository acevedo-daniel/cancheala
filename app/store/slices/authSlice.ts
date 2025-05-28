import { StateCreator } from 'zustand';
import { User } from '../../types';
import { AppState } from './types';

export interface AuthSlice {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const createAuthSlice: StateCreator<
  AppState,
  [],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
}); 