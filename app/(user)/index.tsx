import Card from '../../components/ui/Card';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Banner, Category, Space } from '../../types';
import { BANNERS, CATEGORIES, SPACES } from '../../mocks/data';
import { useReservations, Reservation } from '../context/ReservationsContext';

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
};

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const { reservations, setReservations } = useReservations();

  const groupedReservationsObj = reservations.reduce((acc, curr) => {
    const key = `${curr.title}-${curr.date}`;
    if (!acc[key]) {
      acc[key] = {
        id: curr.id,
        title: curr.title,
        date: curr.date,
        times: [curr.time],
        location: curr.location,
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationButton} onPress={() => router.push('/(user)/location-selection')}>
          <Ionicons name="location" size={20} color="#000" />
          <Text style={styles.locationText}>Falucho 257</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/(user)/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(user)/advanced-search')}>
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchText}>Buscar canchas, deportes...</Text>
        </TouchableOpacity>

        <View style={styles.bannerContainer}>
          <FlatList
            data={BANNERS}
            renderItem={({ item }) => (
              <View style={styles.banner}>
                <Text style={styles.bannerText}>{item.title}</Text>
              </View>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
              const contentOffset = event.nativeEvent.contentOffset.x;
              const currentIndex = Math.round(contentOffset / (SCREEN_WIDTH - 32));
              setCurrentBanner(currentIndex);
            }}
            style={styles.bannerList}
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

        {groupedReservationsArray.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Mis Reservas</Text>
            <FlatList
              data={groupedReservationsArray}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Card
                  space={{
                    id: item.id,
                    name: `${item.title} (${item.times.join(', ')})`,
                    rating: 0,
                    address: item.location,
                    image: { uri: '' },
                    location: item.location,
                  }}
                  onPress={() => {}}
                />
              )}
              scrollEnabled={false}
            />
          </View>
        )}

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={({ item }) => (
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
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
        </View>

        <View style={styles.spacesSection}>
          <Text style={styles.sectionTitle}>Canchas Disponibles</Text>
          <FlatList
            data={SPACES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.spaceCard}
                onPress={() => handleReservePress(item)}
              >
                <View style={styles.spaceImage}>
                  <Image source={item.image} style={styles.spaceImage} resizeMode="cover" />
                </View>
                <View style={styles.spaceInfo}>
                  <Text style={styles.spaceName}>{item.name}</Text>
                  <View style={styles.spaceRating}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <Text style={styles.spaceLocation}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            width: '85%'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
              Reservar en {selectedSpace?.name}
            </Text>
            <Text style={{ marginBottom: 10 }}>Selecciona horarios:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {availableHours.map((hour) => (
                <Pressable
                  key={hour}
                  onPress={() => {
                    setSelectedHours((prev) =>
                      prev.includes(hour)
                        ? prev.filter((h) => h !== hour)
                        : [...prev, hour]
                    );
                  }}
                  style={{
                    backgroundColor: selectedHours.includes(hour) ? '#007bff' : '#eee',
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 10,
                    minWidth: 70,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: selectedHours.includes(hour) ? '#fff' : '#000' }}>{hour}</Text>
                </Pressable>
              ))}
            </View>
            {selectedHours.length > 0 && (
              <Button
                title="Reservar"
                onPress={() => {
                  if (!selectedSpace) return;
                  const newReservations: Reservation[] = selectedHours.map((hour) => ({
                    id: `${Date.now().toString()}-${hour}`,
                    title: `Reserva en ${selectedSpace.name}`,
                    date: new Date().toISOString().split('T')[0],
                    time: hour,
                    location: selectedSpace.location,
                  }));
                  setReservations((prev) => [...prev, ...newReservations]);
                  setModalVisible(false);
                  setSelectedHours([]);
                  alert('Reserva confirmada');
                }}
              />
            )}
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#f8f8f8',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  locationText: {
    marginLeft: 6,
    marginRight: 2,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  searchText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 15,
  },
  content: { flex: 1 },
  bannerContainer: { marginHorizontal: 16, marginBottom: 12 },
  bannerList: { flexGrow: 0 },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  // hola
  bannerDotActive: { backgroundColor: '#007bff' },
  banner: {
    width: SCREEN_WIDTH - 32,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  bannerText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  categoriesSection: { marginBottom: 20 },
  categoriesList: { flexGrow: 0 },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 80,
  },
  selectedCategory: { borderColor: '#007bff', backgroundColor: '#e6f0ff' },
  categoryIcon: { marginBottom: 6 },
  categoryText: { fontSize: 14, color: '#333', fontWeight: '500' },
  spacesSection: { marginBottom: 20 },
  spaceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  spaceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  spaceInfo: { flex: 1, justifyContent: 'center' },
  spaceName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#222' },
  spaceRating: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { marginLeft: 4, fontSize: 14, color: '#FFD700', fontWeight: 'bold' },
  spaceLocation: { fontSize: 13, color: '#666' },
});