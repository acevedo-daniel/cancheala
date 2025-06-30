import { User, Location, Category, Banner, Space, UserRole, Event, EventType } from '../types';

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
  { 
    id: '1', 
    title: 'Promociones destacadas', 
    image: require('../assets/images/chica-posando-lentes-tennis.jpg') 
  },
  { 
    id: '2', 
    title: 'Nuevos espacios', 
    image: require('../assets/images/chica-espaldas-tennis.jpg') 
  },
  { 
    id: '3', 
    title: 'Eventos especiales', 
    image: require('../assets/images/chica-vestido-tennis.jpg') 
  },
  { 
    id: '4', 
    title: 'Espacios populares', 
    image: require('../assets/images/alejandro-galan-federico-chingotto-qatar-major-padel-2025.avif') 
  },
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Más cerca', icon: 'location-outline' },
  { id: '2', name: 'Mejor precio', icon: 'pricetag-outline' },
  { id: '3', name: 'Disponible ahora', icon: 'time-outline' },
];


export const SPACES = [
  {
    id: '1',
    name: 'Las Cortadas Padel Club',
    rating: 4.5,
    location: 'San Lorenzo 555, Resistencia Chaco',
    address: 'Faluco 257',
    image: require('../assets/padel1.png'),
  },
  {
    id: '2',
    name: 'HD Padel',
    rating: 9.8,
    location: 'Jose Hernandez 567, Resistencia Chaco',
    address: 'Av. Rivadavia 1234',
    image: require('../assets/padel2.png'),
  },
  {
    id: '3',
    name: 'Central Norte Padel Club',
    rating: 8.2,
    location: 'Av Hernandarias, Resistencia Chaco',
    address: 'Calle Principal 789',
    image: require('../assets/padel3.png'),
  },
];

// Datos mock para eventos/notificaciones
export const EVENTS: Event[] = [
  {
    id: '1',
    title: '🎾 Torneo de Pádel Primavera 2025',
    description: '¡Participa en nuestro torneo de pádel de primavera! Premios para los ganadores y descuentos especiales para participantes. Inscripciones abiertas hasta el 15 de marzo.',
    type: EventType.TOURNAMENT,
    image: require('../assets/images/padel1.png'),
    date: '2025-03-20',
    startDate: '2025-03-20',
    endDate: '2025-03-22',
    location: 'Club Deportivo Central',
    price: 1500,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: '🔥 50% OFF en Canchas Premium',
    description: 'Aprovecha nuestro descuento especial del 50% en todas las canchas premium durante los fines de semana. Válido hasta el 28 de febrero.',
    type: EventType.PROMOTION,
    image: require('../assets/images/padel2.png'),
    date: '2025-02-28',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    discount: 50,
    isActive: true,
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: '3',
    title: '🏆 Liga Amateur de Pádel 2025',
    description: 'Inscríbete en nuestra liga amateur de pádel. Compite durante 8 semanas y gana premios increíbles. Niveles: principiante, intermedio y avanzado.',
    type: EventType.TOURNAMENT,
    image: require('../assets/images/padel3.png'),
    date: '2025-04-01',
    startDate: '2025-04-01',
    endDate: '2025-05-20',
    location: 'Polideportivo Municipal',
    price: 800,
    isActive: true,
    createdAt: '2025-01-10T14:30:00Z',
  },
  {
    id: '4',
    title: '🆕 Nuevas Canchas de Pádel',
    description: '¡Estrenamos 4 nuevas canchas de pádel con tecnología de última generación! Reserva tu turno inaugural con un 25% de descuento.',
    type: EventType.NEWS,
    image: require('../assets/images/padel1.png'),
    date: '2025-02-15',
    startDate: '2025-02-15',
    endDate: '2025-03-15',
    location: 'Centro Deportivo Nuevo',
    discount: 25,
    isActive: true,
    createdAt: '2025-01-20T16:00:00Z',
  },
  {
    id: '5',
    title: '⚡ Oferta Flash: 2x1 en Reservas',
    description: '¡Oferta flash por tiempo limitado! Reserva 2 horas y paga solo 1. Válido solo para hoy de 18:00 a 22:00.',
    type: EventType.SPECIAL_OFFER,
    image: require('../assets/images/padel2.png'),
    date: '2025-01-25',
    startDate: '2025-01-25T18:00:00Z',
    endDate: '2025-01-25T22:00:00Z',
    discount: 100,
    isActive: true,
    createdAt: '2025-01-25T12:00:00Z',
  },
  {
    id: '6',
    title: '🔧 Mantenimiento Programado',
    description: 'Las canchas 1 y 2 estarán cerradas para mantenimiento el próximo lunes de 8:00 a 12:00. Disculpa las molestias.',
    type: EventType.MAINTENANCE,
    date: '2025-01-27',
    startDate: '2025-01-27T08:00:00Z',
    endDate: '2025-01-27T12:00:00Z',
    location: 'Canchas 1 y 2',
    isActive: true,
    createdAt: '2025-01-22T09:00:00Z',
  },
];
