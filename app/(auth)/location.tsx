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

export default function LocationScreen() {
  const router = useRouter();
  const [manualLocation, setManualLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAllowLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        // TODO: Guardar la ubicación
        router.replace('/(user)');
      } else {
        // Si el usuario rechaza, mostramos la opción de ubicación manual
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      setIsLoading(false);
    }
  };

  const handleManualLocation = () => {
    if (manualLocation.trim()) {
      // TODO: Guardar la ubicación manual
      router.replace('/(user)');
    }
  };

  const handleSkip = () => {
    router.replace('/(user)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/register')}
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
            {isLoading ? 'Obteniendo ubicación...' : 'Permitir Ubicación'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>o</Text>

        <View style={styles.manualLocationContainer}>
          <TextInput
            style={styles.input}
            placeholder="Introduce tu ciudad o barrio"
            value={manualLocation}
            onChangeText={setManualLocation}
          />
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleManualLocation}
            disabled={!manualLocation.trim()}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Ahora no</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 16,
  },
  manualLocationContainer: {
    width: '100%',
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  skipButton: {
    marginTop: 20,
    padding: 16,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
}); 