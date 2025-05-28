import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  const handleGuestAccess = () => {
    // TODO: Implementar lógica de acceso invitado
    router.replace('/(user)');
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar lógica de login con Google
    router.replace('/(auth)/register');
  };

  const handleEmailLogin = () => {
    router.push('/(auth)/email');
  };

  const handleProviderAccess = () => {
    router.push('/(auth)/provider');
  };

  return (
    <View style={styles.container}>
      {/* Imagen de fondo y sección superior */}
      <ImageBackground
        source={require('../../../assets/background.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.guestButtonContainer}>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestAccess}
              activeOpacity={0.7}
            >
              <Text style={styles.guestText}>Ahora no</Text>
            </TouchableOpacity>
          </View>
          
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* Sección inferior con botones */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <Ionicons name="logo-google" size={24} color="#000" />
          <Text style={styles.buttonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={handleEmailLogin}
        >
          <Ionicons name="mail-outline" size={24} color="#000" />
          <Text style={styles.buttonText}>Continuar con Correo Electrónico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.providerButton}
          onPress={handleProviderAccess}
        >
          <Text style={styles.providerText}>
            Acceso para Proveedores de Servicios/Espacios
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: width,
    height: height * 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  guestButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 999,
  },
  guestButton: {
    padding: 16,
    margin: 8,
  },
  guestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSection: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emailButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  providerButton: {
    marginTop: 20,
    padding: 10,
  },
  providerText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
}); 