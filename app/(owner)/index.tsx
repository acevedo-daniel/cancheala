// app/(owner)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function OwnerHomeScreen() {
  const handleLogout = () => {
    console.log("Cerrando sesión de propietario");
    router.replace('/(auth)'); // Volver a la sección de autenticación
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, Propietario!</Text>
      <Text style={styles.subtitle}>Aquí puedes gestionar tus canchas y reservas.</Text>

      {/* Más contenido específico para el propietario */}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffe0e0', // Fondo rojo claro para el propietario
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8b0000',
  },
  subtitle: {
    fontSize: 18,
    color: '#b22222',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});