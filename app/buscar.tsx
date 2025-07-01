import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Modal, Pressable, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SPACES } from '../mocks/data';

export default function BuscarScreen() {
  const [query, setQuery] = useState('');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const filteredSpaces = SPACES.filter(space =>
    space.name.toLowerCase().includes(query.toLowerCase()) ||
    space.location.toLowerCase().includes(query.toLowerCase())
  );

  const handleCardPress = (item) => {
    setSelectedSpace(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Buscar Canchas</Text>
      </View>
      <View style={styles.searchBarSticky}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre o ubicación..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#aaa"
        />
      </View>
      <FlatList
        data={filteredSpaces}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={60} color="#eee" />
            <Text style={styles.emptyText}>No se encontraron canchas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
            <Image source={item.image} style={styles.cardImg} resizeMode="cover" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardLocation}>{item.location}</Text>
              <View style={styles.cardRow}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        style={{ flex: 1 }}
      />
      {/* Modal Detalle de Cancha */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Detalle de Cancha</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#222" />
              </Pressable>
            </View>
            {selectedSpace && (
              <>
                <Image source={selectedSpace.image} style={styles.modalImg} resizeMode="cover" />
                {selectedSpace.specs?.available && (
                  <View style={styles.badgeDisponible}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Disponible</Text></View>
                )}
                <Text style={styles.modalTitle}>{selectedSpace.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={{ marginLeft: 4, fontWeight: 'bold' }}>{selectedSpace.rating}</Text>
                  <Text style={{ color: '#888', marginLeft: 6, fontSize: 13 }}>({selectedSpace.specs?.reviews} reseñas)</Text>
                  <View style={styles.priceBadge}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{`$${selectedSpace.specs?.price.toLocaleString()}/hora`}</Text></View>
                </View>
                <Text style={{ color: '#666', fontSize: 14, marginBottom: 2 }}><Ionicons name="location-outline" size={14} color="#888" /> {selectedSpace.location}</Text>
                <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Dirección: {selectedSpace.address}</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 8, marginBottom: 2 }}>Servicios incluidos:</Text>
                {selectedSpace.specs?.services?.map((serv, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Ionicons name={serv.icon} size={18} color="#00C853" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#444', fontSize: 14 }}>{serv.label}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.reservarBtnModal}
                  onPress={() => {
                    setModalVisible(false);
                    Alert.alert('Reserva', 'Reserva realizada con éxito');
                  }}
                >
                  <Text style={styles.reservarBtnTextModal}>Reservar Ahora</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  backBtn: {
    marginRight: 10,
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  searchBarSticky: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    marginHorizontal: 8,
    position: 'relative',
    zIndex: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#222',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 1,
    padding: 10,
    marginHorizontal: 8,
  },
  cardImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginLeft: 3,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#bbb',
    fontSize: 18,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'stretch',
  },
  modalImg: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  badgeDisponible: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 2,
  },
  priceBadge: {
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 2,
    color: '#222',
  },
  reservarBtnModal: {
    backgroundColor: '#00C853',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  reservarBtnTextModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 