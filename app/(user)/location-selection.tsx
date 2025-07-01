// app/(user)/location-selection.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ui/ScreenContainer';
import * as Location from 'expo-location';
import { useAppStore } from '../../store';

export default function LocationSelectionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [address, setAddress] = useState('');
  const setLocation = useAppStore(state => state.setLocation);
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleSaveLocation = () => {
    setLocation({
      id: 'manual',
      name: address,
      address: address,
      coordinates: null,
    });
    router.replace('/(user)');
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoading(true);
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        setLoading(false);
        setLoadingLocation(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      const coords = location.coords;
      // Geocoding inverso para obtener la dirección real
      let address = 'Ubicación actual';
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude });
        if (geocode && geocode.length > 0) {
          const g = geocode[0];
          address = `${g.street || ''} ${g.name || ''}, ${g.city || g.region || ''}`.trim();
        }
      } catch (geoError) {
        // Si falla el geocoding, se mantiene 'Ubicación actual'
      }
      setLocation({
        id: 'current',
        name: address,
        address: address,
        coordinates: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
      router.replace('/(user)');
    } catch (error) {
      setError('No se pudo obtener la ubicación actual');
    } finally {
      setLoading(false);
      setLoadingLocation(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Seleccionar ubicación</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
            disabled={loadingLocation}
          >
            <Ionicons name="location" size={24} color="#00C853" />
            <Text style={styles.currentLocationText}>
              Usar mi ubicación actual
            </Text>
            {loadingLocation && (
              <ActivityIndicator size="small" color="#00C853" style={{ marginLeft: 10 }} />
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ingresa una dirección</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Ej: Falucho 257"
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !address && styles.saveButtonDisabled]}
            onPress={handleSaveLocation}
            disabled={!address}
          >
            <Text style={styles.saveButtonText}>Guardar ubicación</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 12,
  },
  currentLocationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#00C853',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
