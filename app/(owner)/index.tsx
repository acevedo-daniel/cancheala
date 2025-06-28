import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

type Cancha = {
  id: string;
  nombre: string;
  imageUri: string | null;
  precio: string;
  descripcion: string;
  direccion: string;
  puntuacion: number;
};

export default function OwnerHomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [nombre, setNombre] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  const [puntuacion, setPuntuacion] = useState('');

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
      !direccion.trim() ||
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
      direccion,
      puntuacion: puntuacionNum,
    };
    const newCanchas = [...canchas, newCancha];
    saveCanchas(newCanchas);

    // Limpiar formulario
    setNombre('');
    setImageUri(null);
    setPrecio('');
    setDescripcion('');
    setDireccion('');
    setPuntuacion('');
    setModalVisible(false);
  };

  const handleBack = () => {
    router.replace('/(auth)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Flecha de retroceso */}
      <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
        <Feather name="arrow-left" size={28} color="#2c6e49" />
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
            <ScrollView>
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

              <TextInput
                placeholder="Dirección"
                style={styles.input}
                value={direccion}
                onChangeText={setDireccion}
              />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c6e49',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#3a8d59',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3a8d59',
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
    color: '#2c6e49',
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
    color: '#2c6e49',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
