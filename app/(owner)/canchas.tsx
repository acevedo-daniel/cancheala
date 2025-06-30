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
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import CrearCanchaForm from './CrearCanchaForm';

type Cancha = {
  id: string;
  nombre: string;
  imageUri: string | null;
  precio: string;
  descripcion: string;
  direccionTexto: string; // dirección escrita
  ubicacionMapa: { latitude: number; longitude: number } | null; // coordenadas mapa
  puntuacion: number;
  suelo?: 'césped' | 'hormigón' | 'madera'; // NUEVO campo opcional
};

export default function CanchasScreen() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [canchaDetalle, setCanchaDetalle] = useState<Cancha | null>(null);
  const [filtroPrecio, setFiltroPrecio] = useState('todos');
  const [sueloEdit, setSueloEdit] = useState<
    'césped' | 'hormigón' | 'madera' | undefined
  >(undefined);
  const [filtroSuelo, setFiltroSuelo] = useState<
    'todos' | 'césped' | 'hormigón' | 'madera'
  >('todos');

  // Estados para edición
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [canchaEditando, setCanchaEditando] = useState<Cancha | null>(null);

  // Campos del formulario edición
  const [nombreEdit, setNombreEdit] = useState('');
  const [precioEdit, setPrecioEdit] = useState('');
  const [descripcionEdit, setDescripcionEdit] = useState('');
  const [direccionTextoEdit, setDireccionTextoEdit] = useState('');
  const [latEdit, setLatEdit] = useState('');
  const [lngEdit, setLngEdit] = useState('');
  const [puntuacionEdit, setPuntuacionEdit] = useState('');

  // Al inicio del componente
  const [busqueda, setBusqueda] = useState('');

  // Función para filtrar canchas
  const filtrarCanchas = () => {
    return canchas.filter((cancha) => {
      const coincideBusqueda = cancha.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const precioNum = Number(cancha.precio);
      let coincidePrecio = true;

      switch (filtroPrecio) {
        case '<5000':
          coincidePrecio = precioNum < 5000;
          break;
        case '5000-10000':
          coincidePrecio = precioNum >= 5000 && precioNum <= 10000;
          break;
        case '>10000':
          coincidePrecio = precioNum > 10000;
          break;
        default:
          coincidePrecio = true; // todos
      }

      let coincideSuelo = true;
      if (filtroSuelo !== 'todos') {
        coincideSuelo = cancha.suelo === filtroSuelo;
      }

      return coincideBusqueda && coincidePrecio && coincideSuelo;
    });
  };

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

    // Cargo datos en los inputs
    setNombreEdit(cancha.nombre);
    setPrecioEdit(cancha.precio);
    setDescripcionEdit(cancha.descripcion);
    setDireccionTextoEdit(cancha.direccionTexto);
    setPuntuacionEdit(cancha.puntuacion.toString());
    setSueloEdit(cancha.suelo);

    if (cancha.ubicacionMapa) {
      setLatEdit(cancha.ubicacionMapa.latitude.toString());
      setLngEdit(cancha.ubicacionMapa.longitude.toString());
    } else {
      setLatEdit('');
      setLngEdit('');
    }

    setModalEditarVisible(true);
  };

  const guardarEdicion = async () => {
    if (!canchaEditando) return;

    // Validaciones básicas
    if (!nombreEdit.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }
    if (!precioEdit.trim() || isNaN(Number(precioEdit))) {
      Alert.alert('Error', 'Precio inválido.');
      return;
    }
    if (!puntuacionEdit.trim() || isNaN(Number(puntuacionEdit))) {
      Alert.alert('Error', 'Puntuación inválida.');
      return;
    }

    const puntuacionNum = Number(puntuacionEdit);
    if (puntuacionNum < 0 || puntuacionNum > 10) {
      Alert.alert('Error', 'La puntuación debe estar entre 0 y 10.');
      return;
    }

    let ubicacionMapa = null;
    if (latEdit.trim() && lngEdit.trim()) {
      const latNum = Number(latEdit);
      const lngNum = Number(lngEdit);
      if (
        isNaN(latNum) ||
        isNaN(lngNum) ||
        latNum < -90 ||
        latNum > 90 ||
        lngNum < -180 ||
        lngNum > 180
      ) {
        Alert.alert('Error', 'Coordenadas inválidas.');
        return;
      }
      ubicacionMapa = { latitude: latNum, longitude: lngNum };
    }

    const canchaActualizada: Cancha = {
      ...canchaEditando,
      nombre: nombreEdit,
      precio: precioEdit,
      descripcion: descripcionEdit,
      direccionTexto: direccionTextoEdit,
      ubicacionMapa,
      puntuacion: puntuacionNum,
    };

    const nuevasCanchas = canchas.map((c) =>
      c.id === canchaEditando.id ? canchaActualizada : c,
    );
    setCanchas(nuevasCanchas);
    await AsyncStorage.setItem('@canchas', JSON.stringify(nuevasCanchas));
    setModalEditarVisible(false);
    setCanchaEditando(null);
  };

  const handleMostrarDetalle = (cancha: Cancha) => {
    setCanchaDetalle(cancha);
    setModalDetalleVisible(true);
  };

  const renderCancha = ({ item }: { item: Cancha }) => (
    <TouchableOpacity
      style={styles.canchaItem}
      activeOpacity={0.8}
      onPress={() => handleMostrarDetalle(item)}
    >
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.canchaImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.canchaImage, styles.noImage]}>
            <Text style={{ color: '#999' }}>Sin imagen</Text>
          </View>
        )}
      </View>
      <View style={styles.canchaInfo}>
        <Text style={styles.canchaNombre} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={styles.precio}>${item.precio}</Text>
        <Text style={styles.descripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <Text style={styles.direccion} numberOfLines={1}>
          {item.direccionTexto}
        </Text>
        {item.suelo && (
          <Text style={styles.sueloText}>Suelo: {item.suelo}</Text>
        )}
        <View style={styles.puntuacionContainer}>
          <Ionicons name="star" size={16} color="#f4c10f" />
          <Text style={styles.puntuacionText}>{item.puntuacion}/10</Text>
        </View>

        {/* Botones editar y eliminar */}
        <View style={styles.accionesContainer}>
          <TouchableOpacity
            style={styles.botonEditar}
            onPress={(e) => {
              e.stopPropagation();
              handleEditarCancha(item);
            }}
          >
            <Feather name="edit-3" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonEliminar}
            onPress={(e) => {
              e.stopPropagation();
              handleEliminarCancha(item.id);
            }}
          >
            <Feather name="trash-2" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 16,
            fontSize: 16,
          }}
          placeholder="Buscar cancha por nombre..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <Text
          style={{
            marginBottom: 6,
            fontSize: 16,
            color: '#222',
            fontWeight: '600',
          }}
        >
          Filtrar por precio:
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 16,
          }}
        >
          <Picker
            selectedValue={filtroPrecio}
            onValueChange={(itemValue) => setFiltroPrecio(itemValue)}
          >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Menos de $5000" value="<5000" />
            <Picker.Item label="Entre $5000 y $10000" value="5000-10000" />
            <Picker.Item label="Más de $10000" value=">10000" />
          </Picker>
        </View>

        <Text
          style={{
            marginBottom: 6,
            fontSize: 16,
            color: '#222',
            fontWeight: '600',
          }}
        >
          Filtrar por suelo:
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 16,
          }}
        >
          <Picker
            selectedValue={filtroSuelo}
            onValueChange={(itemValue) => setFiltroSuelo(itemValue)}
          >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Césped" value="cesped" />
            <Picker.Item label="Hormigón" value="hormigon" />
            <Picker.Item label="Madera" value="madera" />
          </Picker>
        </View>

        {canchas.length === 0 ? (
          <Text style={styles.emptyText}>
            No está ofreciendo ninguna cancha en este momento.
          </Text>
        ) : (
          <FlatList
            data={filtrarCanchas()} // ← reemplaza canchas por esto
            keyExtractor={(item) => item.id}
            renderItem={renderCancha}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Modal Detalle */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDetalleVisible}
        onRequestClose={() => setModalDetalleVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { padding: 20 }]}>
            <ScrollView>
              {canchaDetalle && (
                <>
                  <View style={styles.detalleImageContainer}>
                    {canchaDetalle.imageUri ? (
                      <Image
                        source={{ uri: canchaDetalle.imageUri }}
                        style={styles.detalleImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.detalleImage, styles.noImage]}>
                        <Text style={{ color: '#999' }}>Sin imagen</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.detalleNombre}>
                    {canchaDetalle.nombre}
                  </Text>
                  <Text style={styles.detallePrecio}>
                    ${canchaDetalle.precio}
                  </Text>
                  <Text style={styles.detalleDescripcion}>
                    {canchaDetalle.descripcion}
                  </Text>
                  <Text style={styles.detalleDireccion}>
                    Dirección: {canchaDetalle.direccionTexto}
                  </Text>
                  {canchaDetalle.suelo && (
                    <Text
                      style={[
                        styles.detalleSuelo,
                        { textAlign: 'center', marginBottom: 10 },
                      ]}
                    >
                      Suelo: {canchaDetalle.suelo}
                    </Text>
                  )}
                  <View style={styles.puntuacionContainer}>
                    <Ionicons name="star" size={20} color="#f4c10f" />
                    <Text style={[styles.puntuacionText, { fontSize: 18 }]}>
                      {canchaDetalle.puntuacion}/10
                    </Text>
                  </View>

                  {canchaDetalle.ubicacionMapa && (
                    <View style={styles.mapaContainer}>
                      <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                          latitude: canchaDetalle.ubicacionMapa.latitude,
                          longitude: canchaDetalle.ubicacionMapa.longitude,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        }}
                      >
                        <Marker coordinate={canchaDetalle.ubicacionMapa} />
                      </MapView>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.modalBtnCancelar, { marginTop: 20 }]}
                    onPress={() => setModalDetalleVisible(false)}
                  >
                    <Text style={styles.modalBtnText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditarVisible}
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContainer, { padding: 20 }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Editar Cancha</Text>

              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={nombreEdit}
                onChangeText={setNombreEdit}
                placeholder="Nombre"
              />

              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={precioEdit}
                onChangeText={setPrecioEdit}
                placeholder="Precio"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={descripcionEdit}
                onChangeText={setDescripcionEdit}
                placeholder="Descripción"
                multiline
              />

              <Text style={styles.label}>Suelo</Text>
              <Picker
                selectedValue={sueloEdit}
                onValueChange={(value) => setSueloEdit(value)}
                style={{ marginBottom: 12 }}
              >
                <Picker.Item label="Ninguno" value={undefined} />
                <Picker.Item label="Césped" value="césped" />
                <Picker.Item label="Hormigón" value="hormigón" />
                <Picker.Item label="Madera" value="madera" />
              </Picker>

              <Text style={styles.label}>Dirección (texto)</Text>
              <TextInput
                style={styles.input}
                value={direccionTextoEdit}
                onChangeText={setDireccionTextoEdit}
                placeholder="Dirección"
              />

              <Text style={styles.label}>Latitud (mapa)</Text>
              <TextInput
                style={styles.input}
                value={latEdit}
                onChangeText={setLatEdit}
                placeholder="Latitud"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Longitud (mapa)</Text>
              <TextInput
                style={styles.input}
                value={lngEdit}
                onChangeText={setLngEdit}
                placeholder="Longitud"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Puntuación (0-10)</Text>
              <TextInput
                style={styles.input}
                value={puntuacionEdit}
                onChangeText={setPuntuacionEdit}
                placeholder="Puntuación"
                keyboardType="numeric"
              />

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[
                    styles.modalBtnCancelar,
                    { flex: 1, marginRight: 10 },
                  ]}
                  onPress={() => setModalEditarVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtnGuardar, { flex: 1 }]}
                  onPress={guardarEdicion}
                >
                  <Text style={styles.modalBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f2f2' },
  container: { flex: 1, padding: 20 },
  emptyText: {
    fontSize: 18,
    color: '#2c6e49',
    textAlign: 'center',
    marginTop: 50,
  },
  listContainer: { paddingBottom: 20 },
  canchaItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#eee',
  },
  canchaImage: { width: '100%', height: '100%' },
  noImage: { justifyContent: 'center', alignItems: 'center' },
  canchaInfo: { flex: 1 },
  canchaNombre: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  precio: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00C853',
    marginBottom: 6,
  },
  descripcion: { fontSize: 14, color: '#444', marginBottom: 4 },
  direccion: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  puntuacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  puntuacionText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  accionesContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  botonEditar: {
    backgroundColor: '#3D8BFF',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  botonEliminar: {
    backgroundColor: '#E14434',
    padding: 10,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: { backgroundColor: 'white', borderRadius: 14, padding: 24 },
  detalleImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  detalleImage: { width: '100%', height: '100%' },
  detalleNombre: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  detallePrecio: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00C853',
    marginBottom: 12,
    textAlign: 'center',
  },
  detalleDescripcion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'justify',
  },
  detalleDireccion: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalBtnCancelar: {
    backgroundColor: '#E14434',
    padding: 14,
    borderRadius: 8,
    flex: 1,
  },
  modalBtnGuardar: {
    backgroundColor: '#3D8BFF',
    padding: 14,
    borderRadius: 8,
    flex: 1,
  },
  modalBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mapaContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sueloText: {
    fontSize: 14,
    color: '#00796b',
    fontWeight: '600',
    marginBottom: 6,
  },

  detalleSuelo: {
    fontSize: 16,
    color: '#00796b',
    fontWeight: '700',
  },
});
