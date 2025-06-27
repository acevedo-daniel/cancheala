import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function CanchaDetailScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const { name, location, rating } = params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text>📍 Ubicación: {location}</Text>
      <Text>⭐ Rating: {rating}</Text>

      <Text style={styles.section}>Horarios Disponibles:</Text>
      <Text>🕒 14:00, 15:00, 16:00</Text>

      <View style={styles.reserveButton}>
        <Button title="Reservar" onPress={() => alert('Reserva confirmada')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  section: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  reserveButton: { marginTop: 30 },
});
