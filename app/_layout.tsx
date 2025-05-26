// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { SplashScreen, router } from 'expo-router'; // Para manejar la splash screen
import { Stack } from 'expo-router'; // Componente de navegación y objeto router
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // Componentes UI básicos
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Prevenimos que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  // Simula el rol del usuario: 'user', 'owner', o null (no autenticado)
  const [userRole, setUserRole] = useState<'user' | 'owner' | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Esperamos a que las fuentes estén cargadas
        if (!fontsLoaded) return;

        // Ocultamos el splash screen nativo
        await SplashScreen.hideAsync();

        // Esperamos un momento antes de continuar
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Actualizamos el estado
        setUserRole(null);
        setIsLoading(false);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      if (userRole === 'user') {
        router.replace('/(user)');
      } else if (userRole === 'owner') {
        router.replace('/(owner)');
      } else {
        router.replace('/(auth)');
      }
    }
  }, [isLoading, userRole, fontsLoaded]); // Se ejecuta cuando isLoading o userRole cambian

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color="#FFFFFF" 
          style={styles.loader}
        />
      </View>
    );
  }

  // Si la carga terminó, renderiza el Stack principal de navegación.
  // Los grupos de rutas (auth), (user), (owner) serán los "hijos" principales de este Stack.
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(user)" options={{ headerShown: false }} />
      <Stack.Screen name="(owner)" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00C853',
  },
  loader: {
    transform: [{ scale: 1.5 }],
  },
});