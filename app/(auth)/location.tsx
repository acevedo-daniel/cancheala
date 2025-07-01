import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAppStore } from '../../store';

export default function LocationScreen() {
  const router = useRouter();
  const [manualLocation, setManualLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setLocation = useAppStore(state => state.setLocation);
  const setError = useAppStore(state => state.setError);

  const handleAllowLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
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
      } else {
        // Si el usuario rechaza, mostramos la opción de ubicación manual
        setIsLoading(false);
      }
    } catch (error) {
      setError('Error al obtener la ubicación');
      setIsLoading(false);
    }
  };

  const handleManualLocation = () => {
    if (manualLocation.trim()) {
      setLocation({
        id: 'manual',
        name: manualLocation.trim(),
        address: manualLocation.trim(),
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      });
      router.replace('/(user)');
    }
  };

  const handleSkip = () => {
    console.log('Ubicación omitida');
    router.replace('/(user)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Ubicación</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="location-outline" size={64} color="#007AFF" />
        <Text style={styles.subtitle}>¿Dónde te encuentras?</Text>
        <Text style={styles.description}>
          Necesitamos tu ubicación para mostrarte los servicios más cercanos
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleAllowLocation}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Obteniendo ubicación...' : 'Permitir ubicación'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>o</Text>

        <View style={styles.manualLocationContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu ciudad o barrio"
            value={manualLocation}
            onChangeText={setManualLocation}
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              !manualLocation.trim() && styles.buttonDisabled
            ]}
            onPress={handleManualLocation}
            disabled={!manualLocation.trim()}
          >
            <Text style={[styles.buttonText, !manualLocation.trim() && styles.buttonTextDisabled]}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Omitir por ahora</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    marginTop: Platform.OS === 'ios' ? 0 : 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 16,
    marginLeft: -8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginLeft: 16,
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    color: '#000000',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#00C853',
  },
  secondaryButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  orText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginVertical: 20,
  },
  manualLocationContainer: {
    width: '100%',
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#f8f8f8',
    color: '#000000',
  },
  skipButton: {
    marginTop: 24,
    padding: 16,
  },
  skipText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
}); 