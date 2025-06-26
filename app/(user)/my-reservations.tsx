import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
 import Card from '../../components/ui/Card'; 





const mockReservations = [
  {
    id: '1',
    title: 'Reserva en Cancha A',
    date: '2025-07-01',
    time: '18:00',
    location: 'Complejo Las Palmas',
  },
  {
    id: '2',
    title: 'Reserva en Cancha B',
    date: '2025-07-03',
    time: '20:00',
    location: 'Club Atlético Norte',
  },
];

type Reservation = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
};

export default function MyReservationsScreen() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (reservation: any) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReservation(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Reservas</Text>
      <FlatList
        data={mockReservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
  <Card
  space={{
    id: item.id,
    name: item.title,
    rating: 0, // o el rating real si está disponible
    address: item.location,
    image: '', // o la URL real de la imagen si está disponible
    location: item.location, // asegúrate de que 'location' esté presente
    // agrega otras propiedades requeridas por Space si es necesario
  }}
  onPress={() => openModal(item)}
/>

        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles de la Reserva</Text>
            {selectedReservation && (
              <>
                <Text>Cancha: {selectedReservation.title}</Text>
                <Text>Fecha: {selectedReservation.date}</Text>
                <Text>Hora: {selectedReservation.time}</Text>
                <Text>Lugar: {selectedReservation.location}</Text>

                <Pressable style={styles.cancelButton} onPress={() => {}}>
                  <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                </Pressable>
              </>
            )}
            <Pressable onPress={closeModal}>
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    marginBottom: SPACING.sm,
  },
  cancelButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.error || 'red',
    padding: SPACING.sm,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  closeText: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    color: COLORS.primary || 'blue',
  },
});