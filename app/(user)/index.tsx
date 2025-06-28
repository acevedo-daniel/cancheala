import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Banner, Category, Space } from '../../types';
import { BANNERS, CATEGORIES, SPACES } from '../../mocks/data';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
    <ScreenContainer>
      <View style={[styles.container, { paddingTop: insets.top }]}>
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

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={true}
          overScrollMode="always"
        >
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
              keyExtractor={(item) => item.id}
            />
          </View>

          <View style={styles.spacesSection}>
            <Text style={styles.sectionTitle}>Canchas disponibles</Text>
            <FlatList
              data={SPACES}
              renderItem={renderSpace}
              scrollEnabled={false}
              nestedScrollEnabled={true}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ScrollView>
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
    marginTop: SPACING.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // React Native no soporta 'gap', usar marginRight entre elementos si querés
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginHorizontal: 4, // reemplaza gap con marginHorizontal
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
  },
  searchText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
  },
  bannerContainer: {
    marginBottom: 24,
  },
  bannerList: {
    paddingHorizontal: 16,
  },
  banner: {
    width: SCREEN_WIDTH,
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
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  bannerDotActive: {
    backgroundColor: '#000',
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
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginTop: 8,
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
    marginTop: 8,
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
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginLeft: 4,
  },
  spaceLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});
