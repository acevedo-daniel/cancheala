import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Button,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
  ImageSourcePropType,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Banner, Space } from '../../types';
import { BANNERS, SPACES } from '../../mocks/data';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING, COLORS } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppStore } from '../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const availableHours = Array.from({ length: 13 }, (_, i) => {
  const hour = (14 + i) % 24;
  return `${hour.toString().padStart(2, '0')}:00`;
});

// 1. DEFINICIÓN DEL TIPO CANCHA (puede ir arriba de HomeScreen)
type Cancha = {
  id: string;
  nombre: string;
  imageUri: ImageSourcePropType;
  precio: string;
  descripcion: string;
  direccionTexto: string;
  ubicacionMapa: { latitude: number; longitude: number } | null;
  puntuacion: number;
  suelo?: 'césped' | 'hormigón' | 'madera';
  disponible?: boolean;
  horarios?: string;
  especificaciones: string[];
};

// 2. MOCK DE CANCHAS (puedes reemplazar por fetch real si lo deseas)
const MOCK_CANCHAS: Cancha[] = [
  {
    id: '1',
    nombre: 'HD Padel',
    imageUri: require('../../assets/images/blindex1.png'),
    precio: '14000',
    descripcion: 'Cancha techada, césped sintético, iluminación incluida.',
    direccionTexto: 'Av. Siempre Viva 123',
    ubicacionMapa: { latitude: -34.6037, longitude: -58.3816 },
    puntuacion: 9.2,
    suelo: 'césped',
    disponible: true,
    horarios: '08:00 - 23:00',
    especificaciones: ['Techada', 'Iluminación incluida', 'Venta de pelotitas'],
  },
  {
    id: '2',
    nombre: 'Fluix Padel',
    imageUri: require('../../assets/images/blindex2.png'),
    precio: '16000',
    descripcion: 'Cancha techada, césped sintético, iluminación incluida.',
    direccionTexto: 'Calle Falsa 456',
    ubicacionMapa: { latitude: -34.6038, longitude: -58.3820 },
    puntuacion: 8.7,
    suelo: 'césped',
    disponible: false,
    horarios: '09:00 - 22:00',
    especificaciones: ['Techada', 'Iluminación incluida'],
  },
  {
    id: '3',
    nombre: 'SanFer Padel',
    imageUri: require('../../assets/images/blindex3.png'),
    precio: '11000',
    descripcion: 'Cancha techada, césped sintético, iluminación incluida.',
    direccionTexto: 'Ruta 8 km 45',
    ubicacionMapa: { latitude: -34.6040, longitude: -58.3830 },
    puntuacion: 9.5,
    suelo: 'césped',
    disponible: true,
    horarios: '07:00 - 00:00',
    especificaciones: ['Techada', 'Iluminación incluida', 'Kiosco'],
  },
  // Cemento
  {
    id: '4',
    nombre: 'Las Cortadas',
    imageUri: require('../../assets/images/material1.png'),
    precio: '8000',
    descripcion: 'Cancha de cemento techada, iluminación incluida.',
    direccionTexto: 'Calle Cemento 123',
    ubicacionMapa: { latitude: -34.6050, longitude: -58.3840 },
    puntuacion: 8.9,
    suelo: 'hormigón',
    disponible: true,
    horarios: '08:00 - 22:00',
    especificaciones: ['Techada', 'Iluminación incluida', 'Venta de pelotitas'],
  },
  {
    id: '5',
    nombre: 'Loxor Padel',
    imageUri: require('../../assets/images/material2.png'),
    precio: '9000',
    descripcion: 'Cancha de cemento techada, iluminación incluida.',
    direccionTexto: 'Calle Cemento 456',
    ubicacionMapa: { latitude: -34.6060, longitude: -58.3850 },
    puntuacion: 8.3,
    suelo: 'hormigón',
    disponible: false,
    horarios: '09:00 - 21:00',
    especificaciones: ['Techada', 'Iluminación incluida'],
  },
  {
    id: '6',
    nombre: 'Diefer Padel',
    imageUri: require('../../assets/images/material3.png'),
    precio: '7000',
    descripcion: 'Cancha de cemento techada, iluminación incluida.',
    direccionTexto: 'Calle Cemento 789',
    ubicacionMapa: { latitude: -34.6070, longitude: -58.3860 },
    puntuacion: 8.1,
    suelo: 'hormigón',
    disponible: true,
    horarios: '10:00 - 20:00',
    especificaciones: ['Techada', 'Iluminación incluida', 'Kiosco'],
  },
];

// ESTADO PARA FILTRO DE DISPONIBILIDAD
type DisponibilidadFiltro = 'todas' | 'disponibles' | 'ocupadas';

// 3. DEFINICIÓN DE CATEGORÍAS CON COLORES Y DESCRIPCIÓN
const CATEGORIES = [
  {
    id: 'blindex',
    name: 'Blindex',
    icon: 'layers-outline',
    color: '#4ADE80',
    description: 'Canchas con paredes de blindex (vidrio) y césped sintético.'
  },
  {
    id: 'cemento',
    name: 'Cemento',
    icon: 'grid-outline',
    color: '#A1A1B3',
    description: 'Canchas de cemento, ideales para juego rápido.'
  },
  {
    id: 'techada',
    name: 'Techadas',
    icon: 'home-outline',
    color: '#60A5FA',
    description: 'Canchas techadas para jugar sin preocuparte por el clima.'
  },
  {
    id: 'cafeteria',
    name: 'Con cafetería',
    icon: 'cafe-outline',
    color: '#FFD600',
    description: 'Canchas con cafetería o bar para disfrutar antes o después.'
  },
  {
    id: 'pet',
    name: 'Pet friendly',
    icon: 'paw-outline',
    color: '#F472B6',
    description: 'Espacios donde podés venir con tu mascota.'
  },
  {
    id: 'parking',
    name: 'Estacionamiento',
    icon: 'car-outline',
    color: '#00C853',
    description: 'Canchas con estacionamiento propio.'
  },
];

// Componente para cada categoría (con animación, tooltip y color personalizado)
function CategoryCard({ item, onPress }: { item: typeof CATEGORIES[0], onPress: () => void }) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <View style={{ alignItems: 'center', marginRight: 16 }}>
      <Pressable
        onPressIn={() => Animated.spring(scale, { toValue: 0.93, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onLongPress={() => setShowTooltip(true)}
        onPress={onPress}
        style={({ pressed }) => [{
          backgroundColor: item.color,
          borderRadius: 18,
          width: 64,
          height: 64,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: pressed ? 4 : 2,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
        }]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name={item.icon as any} size={32} color="#fff" />
        </Animated.View>
      </Pressable>
      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#222', marginTop: 6 }}>{item.name}</Text>
      {showTooltip && (
        <View style={{ position: 'absolute', top: 70, left: -30, backgroundColor: '#222', padding: 8, borderRadius: 8, zIndex: 10, maxWidth: 120 }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>{item.description}</Text>
          <Pressable onPress={() => setShowTooltip(false)} style={{ position: 'absolute', top: 2, right: 4 }}>
            <Ionicons name="close" size={14} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

// Reemplazar la fila de imágenes de personas por un carrusel horizontal con autoplay
const PERSON_IMAGES = [
  require('../../assets/images/persona1 (1).png'),
  require('../../assets/images/persona2 (1).png'),
  require('../../assets/images/persona3 (1).png'),
  require('../../assets/images/persona4 (1).png'),
  require('../../assets/images/persona5 (1).png'),
];

const PERSON_TEXTS = [
  '¡Reserva tu cancha!',
  'Jugá con amigos',
  'Promos exclusivas',
  '¡Sumate a la comunidad!',
  'Descubrí nuevas canchas',
];

// Mapeo de íconos y colores para especificaciones
const ESPEC_ICONS: { [key: string]: { icon: string; color: string } } = {
  'Techada': { icon: 'home', color: '#F44336' },
  'Iluminación incluida': { icon: 'bulb', color: '#FFD600' },
  'Césped sintético': { icon: 'square', color: '#8BC34A' },
  'Venta de pelotitas': { icon: 'tennisball', color: '#2196F3' },
  'Venta de grips para paletas': { icon: 'albums', color: '#FFC107' },
  'Kiosco con insumos deportivos': { icon: 'cart', color: '#E57373' },
};

// Añadir utilitario arriba del componente principal
function getImageSource(image: any) {
  if (!image) return require('../../assets/images/placeholder.png');
  if (typeof image === 'number') return image; // require()
  if (typeof image === 'string') return { uri: image };
  if (image.uri) return { uri: image.uri };
  return require('../../assets/images/placeholder.png');
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  // ESTADO PARA MODALES DE CANCHA
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [canchaDetalle, setCanchaDetalle] = useState<Cancha | null>(null);
  const [canchaReservando, setCanchaReservando] = useState<Cancha | null>(null);
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('');
  // ESTADO PARA FILTRO DE TIPO DE CANCHA
  const [tipoFiltro, setTipoFiltro] = useState<'todas' | 'blindex' | 'cemento'>('todas');
  // ESTADO PARA FILTRO DE DISPONIBILIDAD
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState<DisponibilidadFiltro>('todas');
  // Estado para validación visual
  const [reservaError, setReservaError] = useState<string>('');
  const location = useAppStore(state => state.location);

  // Resetear categoría seleccionada cuando vuelvas al home
  useFocusEffect(
    React.useCallback(() => {
      setSelectedCategory(null);
    }, []),
  );

  // Al montar, cargar filtros guardados
  useEffect(() => {
    (async () => {
      const tipo = await AsyncStorage.getItem('filtro_tipo');
      const disp = await AsyncStorage.getItem('filtro_disp');
      if (tipo) setTipoFiltro(tipo as any);
      if (disp) setDisponibilidadFiltro(disp as DisponibilidadFiltro);
    })();
  }, []);

  // Guardar filtros al cambiar
  useEffect(() => {
    AsyncStorage.setItem('filtro_tipo', tipoFiltro);
  }, [tipoFiltro]);
  useEffect(() => {
    AsyncStorage.setItem('filtro_disp', disponibilidadFiltro);
  }, [disponibilidadFiltro]);

  const handleReservePress = (space: Space) => {
    setSelectedSpace(space);
    setModalVisible(true);
    setSelectedHours([]);
  };

  const handleBannerChange = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / SCREEN_WIDTH);
    setCurrentBanner(currentIndex);
  };

  const renderBanner = ({ item }: { item: Banner }) => (
    <View style={styles.banner}>
      {item.image && (
        <Image
          source={item.image}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerText}>{item.title}</Text>
      </View>
    </View>
  );

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const [showTooltip, setShowTooltip] = useState(false);
    return (
      <View style={{ alignItems: 'center', marginRight: 16 }}>
        <Pressable
          onPressIn={() => Animated.spring(scale, { toValue: 0.93, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
          onLongPress={() => setShowTooltip(true)}
          onPress={() => setTipoFiltro(item.id as any)}
          style={({ pressed }) => [{
            backgroundColor: item.color,
            borderRadius: 18,
            width: 64,
            height: 64,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: pressed ? 4 : 2,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }]}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons name={item.icon as any} size={32} color="#fff" />
          </Animated.View>
        </Pressable>
        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#222', marginTop: 6 }}>{item.name}</Text>
        {showTooltip && (
          <View style={{ position: 'absolute', top: 70, left: -30, backgroundColor: '#222', padding: 8, borderRadius: 8, zIndex: 10, maxWidth: 120 }}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{item.description}</Text>
            <Pressable onPress={() => setShowTooltip(false)} style={{ position: 'absolute', top: 2, right: 4 }}>
              <Ionicons name="close" size={14} color="#fff" />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  const renderSpace = ({ item }: { item: (typeof SPACES)[0] }) => {
    const formatDistance = (m: number) =>
      m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
    const price = '$1.500';
    const promoColors = [
      '#FFE066', // Amarillo
      '#4ADE80', // Verde
      '#60A5FA', // Azul
      '#F472B6', // Rosa
      '#A1A1B3', // Gris
    ];

    return (
      <View style={{ marginBottom: 28 }}>
        {/* Badge flotante como parte del flujo normal */}
        {item.statusTag && (
          <View style={styles.statusTagInline}>
            <Text
              style={styles.statusTagTextV2}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.statusTag}
            </Text>
          </View>
        )}
        <View style={styles.nearbyCardV3}>
          <View style={{ position: 'relative', overflow: 'visible' }}>
            <Image source={getImageSource(item.image)} style={styles.nearbyImageV3} />
          </View>
          <View style={styles.nearbyInfoV3}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.nearbyNameV2} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={{ flex: 1 }} />
              <Ionicons
                name="star"
                size={16}
                color="#181829"
                style={{ marginRight: 2 }}
              />
              <Text style={styles.nearbyRatingV2}>
                {item.rating.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.nearbyTypeV2}>{item.type}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 2,
              }}
            >
              <Ionicons
                name="navigate-outline"
                size={14}
                color="#A1A1B3"
                style={{ marginRight: 2 }}
              />
              <Text style={styles.nearbyDataV2}>
                {formatDistance(item.distance)}
              </Text>
              <Text style={styles.nearbyDotV2}>·</Text>
              <Ionicons
                name="pricetag-outline"
                size={14}
                color="#A1A1B3"
                style={{ marginRight: 2 }}
              />
              <Text style={styles.nearbyDataV2}>{price}</Text>
            </View>
            {/* Promos chips */}
            <View
              style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' }}
            >
              {item.promos &&
                item.promos.map((promo, idx) => (
                  <View
                    key={promo}
                    style={[
                      styles.promoChipV2,
                      {
                        backgroundColor: promoColors[idx % promoColors.length],
                      },
                    ]}
                  >
                    <Text style={styles.promoChipTextV2} numberOfLines={1}>
                      {promo}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // HANDLERS
  const handleVerDetalle = (cancha: Cancha) => {
    setCanchaDetalle(cancha);
    setModalDetalleVisible(true);
  };
  const handleReservar = (cancha: Cancha) => {
    setCanchaReservando(cancha);
    setModalReservaVisible(true);
  };
  const confirmarReserva = () => {
    if (selectedHours.length === 0) {
      setReservaError('Por favor selecciona al menos un horario');
      return;
    }
    setReservaError('');
    setModalReservaVisible(false);
    setSelectedHours([]);
    if (!selectedDate) return;
    alert('Reserva confirmada para ' + canchaReservando?.nombre + ' el ' + selectedDate.toLocaleDateString() + ' a las ' + selectedHours.join(', '));
  };

  // Animación para las tarjetas de canchas
  const animatedValues = useRef(MOCK_CANCHAS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(120, animatedValues.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    )).start();
  }, []);

  // Animación de scale para botones
  const useButtonScale = () => {
    const scale = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scale, { toValue: 0.93, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    return { scale, onPressIn, onPressOut };
  };

  // Animación para modales
  const modalAnim = useRef(new Animated.Value(0)).current;
  const animateModalIn = () => {
    modalAnim.setValue(0);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const animateModalOut = (callback: () => void) => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => callback());
  };

  // Componente separado para la tarjeta de cancha (dentro de HomeScreen para acceso a hooks y funciones)
  function CanchaCard({ item, index, onVerDetalle, onReservar, animatedValue }: {
    item: Cancha;
    index: number;
    onVerDetalle: (item: Cancha) => void;
    onReservar: (item: Cancha) => void;
    animatedValue: Animated.Value;
  }) {
    const detalleBtn = useButtonScale();
    const reservarBtn = useButtonScale();
    return (
      <Animated.View
        style={{
          opacity: animatedValue,
          transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
        }}
      >
        <View style={styles.canchaCard}>
          <View>
            <Image source={getImageSource(item.imageUri)} style={styles.canchaImage} />
            {/* Overlay nombre y precio */}
            <View style={styles.canchaOverlay}>
              <Text style={styles.canchaNombre}>{item.nombre}</Text>
              <Text style={styles.canchaPrecio}>${item.precio}</Text>
            </View>
            {/* Rating */}
            <View style={styles.canchaRating}>
              <Ionicons name="star" size={13} color="#fff" />
              <Text style={styles.canchaRatingText}>{item.puntuacion}</Text>
            </View>
            {/* Suelo */}
            {item.suelo && (
              <View style={styles.canchaSuelo}>
                <Ionicons name="layers-outline" size={12} color="#2196f3" />
                <Text style={styles.canchaSueloText}>{item.suelo}</Text>
              </View>
            )}
          </View>
          <View style={styles.canchaButtonsRow}>
            <Animated.View style={{ transform: [{ scale: detalleBtn.scale }] }}>
              <TouchableOpacity
                style={styles.canchaButtonDetalle}
                onPress={() => { detalleBtn.onPressOut(); onVerDetalle(item); animateModalIn(); }}
                onPressIn={detalleBtn.onPressIn}
                onPressOut={detalleBtn.onPressOut}
              >
                <Ionicons name="information-circle-outline" size={16} color="#007bff" />
                <Text style={styles.canchaButtonDetalleText}>Ver detalles</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: reservarBtn.scale }] }}>
              <TouchableOpacity
                style={[styles.canchaButtonReservar, { backgroundColor: item.disponible ? '#4CAF50' : '#ccc' }]}
                onPress={() => { reservarBtn.onPressOut(); onReservar(item); animateModalIn(); }}
                onPressIn={reservarBtn.onPressIn}
                onPressOut={reservarBtn.onPressOut}
                disabled={!item.disponible}
              >
                <Text style={styles.canchaButtonReservarText}>{item.disponible ? 'Reservar' : 'Ocupada'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    );
  }

  // Filtrar canchas por tipo
  const canchasBlindex = MOCK_CANCHAS.filter(c => c.suelo === 'césped');
  const canchasCemento = MOCK_CANCHAS.filter(c => c.suelo === 'hormigón');

  // Filtrar canchas según tipo y disponibilidad
  const canchasFiltradas = MOCK_CANCHAS.filter(c => {
    let tipoOk = true;
    if (tipoFiltro === 'blindex') tipoOk = c.suelo === 'césped';
    if (tipoFiltro === 'cemento') tipoOk = c.suelo === 'hormigón';
    let dispOk = true;
    if (disponibilidadFiltro === 'disponibles') dispOk = !!c.disponible;
    if (disponibilidadFiltro === 'ocupadas') dispOk = !c.disponible;
    return tipoOk && dispOk;
  });

  // Estado para DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Lógica para días disponibles según la cancha (ejemplo: solo lunes a sábado)
  function isDayAvailable(date: Date, cancha: Cancha | null) {
    if (!cancha) return false;
    // Ejemplo: si la cancha solo abre de lunes a sábado
    // 0 = domingo, 6 = sábado
    const day = date.getDay();
    // Aquí podrías usar cancha.horarios para lógica real
    return day !== 0; // No domingos
  }

  const carouselVisible = useRef(new Animated.Value(0)).current;
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    Animated.timing(carouselVisible, {
      toValue: Math.max(0, Math.min(120, y)),
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [carouselVisible]);

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.md,
            paddingTop: 18,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => router.push('/(user)/location-selection')}
          >
            <Text
              style={{ color: '#181028', fontWeight: 'bold', fontSize: 16 }}
            >
              {location?.name || 'Selecciona ubicación'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#181028"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(user)/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#181028" />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: SPACING.md }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 32,
              paddingHorizontal: 20,
              paddingVertical: 10,
              shadowColor: '#000',
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 1,
              borderWidth: 1,
              borderColor: '#e5e5e5',
            }}
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <Text
              style={{
                flex: 1,
                color: '#888999',
                fontSize: 17,
                fontWeight: '500',
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              Buscar canchas, deportes...
            </Text>
            <Ionicons name="search" size={20} color="#888999" />
          </TouchableOpacity>
        </View>
        <Animated.View style={{
          opacity: carouselVisible.interpolate({ inputRange: [0, 10, 20], outputRange: [1, 0.5, 0] }),
          height: carouselVisible.interpolate({ inputRange: [0, 10, 20], outputRange: [110, 60, 0] }),
          marginBottom: carouselVisible.interpolate({ inputRange: [0, 10, 20], outputRange: [10, 5, 0] }),
          overflow: 'hidden',
          marginTop: 18
        }}>
          <FlatList
            data={PERSON_IMAGES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={{ marginRight: 16 }}>
                <Image
                  source={getImageSource(item)}
                  style={{ width: 170, height: 110, borderRadius: 18, resizeMode: 'cover' }}
                />
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </Animated.View>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
          {/* Banners */}
          <View style={styles.bannerContainer}>
            <FlatList
              data={BANNERS}
              renderItem={renderBanner}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleBannerChange}
              style={styles.bannerList}
              keyExtractor={(item) => item.id}
            />
            <View style={styles.bannerPagination}>
              {BANNERS.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.bannerDot,
                    currentBanner === index && styles.bannerDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Filtros rápidos */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Explora por</Text>
            <FlatList
              data={CATEGORIES}
              renderItem={({ item }) => (
                <CategoryCard
                  item={item}
                  onPress={() => setTipoFiltro(item.id as any)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* Filtro visual arriba de la grilla */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 8 }}>
            {[
              { label: 'Todas', value: 'todas' },
              { label: 'Blindex', value: 'blindex' },
              { label: 'Cemento', value: 'cemento' },
            ].map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={{
                  backgroundColor: tipoFiltro === opt.value ? '#007bff' : '#eaf1fb',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                }}
                onPress={() => setTipoFiltro(opt.value as any)}
                activeOpacity={0.8}
              >
                <Text style={{ color: tipoFiltro === opt.value ? '#fff' : '#007bff', fontWeight: 'bold' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 8 }}>
            {[
              { label: 'Todas', value: 'todas' },
              { label: 'Disponibles', value: 'disponibles' },
              { label: 'Ocupadas', value: 'ocupadas' },
            ].map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={{
                  backgroundColor: disponibilidadFiltro === opt.value ? '#4CAF50' : '#eaf1fb',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                }}
                onPress={() => setDisponibilidadFiltro(opt.value as any)}
                activeOpacity={0.8}
              >
                <Text style={{ color: disponibilidadFiltro === opt.value ? '#fff' : '#4CAF50', fontWeight: 'bold' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SECCIÓN DE CANCHAS DISPONIBLES */}
          {tipoFiltro === 'todas' ? (
            <>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#181028', marginBottom: 8, marginLeft: 2 }}>
                Canchas Blindex
              </Text>
              <FlatList
                data={canchasBlindex}
                renderItem={({ item, index }) => (
                  <CanchaCard
                    item={item}
                    index={index}
                    onVerDetalle={handleVerDetalle}
                    onReservar={handleReservar}
                    animatedValue={animatedValues[index]}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10, gap: 12, paddingLeft: 8, paddingRight: 8 }}
                scrollEnabled={true}
              />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#181028', marginBottom: 8, marginLeft: 2, marginTop: 18 }}>
                Canchas Cemento
              </Text>
              <FlatList
                data={canchasCemento}
                renderItem={({ item, index }) => (
                  <CanchaCard
                    item={item}
                    index={index}
                    onVerDetalle={handleVerDetalle}
                    onReservar={handleReservar}
                    animatedValue={animatedValues[index]}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10, gap: 12, paddingLeft: 8, paddingRight: 8 }}
                scrollEnabled={true}
              />
            </>
          ) : tipoFiltro === 'blindex' ? (
            <FlatList
              data={canchasBlindex}
              renderItem={({ item, index }) => (
                <CanchaCard
                  item={item}
                  index={index}
                  onVerDetalle={handleVerDetalle}
                  onReservar={handleReservar}
                  animatedValue={animatedValues[index]}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10, gap: 12, paddingLeft: 8, paddingRight: 8 }}
              scrollEnabled={true}
            />
          ) : (
            <FlatList
              data={canchasCemento}
              renderItem={({ item, index }) => (
                <CanchaCard
                  item={item}
                  index={index}
                  onVerDetalle={handleVerDetalle}
                  onReservar={handleReservar}
                  animatedValue={animatedValues[index]}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10, gap: 12, paddingLeft: 8, paddingRight: 8 }}
              scrollEnabled={true}
            />
          )}
        </ScrollView>

        {/* MODAL DETALLE */}
        <Modal
          visible={modalDetalleVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalDetalleVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 22, padding: 24, width: '85%', maxHeight: '80%', alignItems: 'center', position: 'relative' }}>
              <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }} onPress={() => setModalDetalleVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#888" />
              </TouchableOpacity>
              {canchaDetalle && (
                <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                  <Image source={getImageSource(canchaDetalle.imageUri)} style={{ width: '100%', height: 140, borderRadius: 16, marginBottom: 16 }} resizeMode="cover" />
                  <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{canchaDetalle.nombre}</Text>
                  <View style={{ marginBottom: 10, width: '100%', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                      <Text style={{ fontSize: 16, color: '#2196f3', fontWeight: '600', marginRight: 4 }}>{Number(canchaDetalle.precio).toLocaleString()}$ s/luz</Text>
                      <Ionicons name="sunny" size={18} color="#FFD600" style={{ marginLeft: 2 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 16, color: '#222', fontWeight: '600', marginRight: 4 }}>{(Number(canchaDetalle.precio) + 2000).toLocaleString()}$ c/luz</Text>
                      <Ionicons name="moon" size={18} color="#222" style={{ marginLeft: 2 }} />
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#f7fafd', borderRadius: 16, padding: 12, width: '100%', marginBottom: 18 }}>
                    {canchaDetalle.especificaciones.map((esp, idx) => {
                      // Separar tipo y valor si viene como 'Superficie: Césped sintético'
                      let tipo = esp;
                      let valor = '';
                      if (esp.includes(':')) {
                        [tipo, valor] = esp.split(':').map(s => s.trim());
                      }
                      const iconData = ESPEC_ICONS[tipo] || { icon: 'information-circle', color: '#B0BEC5' };
                      return (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 }}>
                          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Ionicons name={iconData.icon} size={20} color={iconData.color} />
                          </View>
                          <Text style={{ fontSize: 15, color: '#222', flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>{tipo}</Text>{valor ? `: ${valor}` : ''}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <TouchableOpacity style={{ backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 14, width: '100%', alignItems: 'center', marginTop: 4 }} onPress={() => { setModalDetalleVisible(false); setModalReservaVisible(true); }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Reservar Ahora</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
        {/* MODAL RESERVA */}
        <Modal
          visible={modalReservaVisible}
          transparent
          animationType="none"
          onRequestClose={() => animateModalOut(() => setModalReservaVisible(false))}
          onShow={animateModalIn}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContentDetalle, {
              opacity: modalAnim,
              transform: [{ scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
            }]}
            >
              <Text style={styles.modalTitle}>Reservar {canchaReservando?.nombre}</Text>
              <TouchableOpacity
                style={{
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: reservaError && !selectedDate ? 'red' : '#e5e5e5',
                  borderRadius: 8,
                  padding: 10,
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: selectedDate ? '#181028' : '#888', fontSize: 15 }}>
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="calendar"
                  minimumDate={new Date()}
                  onChange={(_, date) => {
                    setShowDatePicker(false);
                    if (date && isDayAvailable(date, canchaReservando)) setSelectedDate(date);
                  }}
                />
              )}
              {reservaError && !selectedDate && (
                <Text style={{ color: 'red', marginBottom: 6 }}>{reservaError}</Text>
              )}
              <Text style={styles.modalLabel}>Selecciona horario:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10, marginTop: 4 }}>
                {availableHours.map((hour) => {
                  const selected = selectedHours.includes(hour);
                  return (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => {
                        if (selected) setSelectedHours(selectedHours.filter(h => h !== hour));
                        else setSelectedHours([...selectedHours, hour]);
                      }}
                      style={[
                        styles.hourButton,
                        selected && styles.hourButtonSelected,
                        { minWidth: 70, marginRight: 8, borderColor: reservaError && !selected ? 'red' : '#e5e5e5', borderWidth: 1 },
                      ]}
                    >
                      <Text style={{ color: selected ? '#fff' : '#000' }}>{hour}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {reservaError && selectedHours.length === 0 && (
                <Text style={{ color: 'red', marginBottom: 6 }}>{reservaError}</Text>
              )}
              <Button title="Confirmar reserva" color="#4CAF50" onPress={confirmarReserva} />
              <View style={{ marginTop: 10 }}>
                <Button title="Cancelar" color="#999" onPress={() => setModalReservaVisible(false)} />
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchText: {
    marginLeft: 8,
    color: '#888',
    fontSize: 15,
    fontWeight: '400',
  },

  bannerContainer: {
    marginBottom: SPACING.md,
  },

  bannerList: {
    width: '100%',
  },

  banner: {
    width: SCREEN_WIDTH,
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
  },
  bannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  bannerDotActive: {
    backgroundColor: '#007bff',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  categoriesSection: {
    marginBottom: SPACING.md,
  },

  categoriesList: {
    marginBottom: 14,
  },

  categoryCardV2: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryImageV2: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  categoryOverlayV2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  categoryContentV2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryTextV2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  spacesSection: {
    marginBottom: SPACING.md,
  },

  spaceCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 1,
  },
  spaceImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  spaceInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  spaceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  spaceLocation: {
    fontSize: 13,
    color: '#666',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },

  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },

  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  hourButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 70,
    alignItems: 'center',
  },

  hourButtonSelected: {
    backgroundColor: '#007bff',
  },

  statusTagBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: 4,
    marginLeft: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
    minWidth: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    maxWidth: 200,
    overflow: 'hidden',
  },
  nearbyCardV3: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 80,
    position: 'relative',
  },
  nearbyImageV3: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 16,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },
  nearbyInfoV3: {
    flex: 1,
    justifyContent: 'center',
  },
  nearbyNameV2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181829',
    maxWidth: '70%',
  },
  nearbyTypeV2: {
    fontSize: 14,
    color: '#A1A1B3',
    marginBottom: 2,
    marginTop: 1,
  },
  nearbyRatingV2: {
    fontSize: 14,
    color: '#181829',
    fontWeight: 'bold',
  },
  nearbyDataV2: {
    fontSize: 13,
    color: '#181829',
    marginRight: 2,
  },
  nearbyDotV2: {
    color: '#A1A1B3',
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  promoChipV2: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  promoChipTextV2: {
    color: '#181829',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusTagTextV2: {
    color: '#181829',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusTagInline: {
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginBottom: 2,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 60,
    maxWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  canchaCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  canchaImage: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  canchaOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  canchaNombre: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  canchaPrecio: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  canchaRating: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  canchaRatingText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 3,
    fontWeight: 'bold',
  },
  canchaSuelo: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  canchaSueloText: {
    color: '#2196f3',
    fontSize: 11,
    marginLeft: 3,
    fontWeight: 'bold',
  },
  canchaButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
  },
  canchaButtonDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf1fb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  canchaButtonDetalleText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  canchaButtonReservar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  canchaButtonReservarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  modalContentDetalle: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    width: '90%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#181028',
  },
  modalLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    color: '#007bff',
  },
  modalText: {
    fontSize: 14,
    color: '#181028',
    marginBottom: 2,
  },
  modalImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },
});
