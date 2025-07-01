import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FavouritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.replace('/(user)/profile')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: insets.top,
            paddingHorizontal: 16,
            marginBottom: 10,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={{ marginLeft: 5, fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
        <View style={styles.centerContent}>
          <Ionicons
            name="heart-dislike-outline"
            size={64}
            color="#ff4d4d"
            style={{ marginBottom: 18 }}
          />
          <Text style={styles.text}>Aún no tienes favoritos</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
});
