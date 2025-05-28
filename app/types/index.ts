// Tipos de navegación
export type RootStackParamList = {
  '(auth)': undefined;
  '(user)': undefined;
  '(owner)': undefined;
};

export type UserStackParamList = {
  'index': undefined;
  'welcome': undefined;
  'location-selection': undefined;
  'notifications': undefined;
  'advanced-search': undefined;
  'profile': undefined;
  'reserve': undefined;
  'my-reservations': undefined;
};

// Tipos de datos
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner';
}

export interface Location {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Banner {
  id: string;
  title: string;
  image: string | null;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Space {
  id: string;
  name: string;
  rating: number;
  location: string;
  images: string[];
  price: number;
  description: string;
  amenities: string[];
  sports: string[];
}

export interface Reservation {
  id: string;
  spaceId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}

// Enums
export enum UserRole {
  USER = 'user',
  OWNER = 'owner',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

// Tipos de estado
export interface AppState {
  user: User | null;
  location: Location | null;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
} 