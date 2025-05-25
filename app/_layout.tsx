import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Simula checkeo async de auth (ej: token guardado)
    setTimeout(() => {
      // Simulamos que el usuario NO está logueado (false)
      setIsLoggedIn(false);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isLoggedIn) {
        // Si está logueado, redirigimos a /player o /club según rol
        router.replace('/player');
      } else {
        // Si NO está logueado, redirigimos a auth
        router.replace('/auth');
      }
    }
  }, [loading, isLoggedIn]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Mientras redirige, no renderizamos nada
  return <Stack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
