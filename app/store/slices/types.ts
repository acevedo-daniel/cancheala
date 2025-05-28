import { User, Location } from '../../types';

export interface AppState {
  user: User | null;
  location: Location | null;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
} 