import Card from '../../components/ui/Card';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function MyReservationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Mis Reservas</Text>
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>
          No tienes reservas.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
});
