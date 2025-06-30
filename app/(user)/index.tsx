import React, { useState, useContext } from 'react';
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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Banner, Category, Space } from '../../types';
import { BANNERS, CATEGORIES, SPACES } from '../../mocks/data';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING } from '../../constants';
import { ReservationsContext } from '../context/ReservationsContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const availableHours = Array.from({ length: 13 }, (_, i) => {
  const hour = (14 + i) % 24;
  return `${hour.toString().padStart(2, '0')}:00`;
});

type GroupedReservation = {
  id: string;
  title: string;
  date: string;
  times: string[];
  location: string;
  image?: any;
};

const accesos = [
  { label: 'Eventos', icon: '🏆', badge: 1, route: 'eventos' },
  { label: 'Reservas', icon: '📅', route: 'reservas' },
  { label: 'Invitar', icon: '🔗', route: 'invitar' },
  { label: 'Favoritos', icon: '❤️', route: 'favoritos' },
  { label: 'Buscar', icon: '🔍', route: 'buscar' },
];

const SPACE_PRICE = 10000; // Precio mock por hora

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDetailSpace, setSelectedDetailSpace] = useState<Space | null>(null);

  const { reservas, favoritos: favoritosCtx, addReserva } = useContext(ReservationsContext);

  // Agrupa reservas y guarda la imagen
  const groupedReservationsObj = reservas.reduce((acc, curr) => {
    const key = `${curr.title}-${curr.date}`;
    if (!acc[key]) {
      acc[key] = {
        id: curr.id,
        title: curr.title,
        date: curr.date,
        times: [curr.time],
        location: curr.location,
        image: curr.image,
      };
    } else {
      acc[key].times.push(curr.time);
    }
    return acc;
  }, {} as Record<string, GroupedReservation>);
  const groupedReservationsArray = Object.values(groupedReservationsObj);

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

  const handleToggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleCardPress = (space: Space) => {
    setSelectedDetailSpace(space);
    setDetailModalVisible(true);
  };

  const renderBanner = ({ item }: { item: Banner }) => (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{item.title}</Text>
    </View>
  );

  const renderSpace = ({ item }: { item: Space }) => (
    <TouchableOpacity activeOpacity={0.93} onPress={() => handleCardPress(item)}>
      <View style={styles.spaceCard}>
        <Image source={item.image} style={styles.spaceImage} resizeMode="cover" />
        <View style={{ flex: 1, justifyContent: 'center', marginRight: 8 }}>
          <Text style={styles.spaceName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.spaceLocation} numberOfLines={2}>{item.location}</Text>
          <View style={styles.spaceActionsRowNew}>
            <TouchableOpacity
              style={styles.reservarBtn}
              onPress={(e) => {
                e.stopPropagation && e.stopPropagation();
                handleReservePress(item);
              }}
            >
              <Text style={styles.reservarBtnText}>Reservar</Text>
            </TouchableOpacity>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color="#FFD700" style={{ marginRight: 2 }} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <TouchableOpacity onPress={() => handleToggleFavorito(item.id)}>
              <Ionicons
                name={favoritos.includes(item.id) ? 'heart' : 'heart-outline'}
                size={22}
                color={favoritos.includes(item.id) ? '#e53935' : '#bbb'}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => router.push('/(user)/location-selection')}
          >
            <Ionicons name="location" size={20} color="#000" />
            <Text style={styles.locationText}>Falucho 257</Text>
            <Ionicons name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/(user)/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push('/buscar')}
          >
            <Ionicons name="search" size={20} color="#666" />
            <Text style={styles.searchText}>Buscar canchas, deportes...</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
            <TouchableOpacity
              style={{ alignItems: 'center', flex: 1 }}
              onPress={() => router.push('/(user)/notifications')}
            >
              <View style={{ position: 'relative' }}>
                <Ionicons name="trophy" size={24} color="#00C853" />
                {/* Badge de notificaciones */}
                <View style={{ position: 'absolute', top: -4, right: -8, backgroundColor: 'red', borderRadius: 8, paddingHorizontal: 4, minWidth: 16, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 10 }}>1</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, marginTop: 4 }}>Eventos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', flex: 1 }}
              onPress={() => router.push('/(user)/reservas')}
            >
              <Ionicons name="calendar" size={24} color="#00C853" />
              <Text style={{ fontSize: 12, marginTop: 4 }}>Reservas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', flex: 1 }}
              onPress={() => router.push('/(user)/invitar')}
            >
              <Ionicons name="person-add" size={24} color="#00C853" />
              <Text style={{ fontSize: 12, marginTop: 4 }}>Invitar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', flex: 1 }}
              onPress={() => router.push('/(user)/favoritos')}
            >
              <Ionicons name="heart" size={24} color="#00C853" />
              <Text style={{ fontSize: 12, marginTop: 4 }}>Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', flex: 1 }}
              onPress={() => router.push('/buscar')}
            >
              <Ionicons name="search" size={24} color="#00C853" />
              <Text style={{ fontSize: 12, marginTop: 4 }}>Buscar</Text>
            </TouchableOpacity>
          </View>

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

          {/* Mis Reservas */}
          {groupedReservationsArray.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Mis Reservas</Text>
              <FlatList
                data={groupedReservationsArray}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.spaceCard} onPress={() => router.push(`/cancha/${item.id}`)}>
                    <Image
                      source={
                        item.image || require('../../assets/placeholder.png')
                      }
                      style={styles.spaceImage}
                      resizeMode="cover"
                    />
                    <View style={styles.spaceInfo}>
                      <Text style={styles.spaceName}>
                        {`${item.title} (${item.times.join(', ')})`}
                      </Text>
                      <Text style={styles.spaceLocation}>{item.location}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Quick Access */}
          <View style={styles.quickAccess}>
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIcon}>
                <Ionicons name="map-outline" size={24} color="#000" />
              </View>
              <Text style={styles.quickAccessText}>Espacios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={styles.quickAccessIcon}>
                <Ionicons name="people-outline" size={24} color="#000" />
              </View>
              <Text style={styles.quickAccessText}>Matchmaking</Text>
            </TouchableOpacity>
          </View>

          {/* Canchas Disponibles */}
          <View style={styles.spacesSection}>
            <Text style={styles.sectionTitle}>Canchas Disponibles</Text>
            <FlatList
              data={SPACES}
              keyExtractor={(item) => item.id}
              renderItem={renderSpace}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
        </ScrollView>

        {/* Modal de Reservas */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalReservaBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Image source={selectedSpace?.image} style={styles.modalImg} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.modalTitle}>{selectedSpace?.name || ''}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={{ marginLeft: 4, fontWeight: 'bold' }}>{selectedSpace?.rating}</Text>
                  </View>
                  <Text style={{ color: '#666', fontSize: 13 }}>{selectedSpace?.location}</Text>
                  <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Precio por hora: ${SPACE_PRICE.toLocaleString()}</Text>
                </View>
              </View>
              <Text style={{ marginBottom: 10, fontWeight: '600', fontSize: 15 }}>Selecciona los horarios disponibles</Text>
              <View style={styles.hoursContainer}>
                {availableHours.map((hour) => {
                  const selected = selectedHours.includes(hour);
                  return (
                    <Pressable
                      key={hour}
                      onPress={() => {
                        setSelectedHours((prev) =>
                          prev.includes(hour)
                            ? prev.filter((h) => h !== hour)
                            : [...prev, hour],
                        );
                      }}
                      style={[
                        styles.hourButton,
                        selected && styles.hourButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.hourButtonText,
                          selected && styles.hourButtonTextSelected,
                        ]}
                      >
                        {hour}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={{ color: '#888', fontSize: 12, marginTop: 6, marginBottom: 2 }}>
                De 19hs en adelante +$2.000 por luz
              </Text>
              {selectedHours.length > 0 && selectedSpace && (
                <View style={{ marginTop: 10, marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Resumen de reserva</Text>
                  <Text style={{ color: '#333', marginVertical: 2 }}>{selectedHours.length} horas seleccionadas</Text>
                  <Text style={{ color: '#00C853', fontWeight: 'bold', fontSize: 18 }}>
                    Total: ${(selectedHours.length * SPACE_PRICE).toLocaleString()}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.confirmBtn}
                disabled={selectedHours.length === 0}
                onPress={() => {
                  if (selectedSpace && selectedHours.length > 0) {
                    addReserva({
                      cancha: {
                        nombre: selectedSpace.name,
                        direccion: selectedSpace.location,
                      },
                      fecha: new Date().toLocaleDateString(),
                      horarios: selectedHours,
                      estado: 'Confirmada',
                    });
                  }
                  setModalVisible(false);
                  setSelectedHours([]);
                  alert('Reserva confirmada');
                }}
              >
                <Text style={styles.confirmBtnText}>Confirmar Reserva</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Detalle de Cancha */}
        <Modal
          visible={detailModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Detalle de Cancha</Text>
                <Pressable onPress={() => setDetailModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#222" />
                </Pressable>
              </View>
              {selectedDetailSpace && (
                <>
                  <Image source={selectedDetailSpace.image} style={styles.modalImg} resizeMode="cover" />
                  {selectedDetailSpace.specs?.available && (
                    <View style={styles.badgeDisponible}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Disponible</Text></View>
                  )}
                  <Text style={styles.modalTitle}>{selectedDetailSpace.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={{ marginLeft: 4, fontWeight: 'bold' }}>{selectedDetailSpace.rating}</Text>
                    <Text style={{ color: '#888', marginLeft: 6, fontSize: 13 }}>({selectedDetailSpace.specs?.reviews} reseñas)</Text>
                    <View style={styles.priceBadge}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{`$${selectedDetailSpace.specs?.price.toLocaleString()}/hora`}</Text></View>
                  </View>
                  <Text style={{ color: '#666', fontSize: 14, marginBottom: 2 }}><Ionicons name="location-outline" size={14} color="#888" /> {selectedDetailSpace.location}</Text>
                  <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Dirección: {selectedDetailSpace.address}</Text>
                  <Text style={{ fontWeight: 'bold', marginTop: 8, marginBottom: 2 }}>Servicios incluidos:</Text>
                  {selectedDetailSpace.specs?.services?.map((serv, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Ionicons name={serv.icon} size={18} color="#00C853" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#444', fontSize: 14 }}>{serv.label}</Text>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.reservarBtnModal}
                    onPress={() => {
                      setDetailModalVisible(false);
                      setTimeout(() => {
                        setSelectedSpace(selectedDetailSpace);
                        setModalVisible(true);
                        setSelectedHours([]);
                      }, 300); // Espera a que cierre el modal de detalles
                    }}
                  >
                    <Text style={styles.reservarBtnTextModal}>Reservar Ahora</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: SPACING.sm,
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationText: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

  notificationButton: {
    padding: 8,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 16,
  },
  searchText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },

  bannerContainer: {
    marginBottom: 20,
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
  bannerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },

  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
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
    marginBottom: 12,
  },

  quickAccess: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
  },

  quickAccessCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },

  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickAccessText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 8,
  },

  spacesSection: {
    marginBottom: 20,
  },

  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 1,
    padding: 10,
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
    marginBottom: 2,
    color: '#222',
    maxWidth: 160,
  },
  spaceLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  spaceActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 6,
  },
  reservarBtn: {
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 6,
  },
  reservarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalReservaBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalImg: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },

  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },

  hourButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    margin: 4,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hourButtonSelected: {
    backgroundColor: '#00C853',
  },

  hourButtonText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },

  hourButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },

  confirmBtn: {
    backgroundColor: '#00C853',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 15,
  },

  spaceActionsRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'stretch',
  },
  badgeDisponible: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
  },
  priceBadge: {
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 2,
    color: '#222',
  },
  reservarBtnModal: {
    backgroundColor: '#00C853',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  reservarBtnTextModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
