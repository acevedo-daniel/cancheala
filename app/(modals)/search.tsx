import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../../constants';

const hashtags = [
  { id: '1', text: 'SoloPadel', searchTerm: 'padel' },
  { id: '2', text: 'LaMásValorada', searchTerm: 'mejor valorada' },
  { id: '3', text: 'DisponibleYaMismo', searchTerm: 'disponible ahora' },
  { id: '4', text: 'CanchasTechadas', searchTerm: 'techada' },
];

const trending = [
  { id: 1, title: 'Burger king', subtitle: 'Restaurantes' },
  { id: 2, title: 'Queso', subtitle: 'Comercios' },
  { id: 3, title: 'Mcdonalds', subtitle: 'Restaurantes' },
];

export const config = { headerShown: false };

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (filter) {
      // Mapear el nombre del filtro al término de búsqueda correspondiente
      const filterMap: { [key: string]: string } = {
        'Más cerca': 'más cercano',
        'Mejor precio': 'mejor precio',
        'Disponible ahora': 'disponible ahora',
      };
      
      const searchTerm = filterMap[filter] || filter;
      setSearchQuery(searchTerm);
    }
  }, [filter]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push({
        pathname: '/(modals)/search-results',
        params: { query: query.trim() }
      });
    }
  };

  const handleHashtagPress = (hashtag: typeof hashtags[0]) => {
    setSearchQuery(hashtag.searchTerm);
    handleSearch(hashtag.searchTerm);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff', flex: 1 }]}> 
      {/* Barra de búsqueda */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: 18, marginBottom: 24 }}>
        <TouchableOpacity
          style={{ padding: 4, marginRight: 6 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <View style={[styles.searchBar, { flex: 1, borderColor: '#111', borderWidth: 1, backgroundColor: '#F6F6F6', paddingVertical: 10 }]}> 
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar canchas, deportes..."
            placeholderTextColor="#222"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoFocus
          />
          <Ionicons name="search" size={22} color="#222" style={{ marginLeft: 8 }} />
        </View>
      </View>

      {/* Título */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#181028', marginLeft: SPACING.md, marginBottom: 12 }}>Búsquedas comunes</Text>

      {/* Chips de hashtags */}
      <View style={styles.hashtagsContainer}>
        {hashtags.map((hashtag) => (
          <TouchableOpacity
            key={hashtag.id}
            style={[
              styles.hashtagChip,
              { backgroundColor: '#fff', borderColor: '#e0e0e0', borderWidth: 1, shadowOpacity: 0.03 },
            ]}
            onPress={() => handleHashtagPress(hashtag)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 15, color: '#222', fontWeight: '500', paddingHorizontal: 2 }}>#{hashtag.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 32,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: '#111',
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
    paddingVertical: 0,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: 8,
  },
  hashtagChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
}); 