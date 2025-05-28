// app/(user)/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Banner {
  id: string;
  title: string;
  image: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Space {
  id: string;
  name: string;
  rating: number;
  location: string;
}

// Datos de ejemplo para el carrusel de banners
const BANNERS: Banner[] = [
  { id: '1', title: 'Promociones destacadas', image: null },
  { id: '2', title: 'Nuevos espacios', image: null },
  { id: '3', title: 'Eventos especiales', image: null },
  { id: '4', title: 'Espacios populares', image: null },
];

// Datos de ejemplo para las categorías
const CATEGORIES: Category[] = [
  { id: '1', name: 'Fútbol', icon: 'football-outline' },
  { id: '2', name: 'Tenis', icon: 'tennisball-outline' },
  { id: '3', name: 'Básquet', icon: 'basketball-outline' },
  { id: '4', name: 'Pádel', icon: 'baseball-outline' },
  { id: '5', name: 'Vóley', icon: 'basketball-outline' },
];

// Datos de ejemplo para el feed
const SPACES: Space[] = [
  { id: '1', name: 'Cancha Central', rating: 4.5, location: 'Falucho 257' },
  { id: '2', name: 'Club Deportivo', rating: 4.8, location: 'Av. Rivadavia 1234' },
  { id: '3', name: 'Polideportivo', rating: 4.2, location: 'Calle Principal 789' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const handleLocationPress = () => {
    router.push('/(user)/location-selection');
  };

  const handleNotificationsPress = () => {
    router.push('/(user)/notifications');
  };

  const handleSearchPress = () => {
    router.push('/(user)/advanced-search');
  };

  const handleBannerChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / (SCREEN_WIDTH - 32));
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
        selectedCategory === item.id && styles.selectedCategory
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
    <TouchableOpacity style={styles.spaceCard}>
      <View style={styles.spaceImage}>
        <Text style={styles.spaceImagePlaceholder}>Imagen</Text>
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
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleLocationPress}
        >
          <Ionicons name="location" size={20} color="#000" />
          <Text style={styles.locationText}>Falucho 257</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={handleNotificationsPress}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
        >
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchText}>Buscar canchas, deportes...</Text>
        </TouchableOpacity>

        <View style={styles.bannerContainer}>
          <FlatList
            data={BANNERS}
            renderItem={renderBanner}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerChange}
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

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
        </View>

        <View style={styles.spacesSection}>
          <Text style={styles.sectionTitle}>Espacios cerca de ti</Text>
          {SPACES.map((space) => renderSpace({ item: space }))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 8,
  },
  searchText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  bannerContainer: {
    marginBottom: 24,
  },
  bannerList: {
    paddingHorizontal: 16,
  },
  banner: {
    width: SCREEN_WIDTH - 32,
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  bannerDotActive: {
    backgroundColor: '#000',
  },
  quickAccess: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
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
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  selectedCategory: {
    opacity: 0.5,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  spacesSection: {
    paddingBottom: 24,
  },
  spaceCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spaceImage: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceImagePlaceholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  spaceInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  spaceName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  spaceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  spaceLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});