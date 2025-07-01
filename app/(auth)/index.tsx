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
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const { width, height } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '648569611606-l966vbagm0r0p4qgs8256s6k081h4rm8.apps.googleusercontent.com',
    androidClientId:
      '648569611606-l966vbagm0r0p4qgs8256s6k081h4rm8.apps.googleusercontent.com',
    iosClientId:
      '648569611606-2v6k7v6q7v6k7v6k7v6k7v6k7v6k7v6k.apps.googleusercontent.com', // Cambia esto si tienes un clientId de iOS
  });

  React.useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;
          // Verificar si el usuario ya existe en Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            // Si es nuevo, guardar datos básicos
            await setDoc(doc(db, 'users', user.uid), {
              name: user.displayName || '',
              email: user.email || '',
              role: 'user',
            });
          }
          router.replace('/(user)');
        } catch (e) {
          alert('Error al iniciar sesión con Google: ' + (e as any).message);
        }
      }
    };
    signInWithGoogle();
  }, [response]);

  const handleGoogleLogin = async () => {
    promptAsync();
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
            <Ionicons
              name="mail-outline"
              size={20}
              color="#fff"
              style={styles.leftIcon}
            />
            <Text style={[styles.buttonText, styles.emailButtonText]}>
              Continuar con correo electrónico
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.providerTextButton}
            onPress={handleProviderAccess}
          >
            <Text style={styles.providerText}>
              Acceso para proveedores de servicios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerTextButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{' '}
              <Text style={{ color: '#00C853', fontWeight: 'bold' }}>
                Regístrate
              </Text>
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
  registerTextButton: {
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
  },
  registerText: {
    color: '#444',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
  },
});
