import { User, Location, Category, Banner, Space, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: UserRole.USER,
    firstName: 'Juan',
    lastName: 'Pérez',
    isGoogleUser: false
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    role: UserRole.OWNER,
    firstName: 'María',
    lastName: 'García',
    isGoogleUser: true
  },
];

export const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Ubicación 1',
    address: 'Av. Siempreviva 742',
    coordinates: {
      latitude: -34.603722,
      longitude: -58.381592,
    }
  },
  {
    id: '2',
    name: 'Ubicación 2',
    address: 'Calle Falsa 123',
    coordinates: {
      latitude: -34.603722,
      longitude: -58.381592,
    }
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
  {
    id: '1',
    name: 'Cancha Central',
    rating: 4.5,
    location: 'Buenos Aires',
    address: 'Falucho 257',
    image: require('../assets/padel1.png'), 
  },
  {
    id: '2',
    name: 'Club Deportivo',
    rating: 4.8,
    location: 'Buenos Aires',
    address: 'Av. Rivadavia 1234',
    image: require('../assets/padel2.png'),
  },
  {
    id: '3',
    name: 'Polideportivo',
    rating: 4.2,
    location: 'Buenos Aires',
    address: 'Calle Principal 789',
    image: require('../assets/padel3.png'),
  },
];

