import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Banner, Category, Space } from '../../types';
import { BANNERS, CATEGORIES, SPACES } from '../../mocks/data';
import { useReservations, Reservation } from '../context/ReservationsContext';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING } from '../../constants';

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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const { reservations, setReservations } = useReservations();

  // Agrupa reservas y guarda la imagen
  const groupedReservationsObj = reservations.reduce((acc, curr) => {
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

  const renderBanner = ({ item }: { item: Banner }) => (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{item.title}</Text>
    </View>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon as any} size={24} color="#000" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSpace = ({ item }: { item: Space }) => (
    <TouchableOpacity
      style={styles.spaceCard}
      onPress={() => handleReservePress(item)}
    >
      <Image source={item.image} style={styles.spaceImage} resizeMode="cover" />
      <View style={styles.spaceInfo}>
        <Text style={styles.spaceName}>{item.name}</Text>
        <View style={styles.spaceRating}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.spaceLocation}>{item.location}</Text>
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
            onPress={() => router.push('/(user)/advanced-search')}
          >
            <Ionicons name="search" size={20} color="#666" />
            <Text style={styles.searchText}>Buscar canchas, deportes...</Text>
          </TouchableOpacity>

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
                  <TouchableOpacity style={styles.spaceCard} onPress={() => {}}>
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

          {/* Categorías */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <FlatList
              data={CATEGORIES}
              renderItem={renderCategory}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
              keyExtractor={(item) => item.id}
            />
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
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Reservar en {selectedSpace?.name || ''}
              </Text>
              <Text style={{ marginBottom: 10 }}>Selecciona horarios:</Text>
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
                        style={{
                          color: selected ? '#fff' : '#000',
                        }}
                      >
                        {hour}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectedHours.length > 0 && selectedSpace && (
                <Button
                  title="Reservar"
                  onPress={() => {
                    const newReservations: Reservation[] = selectedHours.map(
                      (hour) => ({
                        id: `${Date.now().toString()}-${hour}`,
                        title: `Reserva en ${selectedSpace.name}`,
                        date: new Date().toISOString().split('T')[0],
                        time: hour,
                        location: selectedSpace.location,
                        image: selectedSpace.image,
                      }),
                    );
                    setReservations((prev) => [...prev, ...newReservations]);
                    setModalVisible(false);
                    setSelectedHours([]);
                    alert('Reserva confirmada');
                  }}
                />
              )}
              <View style={{ marginTop: 10 }}>
                <Button
                  title="Cerrar"
                  color="#999"
                  onPress={() => setModalVisible(false)}
                />
              </View>
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

  categoriesSection: {
    marginBottom: 20,
  },

  categoriesList: {
    marginBottom: 10,
  },

  categoryCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 16,
    flexDirection: 'column',
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryIcon: {
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginTop: 8,
  },

  spacesSection: {
    marginBottom: 20,
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
});
