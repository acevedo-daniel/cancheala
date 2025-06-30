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
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING } from '../../constants';

const hashtags = [
  { id: '1', text: '#mas-cercano', searchTerm: 'más cercano' },
  { id: '2', text: '#mejor-precio', searchTerm: 'mejor precio' },
  { id: '3', text: '#disponible-ahora', searchTerm: 'disponible ahora' },
];

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
        pathname: '/(user)/search-results',
        params: { query: query.trim() }
      });
    }
  };

  const handleHashtagPress = (hashtag: typeof hashtags[0]) => {
    setSearchQuery(hashtag.searchTerm);
    handleSearch(hashtag.searchTerm);
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buscar</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar canchas, deportes..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.hashtagsContainer}>
          {hashtags.map((hashtag) => (
            <TouchableOpacity
              key={hashtag.id}
              style={styles.hashtagItem}
              onPress={() => handleHashtagPress(hashtag)}
              activeOpacity={0.7}
            >
              <Text style={styles.hashtagText}>{hashtag.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAvoidingView>
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
  searchContainer: {
    padding: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: SPACING.xs,
  },
  hashtagsContainer: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  hashtagItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  hashtagText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
}); 