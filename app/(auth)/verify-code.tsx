import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CODE_LENGTH = 6;
const MOCK_VERIFICATION_CODE = '123456'; // Para simulación

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      // Simular verificación de código
      if (code === MOCK_VERIFICATION_CODE) {
        // TODO: Verificar si el email existe en la base de datos
        const emailExists = false; // Simulamos que es un usuario nuevo
        if (emailExists) {
          router.replace('/(user)');
        } else {
          router.replace({
            pathname: '/(auth)/register',
            params: { email }
          });
        }
      }
    }
  }, [code]);

  const handleResendCode = () => {
    setIsResending(true);
    // Simular envío de código
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Verificar Código</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Ingresa el código de verificación enviado a:
        </Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.mockCodeInfo}>
          (Para desarrollo, usa el código: {MOCK_VERIFICATION_CODE})
        </Text>

        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          placeholder="Código de 6 dígitos"
          autoFocus
        />

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendCode}
          disabled={isResending}
        >
          <Text style={styles.resendText}>
            {isResending ? 'Reenviando...' : 'Reenviar código'}
          </Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 32,
  },
  mockCodeInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    width: '100%',
    marginBottom: 24,
  },
  resendButton: {
    padding: 16,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 