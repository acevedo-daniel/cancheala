import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';

type Cancha = {
  id: string;
  nombre: string;
  imageUri: string | null;
  precio: string;
  descripcion: string;
  direccionTexto: string; // Dirección escrita
  ubicacionMapa: { latitude: number; longitude: number } | null; // Coordenadas
  puntuacion: number;
};

export default function OwnerHomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [nombre, setNombre] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccionTexto, setDireccionTexto] = useState('');
  const [ubicacionMapa, setUbicacionMapa] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [puntuacion, setPuntuacion] = useState('');

  const [modalMapaVisible, setModalMapaVisible] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const insets = useSafeAreaInsets();

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

  const saveCanchas = async (newCanchas: Cancha[]) => {
    try {
      await AsyncStorage.setItem('@canchas', JSON.stringify(newCanchas));
      setCanchas(newCanchas);
    } catch (e) {
      console.error('Error saving canchas', e);
    }
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso para acceder a la galería es necesario!');
        return;
      }
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error('Error picking image:', e);
    }
  };

  const handleSaveCancha = () => {
    if (
      !nombre.trim() ||
      !precio.trim() ||
      !descripcion.trim() ||
      !direccionTexto.trim() ||
      !puntuacion.trim()
    ) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const puntuacionNum = Number(puntuacion);
    if (isNaN(puntuacionNum) || puntuacionNum < 1 || puntuacionNum > 10) {
      Alert.alert('Error', 'La puntuación debe ser un número entre 1 y 10.');
      return;
    }

    const newCancha: Cancha = {
      id: Date.now().toString(),
      nombre,
      imageUri,
      precio,
      descripcion,
      direccionTexto,
      ubicacionMapa,
      puntuacion: puntuacionNum,
    };

    const newCanchas = [...canchas, newCancha];
    saveCanchas(newCanchas);

    setNombre('');
    setImageUri(null);
    setPrecio('');
    setDescripcion('');
    setDireccionTexto('');
    setUbicacionMapa(null);
    setPuntuacion('');
    setModalVisible(false);
  };

  const handleBack = () => {
    router.replace('/(auth)');
  };

  // Abrir modal selector de mapa
  const abrirSelectorUbicacion = () => {
    setModalMapaVisible(true);
  };

  // Confirmar ubicación seleccionada en el mapa
  const confirmarUbicacion = () => {
    if (region) {
      setUbicacionMapa({
        latitude: region.latitude,
        longitude: region.longitude,
      });
      setModalMapaVisible(false);
    } else {
      alert('Por favor, seleccioná una ubicación en el mapa.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.backIcon, { top: insets.top + 10 }]}
        onPress={handleBack}
      >
        <Feather name="arrow-left" size={28} color="#00C853" />
      </TouchableOpacity>

      <Text style={styles.title}>¡Bienvenido, Propietario!</Text>
      <Text style={styles.subtitle}>
        Aquí puedes gestionar tus canchas y reservas.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Agregar Cancha</Text>
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Agregar Nueva Cancha</Text>

              <TextInput
                placeholder="Nombre"
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
              />

              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <Text style={styles.imagePickerText}>
                    Tocar para seleccionar imagen
                  </Text>
                )}
              </TouchableOpacity>

              <TextInput
                placeholder="Precio"
                style={styles.input}
                keyboardType="numeric"
                value={precio}
                onChangeText={setPrecio}
              />

              <TextInput
                placeholder="Descripción"
                style={[styles.input, { height: 80 }]}
                multiline
                value={descripcion}
                onChangeText={setDescripcion}
              />

              {/* Campo dirección texto */}
              <TextInput
                placeholder="Dirección (ej: Calle Falsa 123)"
                style={styles.input}
                value={direccionTexto}
                onChangeText={setDireccionTexto}
              />

              {/* Botón para abrir selector de mapa */}
              <TouchableOpacity
                style={[styles.button, { marginBottom: 10 }]}
                onPress={abrirSelectorUbicacion}
              >
                <Text style={styles.buttonText}>
                  Seleccionar ubicación en mapa
                </Text>
              </TouchableOpacity>

              {/* Mostrar coordenadas seleccionadas */}
              {ubicacionMapa && (
                <Text style={styles.coordenadasText}>
                  Ubicación seleccionada: {ubicacionMapa.latitude.toFixed(6)},{' '}
                  {ubicacionMapa.longitude.toFixed(6)}
                </Text>
              )}

              <TextInput
                placeholder="Puntuación (1-10)"
                style={styles.input}
                keyboardType="numeric"
                value={puntuacion}
                onChangeText={setPuntuacion}
                maxLength={2}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { flex: 1, marginRight: 10 }]}
                  onPress={handleSaveCancha}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { flex: 1, backgroundColor: '#999' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal mapa */}
      <Modal
        visible={modalMapaVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            region={region}
            onRegionChangeComplete={(reg) => setRegion(reg)}
          >
            <Marker coordinate={region} />
          </MapView>

          <View
            style={{
              position: 'absolute',
              bottom: 30,
              left: 20,
              right: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flex: 1, marginRight: 10, backgroundColor: '#999' },
              ]}
              onPress={() => setModalMapaVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { flex: 1, backgroundColor: '#00C853' }]}
              onPress={confirmarUbicacion}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#3a8d59',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#3a8d59',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00C853',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#00C853',
  },
  imagePicker: {
    backgroundColor: '#e0e8df',
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#3a8d59',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#f5f8f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#00C853',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  coordenadasText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
});
