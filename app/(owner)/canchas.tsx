import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

type Cancha = {
  id: string;
  nombre: string;
  imageUri: string | null;
  precio: string;
  descripcion: string;
  direccion: string;
  puntuacion: number;
};

export default function CanchasScreen() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [canchaEditando, setCanchaEditando] = useState<Cancha | null>(null);

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

  const handleEliminarCancha = (id: string) => {
    Alert.alert(
      'Eliminar cancha',
      '¿Estás seguro de que querés eliminar esta cancha?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const nuevasCanchas = canchas.filter((cancha) => cancha.id !== id);
            setCanchas(nuevasCanchas);
            await AsyncStorage.setItem(
              '@canchas',
              JSON.stringify(nuevasCanchas),
            );
          },
        },
      ],
    );
  };

  const handleEditarCancha = (cancha: Cancha) => {
    setCanchaEditando(cancha);
    setModalVisible(true);
  };

  const guardarEdicion = async () => {
    if (!canchaEditando) return;

    const nuevasCanchas = canchas.map((c) =>
      c.id === canchaEditando.id ? canchaEditando : c,
    );
    setCanchas(nuevasCanchas);
    await AsyncStorage.setItem('@canchas', JSON.stringify(nuevasCanchas));
    setModalVisible(false);
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
        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={styles.botonAccion}
            onPress={() => handleEditarCancha(item)}
          >
            <Feather name="edit" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botonAccion, { backgroundColor: '#a10000' }]}
            onPress={() => handleEliminarCancha(item.id)}
          >
            <Feather name="trash-2" size={18} color="white" />
          </TouchableOpacity>
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

      {/* Modal de edición */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Editar Cancha</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={canchaEditando?.nombre}
                onChangeText={(text) =>
                  setCanchaEditando((prev) =>
                    prev ? { ...prev, nombre: text } : prev,
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Precio"
                keyboardType="numeric"
                value={canchaEditando?.precio}
                onChangeText={(text) =>
                  setCanchaEditando((prev) =>
                    prev ? { ...prev, precio: text } : prev,
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={canchaEditando?.descripcion}
                onChangeText={(text) =>
                  setCanchaEditando((prev) =>
                    prev ? { ...prev, descripcion: text } : prev,
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={canchaEditando?.direccion}
                onChangeText={(text) =>
                  setCanchaEditando((prev) =>
                    prev ? { ...prev, direccion: text } : prev,
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Puntuación"
                keyboardType="numeric"
                value={canchaEditando?.puntuacion.toString()}
                onChangeText={(text) =>
                  setCanchaEditando((prev) =>
                    prev
                      ? { ...prev, puntuacion: parseFloat(text) || 0 }
                      : prev,
                  )
                }
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalBtnGuardar}
                  onPress={guardarEdicion}
                >
                  <Text style={styles.modalBtnText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBtnCancelar}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
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
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  canchaImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
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
    color: '#555',
    marginBottom: 4,
  },
  direccion: {
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  puntuacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  puntuacionText: {
    marginLeft: 6,
    color: '#2c6e49',
    fontWeight: 'bold',
  },
  accionesContainer: {
    flexDirection: 'row',
  },
  botonAccion: {
    backgroundColor: '#2c6e49',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalBtnGuardar: {
    backgroundColor: '#2c6e49',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
  },
  modalBtnCancelar: {
    backgroundColor: '#a10000',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
  },
  modalBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
