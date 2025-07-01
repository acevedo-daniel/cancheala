import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
  ToastAndroid,
  ImageSourcePropType,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import type { TouchableOpacity as TouchableOpacityType } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type Cancha = {
  id: string;
  nombre: string;
  imageUri: string | null;
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

export default function CanchasScreen() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [canchaDetalle, setCanchaDetalle] = useState<Cancha | null>(null);
  const [filtroPrecio, setFiltroPrecio] = useState('todos');
  const [filtroSuelo, setFiltroSuelo] = useState<'todos' | 'césped' | 'hormigón' | 'madera'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('todos');
  
  // Estados para animaciones y focus
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-30));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [filterPressed, setFilterPressed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [badgeScale] = useState(new Animated.Value(1));

  // Estados para reserva
  const [modalReservaVisible, setModalReservaVisible] = useState(false);
  const [canchaReservando, setCanchaReservando] = useState<Cancha | null>(null);
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('');

  // Estados para los filtros
  const [materialSeleccionado, setMaterialSeleccionado] = useState<string>('');
  const [precioSeleccionado, setPrecioSeleccionado] = useState<string>('todos');

  // Detectar si hay filtros activos
  const filtrosActivos = filtroPrecio !== 'todos' || filtroSuelo !== 'todos' || filtroDisponibilidad !== 'todos' || busqueda.length > 0;

  // Animar entrada de buscador y header
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animar rotación del icono de filtro
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: mostrarFiltros ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    if (filtrosActivos) {
      Animated.sequence([
        Animated.timing(badgeScale, { toValue: 1.3, duration: 120, useNativeDriver: true }),
        Animated.timing(badgeScale, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [mostrarFiltros, filtrosActivos]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Tooltip para estadísticas
  const showTooltip = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      // iOS: podrías usar un modal o librería de tooltip
      alert(msg);
    }
  };

  // Función para filtrar canchas
  const filtrarCanchas = () => {
    return canchas.filter((cancha) => {
      const coincideBusqueda = cancha.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const precioNum = Number(cancha.precio);
      let coincidePrecio = true;

      switch (filtroPrecio) {
        case '<5000':
          coincidePrecio = precioNum < 5000;
          break;
        case '5000-10000':
          coincidePrecio = precioNum >= 5000 && precioNum <= 10000;
          break;
        case '>10000':
          coincidePrecio = precioNum > 10000;
          break;
        default:
          coincidePrecio = true;
      }

      let coincideSuelo = true;
      if (filtroSuelo !== 'todos') {
        coincideSuelo = cancha.suelo === filtroSuelo;
      }

      let coincideDisponibilidad = true;
      if (filtroDisponibilidad !== 'todos') {
        coincideDisponibilidad = cancha.disponible === (filtroDisponibilidad === 'disponible');
      }

      return coincideBusqueda && coincidePrecio && coincideSuelo && coincideDisponibilidad;
    });
  };

  useEffect(() => {
    loadCanchas();
  }, []);

  const loadCanchas = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@canchas');
      if (jsonValue != null) {
        setCanchas(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading canchas', e);
    }
  };

  const handleMostrarDetalle = (cancha: Cancha) => {
    setCanchaDetalle(cancha);
    setModalDetalleVisible(true);
  };

  const handleReservar = (cancha: Cancha) => {
    setCanchaReservando(cancha);
    setModalReservaVisible(true);
  };

  const confirmarReserva = async () => {
    if (!canchaReservando || !fechaReserva || !horaReserva) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const reserva = {
        id: Date.now().toString(),
        canchaId: canchaReservando.id,
        canchaNombre: canchaReservando.nombre,
        fecha: fechaReserva,
        hora: horaReserva,
        precio: canchaReservando.precio,
        estado: 'confirmada',
        timestamp: new Date().toISOString(),
      };

      const reservasExistentes = await AsyncStorage.getItem('@reservas');
      const reservas = reservasExistentes ? JSON.parse(reservasExistentes) : [];
      reservas.push(reserva);
      
      await AsyncStorage.setItem('@reservas', JSON.stringify(reservas));
      
      Alert.alert(
        '¡Reserva Confirmada!',
        `Tu reserva para ${canchaReservando.nombre} el ${fechaReserva} a las ${horaReserva} ha sido confirmada.`,
        [{ text: 'OK', onPress: () => setModalReservaVisible(false) }]
      );
      
      setFechaReserva('');
      setHoraReserva('');
      setCanchaReservando(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo confirmar la reserva');
    }
  };

  const renderCancha = ({ item, index }: { item: Cancha; index: number }) => (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cardTouchable}
        activeOpacity={0.9}
        onPress={() => handleMostrarDetalle(item)}
      >
        <View style={styles.cardImageWrapper}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.noImage]}>
              <MaterialIcons name="sports-tennis" size={40} color="#ccc" />
              <Text style={styles.noImageText}>Sin imagen</Text>
            </View>
          )}

          {/* Badge de puntuación */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#fff" />
            <Text style={styles.ratingText}>{item.puntuacion}/10</Text>
          </View>

          {/* Badge de disponibilidad */}
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: item.disponible ? '#4CAF50' : '#F44336' }
          ]}>
            <Text style={styles.availabilityText}>
              {item.disponible ? 'Disponible' : 'Ocupada'}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.nombre}
          </Text>
          
          <View style={styles.cardLocation}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.cardDireccion} numberOfLines={1}>
              {item.direccionTexto}
            </Text>
          </View>

          {item.suelo && (
            <View style={styles.cardRow}>
              <MaterialIcons name="layers" size={16} color="#2196f3" />
              <Text style={styles.cardText}>Suelo: {item.suelo}</Text>
            </View>
          )}

          {item.horarios && (
            <View style={styles.cardRow}>
              <Ionicons name="time-outline" size={16} color="#FF9800" />
              <Text style={styles.cardText}>{item.horarios}</Text>
            </View>
          )}

          <View style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio</Text>
              <Text style={styles.cardPrecio}>${item.precio}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.reserveButton,
                { backgroundColor: item.disponible ? '#4CAF50' : '#ccc' }
              ]}
              onPress={(e) => {
                e.stopPropagation();
                if (item.disponible) {
                  handleReservar(item);
                } else {
                  Alert.alert('No disponible', 'Esta cancha no está disponible en este momento');
                }
              }}
              disabled={!item.disponible}
            >
              <Feather 
                name={item.disponible ? "calendar" : "x-circle"} 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.reserveButtonText}>
                {item.disponible ? 'Reservar' : 'Ocupada'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const canchasFiltradas = filtrarCanchas();

  // Datos de canchas de Blindex
  const canchasBlindex = [
    {
      nombre: 'HD Padel',
      precio: 14000,
      imagen: require('../../assets/images/blindex1.png'),
      especificaciones: [
        '🏟 Tipo: Techada',
        '💡 Iluminación: Incluida',
        '🟩 Superficie: Césped sintético',
        '🎾 Venta de pelotitas',
        '🟨 Venta de grips para paletas',
        '🛍 Kiosco con insumos deportivos',
      ],
    },
    {
      nombre: 'Fluix Padel',
      precio: 16000,
      imagen: require('../../assets/images/blindex2.png'),
      especificaciones: [
        '🏟 Tipo: Techada',
        '💡 Iluminación: Incluida',
        '🟩 Superficie: Césped sintético',
        '🎾 Venta de pelotitas',
      ],
    },
    {
      nombre: 'SanFer Padel',
      precio: 11000,
      imagen: require('../../assets/images/blindex3.png'),
      especificaciones: [
        '🏟 Tipo: Techada',
        '💡 Iluminación: Incluida',
        '🟩 Superficie: Césped sintético',
        '🎾 Venta de pelotitas',
        '🟨 Venta de grips para paletas',
        '🟨 Kiosco con insumos deportivos',
      ],
    },
  ];

  // Datos de canchas de Cemento
  const canchasCemento = [
    {
      nombre: 'Las Cortadas',
      precio: 8000,
      imagen: require('../../assets/images/material1.png'),
      especificaciones: [
        '🏟 Tipo: Techada',
        '💡 Iluminación: Incluida',
        '🟩 Superficie: Césped sintético',
        '🎾 Venta de pelotitas',
        '🟨 Venta de grips para paletas',
        '🛍 Kiosco con insumos deportivos',
      ],
    },
    {
      nombre: 'Loxor Padel',
      precio: 9000,
      imagen: require('../../assets/images/material2.png'),
      especificaciones: [
        '🏟 Tipo: Techada',
        '💡 Iluminación: Incluida',
        '🟩 Superficie: Césped sintético',
        '🎾 Venta de pelotitas',
        '🟨 Venta de grips para paletas',
        '🛍 Kiosco con insumos deportivos',
      ],
    },
    {
      nombre: 'Diefer Padel',
      precio: 7000,
      imagen: require('../../assets/images/material3.png'),
      especificaciones: [
        '🏟 Tipo: Techada',
        '💡 Iluminación: Incluida',
        '🟩 Superficie: Césped sintético',
        '🎾 Venta de pelotitas',
        '🟨 Venta de grips para paletas',
        '🛍 Kiosco con insumos deportivos',
      ],
    },
  ];

  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);
  const [modalOrdenPrecioVisible, setModalOrdenPrecioVisible] = useState(false);
  const [ordenPrecio, setOrdenPrecio] = useState<'menor' | 'mayor' | null>(null);

  // Unifico todas las canchas para orden por precio
  const todasLasCanchas = [
    ...canchasBlindex.map(c => ({ ...c, tipo: 'Blindex' })),
    ...canchasCemento.map(c => ({ ...c, tipo: 'Cemento' })),
  ];

  // Si hay orden de precio, ordeno todas las canchas
  let canchasOrdenadasPorPrecio = todasLasCanchas;
  if (ordenPrecio) {
    canchasOrdenadasPorPrecio = [...todasLasCanchas].sort((a, b) => {
      return ordenPrecio === 'menor' ? a.precio - b.precio : b.precio - a.precio;
    });
  }

  // Filtrado dinámico según búsqueda
  const busquedaLower = busqueda.trim().toLowerCase();
  const mostrarSoloCemento = busquedaLower === 'cemento';
  const mostrarSoloBlindex = busquedaLower === 'blindex';
  const mostrarOrdenPrecio = busquedaLower === 'precio' && ordenPrecio;

  // Filtrar canchas por nombre si hay texto
  const canchasBlindexFiltradas = busquedaLower && !mostrarSoloCemento && !mostrarSoloBlindex && !mostrarOrdenPrecio
    ? canchasBlindex.filter(c => c.nombre.toLowerCase().includes(busquedaLower))
    : canchasBlindex;
  const canchasCementoFiltradas = busquedaLower && !mostrarSoloCemento && !mostrarSoloBlindex && !mostrarOrdenPrecio
    ? canchasCemento.filter(c => c.nombre.toLowerCase().includes(busquedaLower))
    : canchasCemento;

  // Si se borra el buscador, reseteo el orden de precio
  React.useEffect(() => {
    if (busquedaLower !== 'precio') setOrdenPrecio(null);
  }, [busquedaLower]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownStep, setDropdownStep] = useState<'root' | 'precio' | 'cancha'>('root');
  const [dropdownAnchor, setDropdownAnchor] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const filterButtonRef = React.useRef<View>(null);

  // Función para mostrar el dropdown pegado al botón
  const showDropdown = () => {
    if (filterButtonRef.current) {
      filterButtonRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
        setDropdownAnchor({ x: px, y: py, width, height });
        setDropdownVisible(true);
        setDropdownStep('root');
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        {/* Buscador y botón de filtro */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 18, marginBottom: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 24, paddingHorizontal: 14, height: 44, marginRight: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2, position: 'relative' }}>
            <AntDesign name="search1" size={20} color="#b0b0b0" style={{ marginRight: 8 }} />
            <TextInput
              style={{ flex: 1, fontSize: 16, color: '#333', backgroundColor: 'transparent', borderWidth: 0, paddingVertical: 0, paddingHorizontal: 0 }}
              placeholder="Buscar por nombre de cancha..."
              value={busqueda}
              onChangeText={setBusqueda}
              placeholderTextColor="#b0b0b0"
            />
            {busqueda.length > 0 && (
              <TouchableOpacity onPress={() => setBusqueda('')} style={styles.clearSearchButton}>
                <AntDesign name="closecircle" size={22} color="#b0b0b0" />
              </TouchableOpacity>
            )}
          </View>
          <View ref={filterButtonRef} collapsable={false}>
            <TouchableOpacity onPress={showDropdown} style={{ backgroundColor: '#fff', borderRadius: 24, padding: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
              <AntDesign name="bars" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Dropdown de filtro */}
        {dropdownVisible && dropdownAnchor && (
          <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
            <View style={styles.dropdownOverlay}>
              <View style={[
                styles.dropdownMenu,
                {
                  position: 'absolute',
                  top: dropdownAnchor.y + dropdownAnchor.height + 8,
                  left: dropdownAnchor.x + dropdownAnchor.width - 180, // alineado a la derecha del botón
                  minWidth: 180,
                  borderRadius: 18,
                  paddingVertical: 10,
                  paddingHorizontal: 0,
                  shadowColor: '#000',
                  shadowOpacity: 0.18,
                  shadowRadius: 16,
                  elevation: 12,
                },
              ]}>
                {/* Flecha */}
                <View style={styles.dropdownArrow} />
                <View style={{ paddingHorizontal: 12 }}>
                  {dropdownStep === 'root' && (
                    <>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => setDropdownStep('precio')}>
                        <Text style={styles.dropdownText}>Precio</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => setDropdownStep('cancha')}>
                        <Text style={styles.dropdownText}>Cancha</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {dropdownStep === 'precio' && (
                    <>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => { setBusqueda('precio'); setOrdenPrecio('menor'); setDropdownVisible(false); }}>
                        <Text style={[styles.dropdownText, ordenPrecio === 'menor' && { color: '#2196f3', fontWeight: 'bold' }]}>Menor</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => { setBusqueda('precio'); setOrdenPrecio('mayor'); setDropdownVisible(false); }}>
                        <Text style={[styles.dropdownText, ordenPrecio === 'mayor' && { color: '#2196f3', fontWeight: 'bold' }]}>Mayor</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {dropdownStep === 'cancha' && (
                    <>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => { setBusqueda('blindex'); setDropdownVisible(false); }}>
                        <Text style={styles.dropdownText}>Blindex</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => { setBusqueda('cemento'); setDropdownVisible(false); }}>
                        <Text style={styles.dropdownText}>Cemento</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          {/* Carrusel de Blindex */}
          {(!busquedaLower || mostrarSoloBlindex || (busquedaLower && canchasBlindexFiltradas.length > 0 && !mostrarSoloCemento && !mostrarOrdenPrecio)) && !mostrarOrdenPrecio && (
            <>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Canchas de Blindex</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{canchasBlindexFiltradas.length}</Text>
                  </View>
                </View>
              </View>
              <FlatList
                data={canchasBlindexFiltradas}
                keyExtractor={(item) => item.nombre}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity activeOpacity={0.85} onPress={() => { setCanchaDetalle(item); setModalDetalleVisible(true); }}>
                    <View style={styles.blindexCard}>
                      <View style={{ position: 'relative' }}>
                        <Image
                          source={item.imagen}
                          style={styles.blindexImage}
                          resizeMode="cover"
                        />
                        <View style={styles.locationContainer}>
                          <Feather name="map-pin" size={14} color="#fff" />
                          <Text style={styles.locationText}>Palermo, Buenos Aires</Text>
                        </View>
                      </View>
                      <Text style={styles.blindexNombre}>{item.nombre}</Text>
                      <View style={{ marginBottom: 2, width: '100%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.blindexPrecio, { color: '#2196f3', textAlign: 'center', marginRight: 4 }]}>{item.precio.toLocaleString()}$ s/luz</Text>
                          <Feather name="sun" size={18} color="#FFD600" style={{ marginLeft: 2 }} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.blindexPrecio, { color: '#222', textAlign: 'center', marginRight: 4 }]}>{(item.precio + 2000).toLocaleString()}$ c/luz</Text>
                          <Entypo name="moon" size={18} color="#222" style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                      <TouchableOpacity style={styles.reservarBtnCard} onPress={() => { setCanchaDetalle(item); setModalReservaVisible(true); }}>
                        <Text style={styles.reservarBtnText}>Reservar Ahora</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
          {/* Carrusel de Cemento */}
          {(!busquedaLower || mostrarSoloCemento || (busquedaLower && canchasCementoFiltradas.length > 0 && !mostrarSoloBlindex && !mostrarOrdenPrecio)) && !mostrarOrdenPrecio && (
            <>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>Canchas de Cemento</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{canchasCementoFiltradas.length}</Text>
                  </View>
                </View>
              </View>
              <FlatList
                data={canchasCementoFiltradas}
                keyExtractor={(item) => item.nombre}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity activeOpacity={0.85} onPress={() => { setCanchaDetalle(item); setModalDetalleVisible(true); }}>
                    <View style={styles.blindexCard}>
                      <View style={{ position: 'relative' }}>
                        <Image
                          source={item.imagen}
                          style={styles.blindexImage}
                          resizeMode="cover"
                        />
                        <View style={styles.locationContainer}>
                          <Feather name="map-pin" size={14} color="#fff" />
                          <Text style={styles.locationText}>Belgrano, Buenos Aires</Text>
                        </View>
                      </View>
                      <Text style={styles.blindexNombre}>{item.nombre}</Text>
                      <View style={{ marginBottom: 2, width: '100%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.blindexPrecio, { color: '#2196f3', textAlign: 'center', marginRight: 4 }]}>{item.precio.toLocaleString()}$ s/luz</Text>
                          <Feather name="sun" size={18} color="#FFD600" style={{ marginLeft: 2 }} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.blindexPrecio, { color: '#222', textAlign: 'center', marginRight: 4 }]}>{(item.precio + 2000).toLocaleString()}$ c/luz</Text>
                          <Entypo name="moon" size={18} color="#222" style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                      <TouchableOpacity style={styles.reservarBtnCard} onPress={() => { setCanchaDetalle(item); setModalReservaVisible(true); }}>
                        <Text style={styles.reservarBtnText}>Reservar Ahora</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
          {/* Carrusel de todas las canchas ordenadas por precio */}
          {mostrarOrdenPrecio && (
            <>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
                Canchas ordenadas por precio ({ordenPrecio === 'menor' ? 'Menor a Mayor' : 'Mayor a Menor'})
              </Text>
              <FlatList
                data={canchasOrdenadasPorPrecio}
                keyExtractor={(item) => item.nombre + item.tipo}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity activeOpacity={0.85} onPress={() => { setCanchaDetalle(item); setModalDetalleVisible(true); }}>
                    <View style={styles.blindexCard}>
                      <View style={{ position: 'relative' }}>
                        <Image
                          source={item.imagen}
                          style={styles.blindexImage}
                          resizeMode="cover"
                        />
                        <View style={styles.locationContainer}>
                          <Feather name="map-pin" size={14} color="#fff" />
                          <Text style={styles.locationText}>{item.tipo === 'blindex' ? 'Palermo, Buenos Aires' : 'Belgrano, Buenos Aires'}</Text>
                        </View>
                      </View>
                      <Text style={styles.blindexNombre}>{item.nombre}</Text>
                      <View style={{ marginBottom: 2, width: '100%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.blindexPrecio, { color: '#2196f3', textAlign: 'center', marginRight: 4 }]}>{item.precio.toLocaleString()}$ s/luz</Text>
                          <Feather name="sun" size={18} color="#FFD600" style={{ marginLeft: 2 }} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.blindexPrecio, { color: '#222', textAlign: 'center', marginRight: 4 }]}>{(item.precio + 2000).toLocaleString()}$ c/luz</Text>
                          <Entypo name="moon" size={18} color="#222" style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                      <TouchableOpacity style={styles.reservarBtnCard} onPress={() => { setCanchaDetalle(item); setModalReservaVisible(true); }}>
                        <Text style={styles.reservarBtnText}>Reservar Ahora</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>
      </ScrollView>
      {/* Modal de detalle de cancha */}
      <Modal
        visible={modalDetalleVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalDetalleVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 22, padding: 24, width: '85%', maxHeight: '80%', alignItems: 'center', position: 'relative' }}>
            <TouchableOpacity style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }} onPress={() => setModalDetalleVisible(false)}>
              <AntDesign name="closecircle" size={28} color="#888" />
            </TouchableOpacity>
            {canchaDetalle && (
              <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <Image source={canchaDetalle.imagen} style={{ width: '100%', height: 140, borderRadius: 16, marginBottom: 16 }} resizeMode="cover" />
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{canchaDetalle.nombre}</Text>
                <View style={{ marginBottom: 10, width: '100%', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                    <Text style={{ fontSize: 16, color: '#2196f3', fontWeight: '600', marginRight: 4 }}>{canchaDetalle.precio.toLocaleString()}$ s/luz</Text>
                    <Feather name="sun" size={18} color="#FFD600" style={{ marginLeft: 2 }} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#222', fontWeight: '600', marginRight: 4 }}>{(canchaDetalle.precio + 2000).toLocaleString()}$ c/luz</Text>
                    <Entypo name="moon" size={18} color="#222" style={{ marginLeft: 2 }} />
                  </View>
                </View>
                <View style={styles.especificacionesBox}>
                  {canchaDetalle.especificaciones.map((esp, idx) => (
                    <View key={idx} style={styles.especificacionItem}>
                      <Text style={styles.especificacionEmoji}>{esp.split(' ')[0]}</Text>
                      <Text style={styles.especificacionTexto} numberOfLines={2} ellipsizeMode="tail">{esp.substring(esp.indexOf(' ') + 1)}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.reservarBtn} onPress={() => setModalReservaVisible(true)}>
                  <Text style={styles.reservarBtnText}>Reservar Ahora</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      {/* Modal de reserva */}
      <Modal
        visible={modalReservaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalReservaVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 28, width: '80%', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Reserva</Text>
            <Text style={{ fontSize: 16, marginBottom: 18, textAlign: 'center' }}>
              Aquí iría el flujo de reserva. ¿Quieres que te ayude a implementarlo?
            </Text>
            <TouchableOpacity style={[styles.reservarBtn, { marginTop: 0 }]} onPress={() => setModalReservaVisible(false)}>
              <Text style={styles.reservarBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  cardDireccion: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  cardPrecio: {
    backgroundColor: '#00C853',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: '700',
    overflow: 'hidden',
  },
  cardTouchable: {
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontWeight: '700',
    marginRight: 10,
    fontSize: 14,
    color: '#444',
  },
  reserveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 4,
  },
  searchWrapper: {
    marginTop: 16,
    marginBottom: 8,
  },
  searchContainer: {
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  filterButton: {
    marginLeft: 10,
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 14,
    color: '#444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    height: 150,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalDetalleContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '85%',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  modalScrollContent: {
    paddingBottom: 30,
    paddingTop: 40,
  },
  detalleImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  detalleImage: {
    width: '100%',
    height: '100%',
  },
  detalleNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  detallePrecio: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00c853',
    marginBottom: 10,
    textAlign: 'center',
  },
  detalleDescripcion: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    textAlign: 'justify',
  },
  detallePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detallePriceLabel: {
    fontWeight: '700',
    marginRight: 10,
    fontSize: 14,
    color: '#444',
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    fontSize: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  mapaContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  mapaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  mapa: {
    flex: 1,
  },
  reserveButtonLarge: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reserveButtonLargeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 4,
  },
  modalReservaContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  modalReservaTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  reservaCanchaInfo: {
    marginBottom: 16,
  },
  reservaCanchaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  reservaCanchaPrecio: {
    fontSize: 16,
    color: '#00c853',
  },
  reservaForm: {
    marginBottom: 16,
  },
  reservaLabel: {
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 14,
    color: '#444',
  },
  reservaInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  reservaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  reservaCancelButton: {
    backgroundColor: '#f44336',
    padding: 14,
    borderRadius: 8,
  },
  reservaCancelText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  reservaConfirmButton: {
    backgroundColor: '#2196f3',
    padding: 14,
    borderRadius: 8,
  },
  reservaConfirmText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    marginLeft: 10,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
  },
  availabilityBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  availabilityText: {
    marginLeft: 4,
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  searchSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  filterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2196f3',
    borderRadius: 20,
    width: 16,
    height: 16,
  },
  noImageText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearFiltersText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  detalleRatingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  detalleRatingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
  },
  listContainer: {
    paddingBottom: 100,
  },
  detalleAvailabilityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  detalleAvailabilityText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  searchSeparatorGradient: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchContainerFocused: {
    borderColor: '#2196f3',
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  clearSearchButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -11 }],
    zIndex: 2,
    padding: 2,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
  },
  headerLogo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginRight: 12,
  },
  priceFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceChipsContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  priceChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  priceChipSelected: {
    backgroundColor: '#2196f3',
  },
  priceChipText: {
    color: '#333',
    fontWeight: '500',
  },
  priceChipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: '#2196f3',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 4,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  fabButton: {
    backgroundColor: '#2196f3',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  blindexCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  blindexImage: {
    width: 190,
    height: 120,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blindexNombre: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  blindexPrecio: {
    fontSize: 15,
    color: '#2196f3',
    fontWeight: '600',
    textAlign: 'center',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    minWidth: 180,
    overflow: 'visible',
  },
  dropdownArrow: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 18,
    height: 18,
    backgroundColor: 'transparent',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // Triángulo
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#222',
  },
  especificacionesBox: {
    backgroundColor: '#f7fafd',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#2196f3',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  especificacionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  especificacionEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  especificacionTexto: {
    fontSize: 16,
    color: '#222',
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  reservarBtn: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    shadowColor: '#00C853',
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 2,
  },
  reservarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  reservarBtnCard: {
    backgroundColor: '#00C853',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    shadowColor: '#00C853',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    marginBottom: 20,
    marginTop: 32,
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#2196f3',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginRight: 12,
  },
  sectionBadge: {
    backgroundColor: '#2196f3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  sectionBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  locationText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    flex: 1,
  },
});
