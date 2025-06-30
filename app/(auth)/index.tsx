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
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from '../../constants';

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
            isGoogleUser: 'true',
          },
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
    router.replace('/(owner)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/backgrounds/background.jpg')}
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
          <Text style={styles.loginTitle}>Elegí cómo querés ingresar</Text>
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
            <Ionicons name="mail-outline" size={20} color="#fff" style={styles.leftIcon} />
            <Text style={[styles.buttonText, styles.emailButtonText]}>Continuar con correo electrónico</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.providerTextButton}
            onPress={handleProviderAccess}
          >
            <Text style={styles.providerText}>
              Acceso para proveedores de servicios
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    width: width,
    height: height * 0.65,
    justifyContent: 'flex-start',
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  backgroundImageStyle: {
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
  },
  skipText: {
    color: COLORS.text.light,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
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
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#18102B',
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: 0.1,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
    minHeight: 56,
    shadowColor: 'transparent',
  },
  googleButton: {
    backgroundColor: '#f6f6f8',
  },
  emailButton: {
    backgroundColor: '#00C853',
  },
  providerTextButton: {
    marginTop: 2,
    paddingVertical: 6,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18102B',
    flex: 1,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    letterSpacing: 0.1,
  },
  emailButtonText: {
    color: '#fff',
  },
  providerText: {
    color: '#444',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
    textDecorationLine: 'none',
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  leftIcon: {
    marginRight: 12,
  },
});
