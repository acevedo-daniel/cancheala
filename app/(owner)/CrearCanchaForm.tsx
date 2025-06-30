import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // <-- Importa useRouter
import { SafeAreaView } from 'react-native-safe-area-context';

export type Cancha = {
  id: string;
  nombre: string;
  imageUri: string | null;
  precio: string;
  descripcion: string;
  direccionTexto: string;
  ubicacionMapa: { latitude: number; longitude: number } | null;
  puntuacion: number;
  suelo: 'cesped' | 'hormigon' | 'madera';
};

export default function CrearCanchaForm() {
  const router = useRouter(); // <-- Obtén router con el hook

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
  const [suelo, setSuelo] = useState<'cesped' | 'hormigon' | 'madera'>(
    'cesped',
  );

  const [modalMapaVisible, setModalMapaVisible] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos permiso para acceder a la galería',
        );
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

  const abrirSelectorUbicacion = () => {
    setModalMapaVisible(true);
  };

  const confirmarUbicacion = () => {
    if (region) {
      setUbicacionMapa({
        latitude: region.latitude,
        longitude: region.longitude,
      });
      setModalMapaVisible(false);
    } else {
      Alert.alert('Error', 'Por favor, selecciona una ubicación en el mapa.');
    }
  };

  const resetForm = () => {
    setNombre('');
    setImageUri(null);
    setPrecio('');
    setDescripcion('');
    setDireccionTexto('');
    setUbicacionMapa(null);
    setPuntuacion('');
    setSuelo('cesped');
  };

  const handleSave = async () => {
    if (
      !nombre.trim() ||
      !precio.trim() ||
      !descripcion.trim() ||
      !direccionTexto.trim() ||
      !puntuacion.trim() ||
      !suelo.trim()
    ) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
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
      suelo,
    };

    try {
      const jsonValue = await AsyncStorage.getItem('@canchas');
      const canchasGuardadas: Cancha[] =
        jsonValue != null ? JSON.parse(jsonValue) : [];

      canchasGuardadas.push(newCancha);

      await AsyncStorage.setItem('@canchas', JSON.stringify(canchasGuardadas));

      Alert.alert('Éxito', 'Cancha guardada correctamente.');
      resetForm();
      router.back(); // <-- Usar router.back() para ir atrás
    } catch (error) {
      console.error('Error guardando cancha:', error);
      Alert.alert('Error', 'No se pudo guardar la cancha.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20 }}
      >
        <Text style={styles.title}>Publicar Cancha</Text>

        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
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
          placeholder="Dirección (ej: Calle Falsa 123)"
          style={styles.input}
          value={direccionTexto}
          onChangeText={setDireccionTexto}
        />

        <TouchableOpacity
          style={[styles.button, { marginBottom: 10 }]}
          onPress={abrirSelectorUbicacion}
        >
          <Text style={styles.buttonText}>Seleccionar ubicación en mapa</Text>
        </TouchableOpacity>

        {ubicacionMapa && (
          <Text style={styles.coordenadasText}>
            Ubicación seleccionada: {ubicacionMapa.latitude.toFixed(6)},{' '}
            {ubicacionMapa.longitude.toFixed(6)}
          </Text>
        )}

        <Text style={styles.label}>Seleccione tipo de suelo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={suelo}
            onValueChange={(itemValue) => setSuelo(itemValue)}
            mode="dropdown"
            style={{ color: '#00C853' }}
          >
            <Picker.Item label="Césped" value="cesped" />
            <Picker.Item label="Hormigón" value="hormigon" />
            <Picker.Item label="Madera" value="madera" />
          </Picker>
        </View>

        <TextInput
          placeholder="Puntuación (1-10)"
          style={styles.input}
          keyboardType="numeric"
          value={puntuacion}
          onChangeText={setPuntuacion}
          maxLength={2}
        />

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginRight: 10 }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: '#999' }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
            onRegionChangeComplete={setRegion}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#00C853',
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
  coordenadasText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    color: '#00C853',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: '#f5f8f5',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
