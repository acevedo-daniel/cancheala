import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING } from '../../constants';

// Mock data para resultados
const mockResults = [
  {
    id: '1',
    name: 'Cancha de Padel Premium',
    location: 'Palermo, Buenos Aires',
    rating: 4.8,
    price: '$1500/hora',
    distance: '0.5 km',
  },
  {
    id: '2',
    name: 'Club de Tenis Central',
    location: 'Recoleta, Buenos Aires',
    rating: 4.6,
    price: '$1200/hora',
    distance: '1.2 km',
  },
  {
    id: '3',
    name: 'Padel & Tennis Club',
    location: 'Belgrano, Buenos Aires',
    rating: 4.7,
    price: '$1800/hora',
    distance: '2.1 km',
  },
];

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { query } = useLocalSearchParams<{ query: string }>();

  const renderResult = ({ item }: { item: typeof mockResults[0] }) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <View style={styles.resultDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.distanceText}>{item.distance}</Text>
        </View>
        <Text style={styles.locationText}>{item.location}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resultados</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchInfo}>
          <Text style={styles.searchQuery}>
            Resultados para: "{query}"
          </Text>
          <Text style={styles.resultsCount}>
            {mockResults.length} canchas encontradas
          </Text>
        </View>

        <FlatList
          data={mockResults}
          renderItem={renderResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  searchInfo: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchQuery: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: SPACING.xs,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
  },
  resultsList: {
    padding: SPACING.md,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: SPACING.xs,
  },
  resultDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: SPACING.xs,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: SPACING.xs,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
}); 