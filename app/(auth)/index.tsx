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
    // Por ahora este botón no hace nada, como se especifica en el documento
    console.log('Acceso para proveedores - No implementado en esta fase');
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
    padding: SPACING.xl,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  button: {
    width: '100%',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  googleButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emailButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
  },
  emailButtonText: {
    color: COLORS.text.light,
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: SPACING.md,
  },
  providerButton: {
    marginTop: SPACING.md,
  },
  providerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
