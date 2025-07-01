import React, { useEffect, useState } from 'react';

import { SplashScreen, router, Stack } from 'expo-router';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'user' | 'owner' | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Redireccionamiento
  useEffect(() => {
    async function prepare() {
      try {
        if (!fontsLoaded) return;
        await SplashScreen.hideAsync();
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
  }, [isLoading, userRole, fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
        <Stack.Screen name="(owner)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00C853',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loader: {
    transform: [{ scale: 1.5 }],
  },
});
