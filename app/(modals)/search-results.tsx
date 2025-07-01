import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING, COLORS } from '../../constants';
import { SPACES } from '../../mocks/data';
import Card from '../../components/ui/Card';
import { Space } from '../../types';

const FILTER_CHIPS = [
  { id: '1', label: 'Filtrar' },
  { id: '2', label: 'Ordenar' },
  { id: '3', label: 'Techadas' },
  { id: '4', label: 'Cerca' },
  { id: '5', label: 'Promos' },
];

const promoColors = [
  '#FFE066', // Amarillo
  '#4ADE80', // Verde
  '#60A5FA', // Azul
  '#F472B6', // Rosa
  '#A1A1B3', // Gris
];

const renderSpace = ({ item }: { item: typeof SPACES[0] }) => {
  const formatDistance = (m: number) => m < 1000 ? `${m} m` : `${(m/1000).toFixed(1)} km`;
  const price = '$1.500';
  return (
    <View style={{ marginBottom: 28 }}>
      {item.statusTag && (
        <View style={styles.statusTagPill}>
          <Text style={styles.statusTagTextPill} numberOfLines={1} ellipsizeMode="tail">{item.statusTag}</Text>
        </View>
      )}
      <View style={styles.nearbyCardV3}>
        <View style={{ position: 'relative', overflow: 'visible' }}>
          <Image
            source={item.image}
            style={styles.nearbyImageV3}
          />
        </View>
        <View style={styles.nearbyInfoV3}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.nearbyNameV2} numberOfLines={1}>{item.name}</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="star" size={16} color="#181829" style={{ marginRight: 2 }} />
            <Text style={styles.nearbyRatingV2}>{item.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.nearbyTypeV2}>{item.type}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Ionicons name="navigate-outline" size={14} color="#A1A1B3" style={{ marginRight: 2 }} />
            <Text style={styles.nearbyDataV2}>{formatDistance(item.distance)}</Text>
            <Text style={styles.nearbyDotV2}>·</Text>
            <Ionicons name="pricetag-outline" size={14} color="#A1A1B3" style={{ marginRight: 2 }} />
            <Text style={styles.nearbyDataV2}>{price}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' }}>
            {item.promos && item.promos.map((promo: string, idx: number) => (
              <View
                key={promo}
                style={[styles.promoChipV2, { backgroundColor: promoColors[idx % promoColors.length] }]}
              >
                <Text style={styles.promoChipTextV2} numberOfLines={1}>{promo}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { query } = useLocalSearchParams<{ query: string }>();
  const [searchQuery, setSearchQuery] = useState(query || '');

  return (
    <ScreenContainer>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Barra de búsqueda */}
        <View style={[styles.searchBarRow, { paddingHorizontal: SPACING.md, paddingTop: 12, marginBottom: 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <View style={[styles.searchBar, { flex: 1, borderColor: '#111', borderWidth: 1, backgroundColor: '#F6F6F6', paddingVertical: 10 }]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar canchas, deportes..."
              placeholderTextColor="#222"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            <Ionicons name="search" size={22} color="#222" style={{ marginLeft: 8 }} />
          </View>
        </View>

        {/* Chips de filtros */}
        <View style={[styles.chipsContainer, { marginTop: 0, gap: 4 }]}>
          <TouchableOpacity style={styles.filterButtonSmall} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={16} color="#181028" style={{ marginRight: 4 }} />
            <Text style={styles.filterButtonTextSmall}>Filtrar</Text>
          </TouchableOpacity>
          {FILTER_CHIPS.filter(chip => chip.label !== 'Filtrar').map((chip) => (
            chip.label === 'Ordenar' ? (
              <TouchableOpacity key={chip.id} style={styles.chipSmall} activeOpacity={0.8}>
                <Text style={styles.chipTextSmall}>{chip.label}</Text>
                <Ionicons name="chevron-down" size={15} color="#181028" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={chip.id} style={styles.chipSmall} activeOpacity={0.8}>
                <Text style={styles.chipTextSmall}>{chip.label}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>

        {/* Lista de canchas */}
        <FlatList
          data={SPACES}
          renderItem={renderSpace}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 6,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 32,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
    paddingVertical: 0,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonText: {
    fontSize: 15,
    color: '#181028',
    fontWeight: '700',
  },
  filterButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginRight: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonTextSmall: {
    fontSize: 13,
    color: '#181028',
    fontWeight: '700',
  },
  chipSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginRight: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  chipTextSmall: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: SPACING.md,
    paddingTop: 0,
  },
  statusTagPill: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusTagTextPill: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '700',
  },
  nearbyCardV3: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  nearbyImageV3: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  nearbyInfoV3: {
    padding: 16,
  },
  nearbyNameV2: {
    fontSize: 18,
    color: '#181829',
    fontWeight: '700',
  },
  nearbyRatingV2: {
    fontSize: 14,
    color: '#181829',
    fontWeight: '700',
  },
  nearbyTypeV2: {
    fontSize: 14,
    color: '#A1A1B3',
    fontWeight: '500',
  },
  nearbyDataV2: {
    fontSize: 14,
    color: '#A1A1B3',
    fontWeight: '500',
  },
  nearbyDotV2: {
    fontSize: 14,
    color: '#A1A1B3',
    fontWeight: '500',
  },
  promoChipV2: {
    padding: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  promoChipTextV2: {
    fontSize: 13,
    color: '#181829',
    fontWeight: '700',
  },
}); 