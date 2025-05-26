// app/(auth)/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implementar autenticación con Google
      // Por ahora simulamos que el usuario es nuevo y necesita registrarse
      const isNewUser = true; // Esto vendría de la respuesta de Google

      if (isNewUser) {
        // Si es un usuario nuevo, lo enviamos al registro con datos mock de Google
        router.push({
          pathname: '/(auth)/register',
          params: {
            email: 'usuario@gmail.com',
            firstName: 'Usuario',
            lastName: 'Google',
            isGoogleUser: 'true'
          }
        });
      } else {
        // Si es un usuario existente, lo enviamos al home
        router.replace('/(user)');
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      // TODO: Mostrar mensaje de error al usuario
    }
  };

  const handleEmailLogin = () => {
    router.push('/(auth)/email');
  };

  const handleGuestAccess = () => {
    // El acceso como invitado va directamente a la solicitud de ubicación
    router.push('/(auth)/location');
  };

  const handleProviderAccess = () => {
    // Por ahora este botón no hace nada, como se especifica en el documento
    console.log('Acceso para proveedores - No implementado en esta fase');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleGuestAccess}
        >
          <Text style={styles.skipText}>Omitir por ahora</Text>
        </TouchableOpacity>

        {/* <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Cancheala</Text>
        </View> */}
      </ImageBackground>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <Image
            source={{ uri: 'https://www.google.com/favicon.ico' }}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={handleEmailLogin}
        >
          <Text style={[styles.buttonText, styles.emailButtonText]}>
            Continuar con correo electrónico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.providerButton}
          onPress={handleProviderAccess}
        >
          <Text style={styles.providerText}>
            Acceso para proveedores de servicios
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
    height: height * 0.65,
    justifyContent: 'flex-start',
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  backgroundImageStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emailButton: {
    backgroundColor: '#00C853',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  emailButtonText: {
    color: '#FFFFFF',
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 12,
  },
  providerButton: {
    marginTop: 'auto',
    padding: 16,
    alignItems: 'center',
  },
  providerText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});