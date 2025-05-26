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

// SplashScreen.preventAutoHideAsync(); // Opcional: Descomenta para controlar la splash screen manualmente.
                                    // Por ahora, Expo la ocultará automáticamente al cargar el primer componente.

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
    if (!fontsLoaded) return;

    // --- SIMULACIÓN DE PROCESO DE AUTENTICACIÓN ---
    // En una aplicación real, aquí:
    // 1. Verificarías si hay un token de sesión guardado (ej. en AsyncStorage).
    // 2. Si hay un token, harías una llamada a tu API para validarlo y obtener el rol del usuario.
    // 3. Establecerías userRole y setIsLoading(false).
    const timer = setTimeout(() => {
      // Descomenta UNA de las siguientes líneas para probar:
      // setUserRole('user');  // Simula un usuario normal (jugador) autenticado
      // setUserRole('owner'); // Simula un usuario propietario de club autenticado
      setUserRole(null);    // Simula que el usuario NO está autenticado (irá al login)
      setIsLoading(false);
      // SplashScreen.hideAsync(); // Opcional: Si usaste preventAutoHideAsync()
    }, 2000); // Simula 2 segundos de carga

    return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
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
    // Muestra un indicador de carga mientras se verifica el estado de autenticación
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C853" />
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
    backgroundColor: '#fff',
  },
});