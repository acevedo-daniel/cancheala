import { User, Location, Category, Banner } from '../types';

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

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Fútbol',
    icon: '⚽',
  },
  {
    id: '2',
    name: 'Tenis',
    icon: '🎾',
  },
  {
    id: '3',
    name: 'Basketball',
    icon: '🏀',
  },
  {
    id: '4',
    name: 'Padel',
    icon: '🎯',
  },
];

export const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    title: '¡Bienvenido a Cancheala!',
    imageUrl: 'https://example.com/banner1.jpg',
  },
  {
    id: '2',
    title: 'Ofertas especiales',
    imageUrl: 'https://example.com/banner2.jpg',
  },
]; 