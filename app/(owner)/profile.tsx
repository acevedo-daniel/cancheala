import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import FotoPerfil from '../../assets/profile/FotoPerfil.png';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const AVATAR_SIZE = 90;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const EDIT_ICON_RIGHT_OFFSET = AVATAR_RADIUS - 10;

export default function OwnerProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(FotoPerfil);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const toggleModal = () => setModalVisible(!isModalVisible);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      setIsAuthenticated(!!user);
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setLastName(data.lastName || '');
          setEmail(data.email || user.email || '');
          if (data.photoURL) {
            setProfileImage({ uri: data.photoURL });
          } else {
            setProfileImage(FotoPerfil);
          }
        } else {
          setName(user.displayName || '');
          setEmail(user.email || '');
          setProfileImage(FotoPerfil);
        }
      } catch (error) {
        console.log('Error cargando datos:', error);
      }
      setLoading(false);
    };
    checkAuth();
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
      await AsyncStorage.setItem('ownerProfileImage', uri);
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
      await AsyncStorage.setItem('ownerProfileImage', uri);
      setProfileImage({ uri });
      toggleModal();
    }
  };

  const handleBorrarImagen = async () => {
    await AsyncStorage.removeItem('ownerProfileImage');
    setProfileImage(FotoPerfil);
    toggleModal();
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      router.replace('/(auth)');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
      console.log(error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name,
          lastName,
          email: email || user.email || '',
        },
        { merge: true },
      );
      Alert.alert('Éxito', 'Datos actualizados correctamente.');
      setEditMode(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los datos.');
      console.log(error);
    }
    setSaving(false);
  };

  if (loading || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { paddingTop: insets.top, justifyContent: 'center', flex: 1 },
        ]}
      >
        <View style={styles.unauthContent}>
          <View style={styles.avatarContainer}>
            <Image source={FotoPerfil} style={styles.avatar} />
          </View>
          <Text style={styles.unauthTitle}>¡Bienvenido a Cancheala!</Text>
          <Text style={styles.unauthSubtitle}>
            Inicia sesión o regístrate para acceder a tu perfil de proveedor.
          </Text>
          <TouchableOpacity
            style={[styles.authButton, styles.loginButton]}
            onPress={() => router.replace('/(owner)/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.authButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authButton, styles.registerButton]}
            onPress={() => router.replace('/(owner)/register')}
            activeOpacity={0.85}
          >
            <Text style={styles.authButtonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Mi Perfil de Proveedor</Text>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Feather name={editMode ? 'x' : 'edit-2'} size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={profileImage} style={styles.avatar} />
          {editMode && (
            <TouchableOpacity style={styles.editIcon} onPress={toggleModal}>
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Info/Formulario */}
        <View style={styles.infoContainer}>
          {editMode ? (
            <>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre"
              />
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Apellido"
              />
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                value={email}
                editable={false}
                selectTextOnFocus={false}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.item}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{name || '\u2014'}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Apellido</Text>
                <Text style={styles.value}>{lastName || '\u2014'}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Correo electrónico</Text>
                <Text style={styles.value}>{email || '\u2014'}</Text>
              </View>
            </>
          )}
        </View>

        {/* Configuraciones */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Configuraciones</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Modal para seleccionar foto */}
        <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
          <View
            style={{ backgroundColor: 'white', borderRadius: 16, padding: 24 }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}
            >
              Cambiar foto de perfil
            </Text>
            <TouchableOpacity
              style={{ marginBottom: 16 }}
              onPress={pickImageFromGallery}
            >
              <Text style={{ fontSize: 16 }}>Seleccionar de la galería</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginBottom: 16 }}
              onPress={takePhotoWithCamera}
            >
              <Text style={{ fontSize: 16 }}>Tomar una foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginBottom: 16 }}
              onPress={handleBorrarImagen}
            >
              <Text style={{ fontSize: 16, color: 'red' }}>
                Eliminar foto actual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={{ fontSize: 16, color: 'gray' }}>Cancelar</Text>
            </TouchableOpacity>
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
    backgroundColor: '#3a8d59',
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
  unauthContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unauthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3a8d59',
  },
  unauthSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  authButton: {
    width: 180,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#3a8d59',
  },
  registerButton: {
    backgroundColor: '#f57c00',
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#3a8d59',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
