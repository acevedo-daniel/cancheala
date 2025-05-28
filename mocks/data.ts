import { User, Location, Category, Banner, Space } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'user',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    role: 'owner',
  },
];

export const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    address: 'Av. Siempreviva 742',
    latitude: -34.603722,
    longitude: -58.381592,
  },
  {
    id: '2',
    address: 'Calle Falsa 123',
    latitude: -34.603722,
    longitude: -58.381592,
  },
];

export const BANNERS: Banner[] = [
  { id: '1', title: 'Promociones destacadas', image: null },
  { id: '2', title: 'Nuevos espacios', image: null },
  { id: '3', title: 'Eventos especiales', image: null },
  { id: '4', title: 'Espacios populares', image: null },
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Fútbol', icon: 'football-outline' },
  { id: '2', name: 'Tenis', icon: 'tennisball-outline' },
  { id: '3', name: 'Básquet', icon: 'basketball-outline' },
  { id: '4', name: 'Pádel', icon: 'baseball-outline' },
  { id: '5', name: 'Vóley', icon: 'basketball-outline' },
];

export const SPACES: Space[] = [
  { id: '1', name: 'Cancha Central', rating: 4.5, location: 'Falucho 257' },
  { id: '2', name: 'Club Deportivo', rating: 4.8, location: 'Av. Rivadavia 1234' },
  { id: '3', name: 'Polideportivo', rating: 4.2, location: 'Calle Principal 789' },
]; 