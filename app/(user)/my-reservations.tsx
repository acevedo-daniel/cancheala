import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  Share,
  ScrollView,
} from 'react-native';
import { Feather, Entypo, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const mockReservas = [
  {
    id: '1',
    cancha: 'HD Padel',
    imagen: require('../../assets/images/blindex1.png'),
    fecha: '2024-06-20',
    hora: '18:00',
    estado: 'confirmada',
    precio: 16000,
    servicios: ['Luz', 'Pelotas'],
    ubicacion: 'Falucho 265',
    qr: 'https://fake-qr.com/1',
  },
  {
    id: '2',
    cancha: 'Fluix Padel',
    imagen: require('../../assets/images/blindex2.png'),
    fecha: '2024-06-10',
    hora: '20:00',
    estado: 'cancelada',
    precio: 18000,
    servicios: ['Luz'],
    ubicacion: 'Av. Siempre Viva 123',
    qr: 'https://fake-qr.com/2',
  },
  {
    id: '3',
    cancha: 'SanFer Padel',
    imagen: require('../../assets/images/blindex3.png'),
    fecha: '2024-06-25',
    hora: '19:00',
    estado: 'pendiente',
    precio: 14000,
    servicios: ['Pelotas'],
    ubicacion: 'Calle 456',
    qr: 'https://fake-qr.com/3',
  },
];

const estados = {
      confirmada: { color: '#00C853', label: 'Confirmada' },
  pendiente: { color: '#ffb703', label: 'Pendiente' },
  cancelada: { color: '#e63946', label: 'Cancelada' },
};

function esPasada(fecha) {
  return new Date(fecha) < new Date();
}

export default function MyReservationsScreen() {
  const [reservas, setReservas] = useState(mockReservas);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filtro y búsqueda
  const reservasFiltradas = reservas.filter(r => {
    const coincideBusqueda =
      r.cancha.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.fecha.includes(busqueda);
    const coincideEstado =
      filtro === 'todas' ||
      (filtro === 'proximas' && !esPasada(r.fecha) && r.estado !== 'cancelada') ||
      (filtro === 'pasadas' && esPasada(r.fecha)) ||
      (filtro === 'canceladas' && r.estado === 'cancelada');
    return coincideBusqueda && coincideEstado;
  });

  // Separar próximas y pasadas
  const proximas = reservasFiltradas.filter(r => !esPasada(r.fecha) && r.estado !== 'cancelada');
  const pasadas = reservasFiltradas.filter(r => esPasada(r.fecha));
  const canceladas = reservasFiltradas.filter(r => r.estado === 'cancelada');

  // Acciones
  const cancelarReserva = (id) => {
    Alert.alert('Cancelar reserva', '¿Estás seguro de cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí',
        style: 'destructive',
        onPress: () => {
          setReservas(reservas => reservas.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r));
          Alert.alert('Reserva cancelada');
        },
      },
    ]);
  };

  const compartirReserva = (reserva) => {
    Share.share({
      message: `Reserva en ${reserva.cancha} el ${reserva.fecha} a las ${reserva.hora}`,
    });
  };

  const agregarACalendario = (reserva) => {
    Alert.alert('Agregar al calendario', 'Funcionalidad no implementada (demo)');
  };

  // Card de reserva
  const ReservaCard = ({ reserva }) => (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
      marginBottom: 18,
    }}>
      <View style={styles.card}>
        <Image source={reserva.imagen} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={styles.cardTitle}>{reserva.cancha}</Text>
            <View style={[styles.badge, { backgroundColor: estados[reserva.estado].color }]}> 
              <Text style={styles.badgeText}>{estados[reserva.estado].label}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Feather name="calendar" size={16} color="#2196f3" style={{ marginRight: 4 }} />
            <Text style={styles.cardText}>{reserva.fecha}</Text>
            <Ionicons name="time-outline" size={16} color="#2196f3" style={{ marginLeft: 12, marginRight: 4 }} />
            <Text style={styles.cardText}>{reserva.hora}</Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="attach-money" size={16} color="#00C853" style={{ marginRight: 4 }} />
            <Text style={styles.cardText}>{reserva.precio.toLocaleString()}$</Text>
          </View>
          <View style={styles.row}>
            <Entypo name="location-pin" size={16} color="#ff7043" style={{ marginRight: 4 }} />
            <Text style={styles.cardText}>{reserva.ubicacion}</Text>
            <TouchableOpacity onPress={() => Alert.alert('Abrir en Maps', 'Funcionalidad demo')}>
              <Feather name="map-pin" size={16} color="#2196f3" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Feather name="star" size={16} color="#FFD600" style={{ marginRight: 4 }} />
            <Text style={styles.cardText}>Servicios: {reserva.servicios.join(', ')}</Text>
          </View>
          <View style={[styles.row, { marginTop: 7, justifyContent: 'flex-end' }]}> 
            <TouchableOpacity style={styles.actionBtn} onPress={() => cancelarReserva(reserva.id)}>
              <AntDesign name="closecircleo" size={18} color="#e63946" />
              <Text style={styles.actionBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => agregarACalendario(reserva)}>
              <Feather name="calendar" size={18} color="#2196f3" />
              <Text style={styles.actionBtnText}>Calendario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { marginRight: 0 }]} onPress={() => compartirReserva(reserva)}>
              <Feather name="share-2" size={18} color="#00C853" />
              <Text style={styles.actionBtnText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  // Empty state
  if (reservas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../../assets/images/padel1.png')} style={{ width: 120, height: 120, marginBottom: 18 }} />
        <Text style={styles.emptyTitle}>¡Aún no tienes reservas!</Text>
        <Text style={styles.emptyText}>Cuando reserves una cancha, aparecerá aquí.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
        {/* Espacio arriba */}
        <View style={{ height: 18 }} />
        {/* Buscador */}
        <View style={[styles.searchRow, { marginBottom: 10 }]}> 
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#b0b0b0" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por cancha o fecha..."
              value={busqueda}
              onChangeText={setBusqueda}
              placeholderTextColor="#b0b0b0"
            />
            {busqueda.length > 0 && (
              <TouchableOpacity onPress={() => setBusqueda('')} style={styles.clearSearchButton}>
                <AntDesign name="closecircle" size={20} color="#b0b0b0" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Filtros */}
        <View style={styles.filterBoxRow}>
          <View style={styles.filterBox}>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFiltro('todas')}>
              <Text style={[styles.filterBtnText, filtro === 'todas' && { color: '#2196f3', fontWeight: 'bold' }]}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFiltro('proximas')}>
              <Text style={[styles.filterBtnText, filtro === 'proximas' && { color: '#2196f3', fontWeight: 'bold' }]}>Próximas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFiltro('pasadas')}>
              <Text style={[styles.filterBtnText, filtro === 'pasadas' && { color: '#2196f3', fontWeight: 'bold' }]}>Pasadas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFiltro('canceladas')}>
              <Text style={[styles.filterBtnText, filtro === 'canceladas' && { color: '#2196f3', fontWeight: 'bold' }]}>Canceladas</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Próximas reservas */}
        {proximas.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Próximas reservas</Text>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{proximas.length}</Text>
                </View>
              </View>
            </View>
            {proximas.map(item => <ReservaCard key={item.id} reserva={item} />)}
          </>
        )}
        {/* Pasadas reservas */}
        {pasadas.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionTitleContainer, { backgroundColor: '#fff3e0', borderColor: '#ffe0b2' }]}>
                <Text style={[styles.sectionTitle, { color: '#f57c00' }]}>Reservas pasadas</Text>
                <View style={[styles.sectionBadge, { backgroundColor: '#ff9800' }]}>
                  <Text style={styles.sectionBadgeText}>{pasadas.length}</Text>
                </View>
              </View>
            </View>
            {pasadas.map(item => <ReservaCard key={item.id} reserva={item} />)}
          </>
        )}
        {/* Canceladas */}
        {canceladas.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionTitleContainer, { backgroundColor: '#ffebee', borderColor: '#ffcdd2' }]}>
                <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>Reservas canceladas</Text>
                <View style={[styles.sectionBadge, { backgroundColor: '#f44336' }]}>
                  <Text style={styles.sectionBadgeText}>{canceladas.length}</Text>
                </View>
              </View>
            </View>
            {canceladas.map(item => <ReservaCard key={item.id} reserva={item} />)}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 18 : 0,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
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
  filterBoxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
    borderRadius: 18,
    paddingHorizontal: 8,
    height: 40,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterBtnText: {
    fontSize: 15,
    color: '#222',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 18,
    color: '#181028',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    marginRight: 16,
    marginTop: -30,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  badge: {
    marginLeft: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardText: {
    fontSize: 15,
    color: '#444',
    marginRight: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 12,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  actionBtnText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
});
