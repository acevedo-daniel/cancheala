// app/(user)/canchas.tsx

import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ReservationsContext } from '../context/ReservationsContext';
import { useRouter } from 'expo-router';

export default function CanchasScreen() {
  const { mockCanchas, favoritos, toggleFavorito } = useContext(ReservationsContext);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {mockCanchas.map((cancha) => (
        <View key={cancha.id} style={styles.canchaCard}>
          <TouchableOpacity onPress={() => router.push(`/cancha/${cancha.id}`)}>
            <Image source={cancha.imagen} style={styles.canchaImg} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => router.push(`/cancha/${cancha.id}`)}>
              <Text style={styles.canchaName}>{cancha.nombre}</Text>
            </TouchableOpacity>
            <Text style={styles.canchaDir}>{cancha.direccion}</Text>
            <Text style={styles.canchaStar}>★ {cancha.rating}</Text>
          </View>
          <TouchableOpacity style={styles.reservarBtn} onPress={() => router.push(`/cancha/${cancha.id}`)}>
            <Text style={styles.reservarBtnText}>Reservar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorito(cancha.id)}>
            <Text style={favoritos.includes(cancha.id) ? styles.favIconActive : styles.favIcon}>❤️</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  canchaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 10, marginBottom: 10, elevation: 1 },
  canchaImg: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  canchaName: { fontWeight: 'bold', fontSize: 15 },
  canchaDir: { color: '#666', fontSize: 12 },
  canchaStar: { color: '#FFD600', fontWeight: 'bold', marginTop: 2 },
  reservarBtn: { backgroundColor: '#00C853', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, marginLeft: 8 },
  reservarBtnText: { color: '#fff', fontWeight: 'bold' },
  favIcon: { fontSize: 18, color: '#bbb', marginLeft: 8 },
  favIconActive: { fontSize: 18, color: '#e53935', marginLeft: 8 },
});
