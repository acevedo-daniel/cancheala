import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function OwnerLoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      navigation.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  const handleGoBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/(auth)');
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Completa ambos campos');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(owner)');
    } catch (e: any) {
      setError('Correo o contraseña incorrectos');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Acceso para proveedores</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              (!email || !password) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!email || !password || loading}
          >
            <Text
              style={[
                styles.buttonText,
                (!email || !password) && styles.buttonTextDisabled,
              ]}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/(owner)/register')}
        >
          <Text style={styles.registerButtonText}>
            ¿No tienes cuenta? Registrarse como proveedor
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    marginTop: Platform.OS === 'ios' ? 0 : 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 16,
    marginLeft: -8,
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#000000',
    textAlign: 'center',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000000',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#00C853',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
  registerButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 12,
  },
  registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
