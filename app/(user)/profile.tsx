import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AVATAR_SIZE = 90;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const EDIT_ICON_RIGHT_OFFSET = AVATAR_RADIUS - 10;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const FotoPerfil = require('../../assets/profile/FotoPerfil.png');

  const [profileImage, setProfileImage] = useState(FotoPerfil);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');

  const toggleModal = () => setModalVisible(!isModalVisible);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedAge = await AsyncStorage.getItem('age');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedDni = await AsyncStorage.getItem('dni');
        const storedImage = await AsyncStorage.getItem('profileImage');

        if (storedName) setName(storedName);
        if (storedAge) setAge(storedAge);
        if (storedEmail) setEmail(storedEmail);
        if (storedDni) setDni(storedDni);
        if (storedImage) setProfileImage({ uri: storedImage });
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
    };

    loadProfileData();
  }, []);

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permiso requerido',
        'Se necesita permiso para acceder a la galería.',
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      await AsyncStorage.setItem('profileImage', uri);
      setProfileImage({ uri });
      toggleModal();
    }
  };

  const takePhotoWithCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permiso requerido',
        'Se necesita permiso para usar la cámara.',
      );
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      await AsyncStorage.setItem('profileImage', uri);
      setProfileImage({ uri });
      toggleModal();
    }
  };

  const handleBorrarImagen = async () => {
    await AsyncStorage.removeItem('profileImage');
    setProfileImage(FotoPerfil);
    toggleModal();
  };

  const handleLogout = () => {
    console.log('Cerrar sesión pulsado');
    router.replace('/(auth)');
  };

  const renderItem = (label: string, value: string) => (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Mi Perfil</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={profileImage} style={styles.avatar} />
          <TouchableOpacity style={styles.editIcon} onPress={toggleModal}>
            <Feather name="edit-2" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          {renderItem('Nombre y Apellido', name)}
          {renderItem('Correo electrónico', email)}
          {renderItem('Edad', age)}
          {renderItem('DNI', dni)}
        </View>

        {/* Configuraciones */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Configuraciones</Text>
          <TouchableOpacity
            style={styles.configItem}
            onPress={() => router.push('/(user)/favourites')}
          >
            <Ionicons name="heart-outline" size={18} color="gray" />
            <Text style={styles.configText}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.configItem}
            onPress={() => router.push('/(user)/configNotifications')}
          >
            <Ionicons name="notifications-outline" size={18} color="gray" />
            <Text style={styles.configText}>Notificaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.configItem}
            onPress={() => router.push('/(user)/forgotPassword')}
          >
            <MaterialIcons name="password" size={18} color="gray" />
            <Text style={styles.configText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="exit-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          backdropOpacity={0.6}
          style={styles.modalBottom}
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.modalButton}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.modalButtonText}>Elegir desde galería</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={takePhotoWithCamera}>
              <Text style={styles.modalButtonText}>Tomar una foto</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: '#ff4d4d' }]}
              onPress={handleBorrarImagen}
            >
              <Text style={styles.modalButtonText}>Borrar imagen</Text>
            </Pressable>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_RADIUS,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: EDIT_ICON_RIGHT_OFFSET,
    backgroundColor: '#f57c00',
    borderRadius: 12,
    padding: 5,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  label: {
    color: '#888',
    fontSize: 13,
  },
  value: {
    color: '#000',
    fontSize: 14,
    marginTop: 2,
  },
  settingsContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  configText: {
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
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
});
