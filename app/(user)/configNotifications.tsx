import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.container]}>
        <TouchableOpacity
          onPress={() => router.replace('/(user)/profile')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: insets.top,
            paddingHorizontal: 16,
            marginBottom: 10,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={{ marginLeft: 5, fontSize: 16 }}>Volver</Text>
        </TouchableOpacity>
        <View style={styles.subContainer}>
          <Text style={styles.text}>Notificaciones</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.toggleButton, enabled && styles.activeButton]}
              onPress={() => setEnabled(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="notifications"
                size={22}
                color={enabled ? '#fff' : '#3a8d59'}
              />
              <Text style={[styles.toggleText, enabled && styles.activeText]}>
                Activar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !enabled && styles.activeButton]}
              onPress={() => setEnabled(false)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="notifications-off"
                size={22}
                color={!enabled ? '#fff' : '#3a8d59'}
              />
              <Text style={[styles.toggleText, !enabled && styles.activeText]}>
                Desactivar
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a8d59',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  activeButton: {
    backgroundColor: '#3a8d59',
    borderColor: '#3a8d59',
  },
  toggleText: {
    marginLeft: 10,
    color: '#3a8d59',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeText: {
    color: '#fff',
  },
});
