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
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPress={() => handleMostrarDetalle(item)}
    >
      <View style={styles.cardImageWrapper}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.noImage]}>
            <Text style={{ color: '#999' }}>Sin imagen</Text>
          </View>
        )}

        {/* Badge de puntuación sobre la imagen */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#fff" />
          <Text style={styles.ratingText}>{item.puntuacion}/10</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={styles.cardDireccion} numberOfLines={1}>
          {item.direccionTexto}
        </Text>

        {item.suelo && (
          <View style={styles.cardRow}>
            <Ionicons name="layers-outline" size={16} color="#2196f3" />
            <Text style={styles.cardText}>Suelo: {item.suelo}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.cardPrecio}>${item.precio}</Text>

          <View style={styles.cardButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation();
                handleEditarCancha(item);
              }}
            >
              <Feather name="edit" size={16} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleEliminarCancha(item.id);
              }}
            >
              <Feather name="trash" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acá irán todas las canchas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
