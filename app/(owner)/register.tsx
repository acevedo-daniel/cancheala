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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function OwnerRegisterScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/(owner)/login');
    }
  };

  const validate = () => {
    if (!formData.name.trim()) return 'El nombre es requerido';
    if (!formData.email.trim()) return 'El correo es requerido';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      return 'Correo inválido';
    if (!formData.password.trim()) return 'La contraseña es requerida';
    if (formData.password.length < 6) return 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword)
      return 'Las contraseñas no coinciden';
    return '';
  };

  const handleSubmit = async () => {
    setError('');
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'admin',
      });
      router.replace('/(owner)');
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado');
      } else {
        setError('Error al registrar: ' + e.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      navigation.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

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
        <Text style={styles.subtitle}>Registro de proveedor</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@correo.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
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
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              (!formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword) &&
                styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              loading
            }
          >
            <Text
              style={[
                styles.buttonText,
                (!formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword) &&
                  styles.buttonTextDisabled,
              ]}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Text>
          </TouchableOpacity>
        </View>
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
});
