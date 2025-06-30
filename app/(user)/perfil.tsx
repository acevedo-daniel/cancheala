import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/FotoPerfil.png')} style={styles.avatar} />
      <Text style={styles.name}>José Usuario</Text>
      <Text style={styles.email}>jose@email.com</Text>
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 18 },
  name: { fontWeight: 'bold', fontSize: 20, marginBottom: 4 },
  email: { color: '#666', fontSize: 15, marginBottom: 24 },
  logoutBtn: { backgroundColor: '#d32f2f', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 