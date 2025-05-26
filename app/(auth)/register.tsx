// app/(auth)/register.tsx
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
import DateTimePicker from '@react-native-community/datetimepicker';

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
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginLeft: 16,
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  subtitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 32,
    color: '#000000',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
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
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#fff',
    color: '#000000',
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
    fontFamily: 'Inter-SemiBold',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
  skipButton: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  skipText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  genderButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  genderButtonTextSelected: {
    color: '#FFFFFF',
  },
});

export default function RegisterScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    birthDate: '',
    gender: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    if (!formData.birthDate.trim()) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    } else {
      // Validar formato DD/MM/YYYY
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!dateRegex.test(formData.birthDate)) {
        newErrors.birthDate = 'Formato inválido. Usa DD/MM/YYYY';
      } else {
        const [day, month, year] = formData.birthDate.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const currentDate = new Date();
        
        if (date > currentDate) {
          newErrors.birthDate = 'La fecha no puede ser futura';
        } else if (year < 1900) {
          newErrors.birthDate = 'Año inválido';
        }
      }
    }
    if (!formData.gender) {
      newErrors.gender = 'Selecciona tu género';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (text: string) => {
    // Eliminar todo excepto números
    const numbers = text.replace(/[^\d]/g, '');
    
    // Formatear como DD/MM/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: Guardar datos del usuario
      console.log('Datos del usuario:', { email, ...formData });
      router.replace('/(auth)/location');
    }
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
        <Text style={styles.subtitle}>¿Quién eres?</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Tu nombre"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Tu apellido"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              autoCapitalize="words"
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={[styles.input, errors.birthDate && styles.inputError]}
              placeholder="DD/MM/YYYY"
              value={formData.birthDate}
              onChangeText={(text) => setFormData({ ...formData, birthDate: formatDate(text) })}
              keyboardType="number-pad"
              maxLength={10}
            />
            {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Género</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'M' && styles.genderButtonSelected,
                  errors.gender && styles.inputError
                ]}
                onPress={() => setFormData({ ...formData, gender: 'M' })}
              >
                <Text style={[
                  styles.genderButtonText,
                  formData.gender === 'M' && styles.genderButtonTextSelected
                ]}>Masculino</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'F' && styles.genderButtonSelected,
                  errors.gender && styles.inputError
                ]}
                onPress={() => setFormData({ ...formData, gender: 'F' })}
              >
                <Text style={[
                  styles.genderButtonText,
                  formData.gender === 'F' && styles.genderButtonTextSelected
                ]}>Femenino</Text>
              </TouchableOpacity>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              (!formData.name || !formData.lastName || !formData.birthDate || !formData.gender) && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!formData.name || !formData.lastName || !formData.birthDate || !formData.gender}
          >
            <Text style={[styles.buttonText, (!formData.name || !formData.lastName || !formData.birthDate || !formData.gender) && styles.buttonTextDisabled]}>
              Continuar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace('/(auth)/location')}
          >
            <Text style={styles.skipText}>Omitir por ahora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}