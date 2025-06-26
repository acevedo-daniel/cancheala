
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

// Tipos de datos
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isGoogleUser: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Banner {
  id: string;
  title: string;
  image: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

import { ImageSourcePropType } from 'react-native';

export type Space = {
  id: string;
  name: string;
  rating: number;
  location: string;
  address: string;
  image: ImageSourcePropType; // ✅ Tipo correcto
};


export interface Reservation {
  id: string;
  spaceId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  totalPrice: number;
}

// Tipos de estado
export interface AppState {
  user: User | null;
  location: Location | null;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
}
