import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import ScreenContainer from '../../components/ui/ScreenContainer';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState(false);
  // Estados para editar campos
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isAgeEditable, setIsAgeEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isDniEditable, setIsDniEditable] = useState(false);

  const [name, setName] = useState('Ej: Lautaro Perez');
  const [age, setAge] = useState('Ej: 23');
  const [email, setEmail] = useState('Ej: correo@example.com');
  const [dni, setDni] = useState('Ej: 12345678');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCambiarImagen = () => {
    console.log('Cambiar Imagen');
    toggleModal();
  };

  const handleBorrarImagen = () => {
    console.log('Borrar Imagen');
    toggleModal();
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    console.log('Cerrar sesión pulsado');
    router.replace('/(auth)');
  };

  return (
    <ScreenContainer>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
        </View>

        {/* Imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/profiles/FotoPerfil.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImage} onPress={toggleModal}>
            <Feather name="edit" style={styles.editImage} />
          </TouchableOpacity>
        </View>

        {/* Datos */}
        <View style={styles.DataContainer}>
          {/* Nombre */}
          <Text style={styles.label}>Nombre y Apellido</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={isNameEditable}
            />
            <TouchableOpacity
              onPress={() => setIsNameEditable(!isNameEditable)}
            >
              <Feather
                name={isNameEditable ? 'check-square' : 'edit'}
                style={isNameEditable ? styles.saveIcon : styles.editIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Edad */}
          <Text style={styles.label}>Edad</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              editable={isAgeEditable}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => setIsAgeEditable(!isAgeEditable)}>
              <Feather
                name={isAgeEditable ? 'check-square' : 'edit'}
                style={isAgeEditable ? styles.saveIcon : styles.editIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Correo */}
          <Text style={styles.label}>Correo</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={isEmailEditable}
              keyboardType="email-address"
            />
            <TouchableOpacity
              onPress={() => setIsEmailEditable(!isEmailEditable)}
            >
              <Feather
                name={isEmailEditable ? 'check-square' : 'edit'}
                style={isEmailEditable ? styles.saveIcon : styles.editIcon}
              />
            </TouchableOpacity>
          </View>

          {/* DNI */}
          <Text style={styles.label}>DNI</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={dni}
              onChangeText={setDni}
              editable={isDniEditable}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => setIsDniEditable(!isDniEditable)}>
              <Feather
                name={isDniEditable ? 'check-square' : 'edit'}
                style={isDniEditable ? styles.saveIcon : styles.editIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Modal Imagen */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          backdropOpacity={0.6}
          style={styles.modalBottom}
        >
          <View style={styles.modalContainer}>
            <Pressable style={styles.modalButton} onPress={handleCambiarImagen}>
              <Text style={styles.modalButtonText}>Cambiar Imagen</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: '#ff4d4d' }]}
              onPress={handleBorrarImagen}
            >
              <Text style={styles.modalButtonText}>Borrar Imagen</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    paddingTop: 16,
    alignItems: 'center', // centrado horizontal
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginLeft: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
  },
  imageContainer: {
    position: 'relative',
    width: 130,
    marginBottom: SPACING.xl,
    alignSelf: 'center', // centra la imagen
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  editImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    fontSize: 20,
    borderRadius: 10,
    padding: 6,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    padding: 20,
  },
  modalButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalBottom: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  input: {
    borderWidth: 3,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 210,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  DataContainer: {
    marginTop: SPACING.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    justifyContent: 'center',
    alignItems: 'center', // centrar horizontal
    width: '90%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: '#9b9b9b',
    padding: 5,
    borderRadius: 10,
    margin: 5,
    marginBottom: 15,
  },
  saveIcon: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: COLORS.primary,
    padding: 5,
    borderRadius: 10,
    margin: 5,
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
