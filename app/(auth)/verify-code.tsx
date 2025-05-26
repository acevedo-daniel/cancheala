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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CODE_LENGTH = 6;
const MOCK_VERIFICATION_CODE = '123456'; // Para simulación
const MOCK_EXISTING_EMAILS = ['usuario@existente.com']; // Emails que simulan usuarios existentes

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      // Simular verificación de código
      if (code === MOCK_VERIFICATION_CODE) {
        // Verificar si el email existe en la base de datos
        const emailExists = MOCK_EXISTING_EMAILS.includes(email as string);
        if (emailExists) {
          console.log('Usuario existente, redirigiendo a home');
          router.replace('/(user)');
        } else {
          console.log('Usuario nuevo, redirigiendo a registro');
          router.replace({
            pathname: '/(auth)/register',
            params: { email }
          });
        }
      } else {
        setError('Código incorrecto');
      }
    } else {
      setError('');
    }
  }, [code]);

  const handleResendCode = () => {
    setIsResending(true);
    setError('');
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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Verifica tu correo</Text>

        <View style={styles.form}>
          <Text style={styles.infoText}>
            Hemos enviado un código de verificación a:
          </Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código de verificación</Text>
            <TextInput
              style={[
                styles.input,
                error && styles.inputError,
                isFocused && styles.inputFocused
              ]}
              value={code}
              onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              placeholder="Código de 6 dígitos"
              autoFocus
              selectionColor="#00C853"
              caretHidden={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

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
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
    color: '#000000',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#000000',
  },
  inputFocused: {
    borderColor: '#00C853',
    borderWidth: 2,
    backgroundColor: '#f8fff8',
  },
  inputError: {
    borderColor: '#00C853',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#00C853',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  resendButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  resendText: {
    color: '#00C853',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
}); 