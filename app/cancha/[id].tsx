import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const hours = Array.from({ length: 13 }, (_, i) => {
  const hour = (14 + i) % 24;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function CanchaDetailScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { name, location, rating } = params;
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  const reservar = async () => {
    const nuevaReserva = {
   id: Date.now().toString(),
    title: `Reserva en ${params.name}`,
    date: new Date().toISOString().split('T')[0],
    time: selectedHour,
    location: params.location,
  };

  try {
    const stored = await AsyncStorage.getItem('reservations');
    const parsed = stored ? JSON.parse(stored) : [];
    parsed.push(nuevaReserva);
    await AsyncStorage.setItem('reservations', JSON.stringify(parsed));

    console.log('✅ Reserva guardada correctamente:', parsed); // VERIFICACIÓN
    alert('Reserva confirmada');
  } catch (err) {
    console.error('❌ Error guardando la reserva:', err);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserva de: {name}</Text>
      <Text style={styles.subtitle}>Ubicación: {location}</Text>
      <Text style={styles.subtitle}>Rating: ⭐ {rating}</Text>

      <Text style={styles.subtitle}>Horarios disponibles:</Text>
      <FlatList
        data={hours}
        numColumns={3}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.hourButton,
              selectedHour === item && styles.selectedHour,
            ]}
            onPress={() => setSelectedHour(item)}
          >
            <Text style={styles.hourText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedHour && (
        <View style={styles.reserveBtn}>
          <Button title="Reservar" onPress={reservar} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { marginTop: 10, fontSize: 16 },
  hourButton: {
    backgroundColor: '#eee',
    padding: 10,
    margin: 5,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  selectedHour: {
    backgroundColor: '#3498db',
  },
  hourText: {
    color: '#000',
  },
  reserveBtn: {
    marginTop: 20,
  },
});

