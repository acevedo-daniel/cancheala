import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LocationSelectionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [address, setAddress] = useState('');

  const handleSaveLocation = () => {
    // TODO: Implementar lógica para guardar la ubicación
    router.replace('/(user)/home');
  };

  const handleUseCurrentLocation = () => {
    // TODO: Implementar lógica para obtener ubicación actual
    router.replace('/(user)/home');
  };

  return (
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
        >
          <Ionicons name="location" size={24} color="#00C853" />
          <Text style={styles.currentLocationText}>
            Usar mi ubicación actual
          </Text>
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
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
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
