import { Dimensions } from 'react-native';

// Dimensiones
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Colores
export const COLORS = {
  primary: '#00C853',
  secondary: '#007AFF',
  background: '#FFFFFF',
  text: {
    primary: '#000000',
    secondary: '#666666',
    light: '#FFFFFF',
  },
  border: '#F0F0F0',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  rating: '#FFD700',
} as const;

// Espaciado
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// Bordes
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Sombras
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// Tipografía
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
} as const;

// Rutas
export const ROUTES = {
  AUTH: {
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
  },
  USER: {
    HOME: '/(user)',
    WELCOME: '/(user)/welcome',
    LOCATION_SELECTION: '/(user)/location-selection',
    NOTIFICATIONS: '/(user)/notifications',
    ADVANCED_SEARCH: '/(user)/advanced-search',
    PROFILE: '/(user)/profile',
    RESERVE: '/(user)/reserve',
    MY_RESERVATIONS: '/(user)/my-reservations',
  },
  OWNER: {
    HOME: '/(owner)',
    SPACES: '/(owner)/spaces',
    RESERVATIONS: '/(owner)/reservations',
    PROFILE: '/(owner)/profile',
  },
} as const;

// Textos
export const TEXTS = {
  COMMON: {
    LOADING: 'Cargando...',
    ERROR: 'Ha ocurrido un error',
    RETRY: 'Reintentar',
    SAVE: 'Guardar',
    CANCEL: 'Cancelar',
    CONFIRM: 'Confirmar',
  },
  AUTH: {
    LOGIN: 'Iniciar sesión',
    REGISTER: 'Registrarse',
    FORGOT_PASSWORD: '¿Olvidaste tu contraseña?',
  },
  USER: {
    WELCOME: '¡Bienvenido!',
    WELCOME_SUBTITLE: 'Reserva tu cancha favorita y disfruta del deporte',
    SEARCH_PLACEHOLDER: 'Buscar canchas, deportes...',
    CATEGORIES: 'Categorías',
    NEARBY_SPACES: 'Espacios cerca de ti',
  },
} as const;
