import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Cancha = {
  id: string;
  nombre: string; // <--- agregado
  imageUri: string | null;
  precio: string;
  descripcion: string;
  direccion: string;
  puntuacion: number;
};

export default function CanchasScreen() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);

  useEffect(() => {
    loadCanchas();
  }, []);

  const loadCanchas = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@canchas');
      if (jsonValue != null) {
        setCanchas(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading canchas', e);
    }
  };

  const renderCancha = ({ item }: { item: Cancha }) => (
    <View style={styles.canchaItem}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.canchaImage} />
      ) : (
        <View style={[styles.canchaImage, styles.noImage]}>
          <Text style={{ color: '#666' }}>Sin imagen</Text>
        </View>
      )}
      <View style={styles.canchaInfo}>
        <Text style={styles.canchaNombre}>{item.nombre}</Text>
        <Text style={styles.precio}>Precio: ${item.precio}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.direccion}>Dirección: {item.direccion}</Text>
        <View style={styles.puntuacionContainer}>
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text style={styles.puntuacionText}>{item.puntuacion}/10</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {canchas.length === 0 ? (
          <Text style={styles.emptyText}>
            No está ofreciendo ninguna cancha en este momento.
          </Text>
        ) : (
          <FlatList
            data={canchas}
            keyExtractor={(item) => item.id}
            renderItem={renderCancha}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6f4ea',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#2c6e49',
    textAlign: 'center',
    marginTop: 50,
  },
  listContainer: {
    paddingBottom: 20,
  },
  canchaItem: {
    backgroundColor: '#c5e1c7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
  },
  canchaImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a5caa7',
    borderRadius: 8,
  },
  canchaInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  canchaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c6e49',
    marginBottom: 6,
  },
  precio: {
    fontWeight: 'bold',
    color: '#2c6e49',
    marginBottom: 6,
  },
  descripcion: {
    color: '#3a8d59',
    marginBottom: 4,
  },
  direccion: {
    color: '#3a8d59',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  puntuacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puntuacionText: {
    marginLeft: 6,
    color: '#2c6e49',
    fontWeight: 'bold',
  },
});
