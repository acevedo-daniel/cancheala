import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EventType } from '../../types';

const EVENT_TYPES = [
  { label: 'Promoción', value: EventType.PROMOTION },
  { label: 'Torneo', value: EventType.TOURNAMENT },
  { label: 'Noticia', value: EventType.NEWS },
  { label: 'Mantenimiento', value: EventType.MAINTENANCE },
  { label: 'Oferta especial', value: EventType.SPECIAL_OFFER },
];

export default function CrearEventoScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(EventType.PROMOTION);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [isActive, setIsActive] = useState(true);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Crear Evento</Text>

        <TextInput
          placeholder="Título"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Descripción"
          style={[styles.input, { height: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Tipo de evento</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type}
            onValueChange={setType}
            mode="dropdown"
            style={{ color: '#00C853' }}
          >
            {EVENT_TYPES.map((opt) => (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Ionicons name="image" size={32} color="#00C853" />
          ) : (
            <Text style={styles.imagePickerText}>Seleccionar imagen</Text>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Fecha (ej: 2024-07-01)"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />

        <TextInput
          placeholder="Ubicación"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          placeholder="Precio (opcional)"
          style={styles.input}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          placeholder="Descuento (%) (opcional)"
          style={styles.input}
          keyboardType="numeric"
          value={discount}
          onChangeText={setDiscount}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={[
              styles.switch,
              isActive ? styles.switchActive : styles.switchInactive,
            ]}
            onPress={() => setIsActive(!isActive)}
          >
            <Ionicons
              name={isActive ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={isActive ? '#00C853' : '#ccc'}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 10,
              color: isActive ? '#00C853' : '#888',
              fontWeight: 'bold',
            }}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#00C853' }]}
          disabled
        >
          <Text style={styles.buttonText}>Crear Evento (Visual)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
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
  imagePicker: {
    backgroundColor: '#e0e8df',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#3a8d59',
    fontSize: 16,
  },
  switch: {
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00C853',
  },
  switchActive: {
    backgroundColor: '#e0f7e9',
  },
  switchInactive: {
    backgroundColor: '#f0f0f0',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
