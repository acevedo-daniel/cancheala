import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Button,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import Card from '../../components/ui/Card';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReservations, Reservation } from '../context/ReservationsContext';

type GroupedReservation = {
  id: string;
  title: string;
  date: string;
  times: string[];
  location: string;
};

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
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    marginBottom: 5,
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
    fontWeight: 'bold',
  },
  closeText: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    color: COLORS.primary || 'blue',
  },
});

export default function MyReservationsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { reservations, setReservations } = useReservations();
  const [selectedReservation, setSelectedReservation] = useState<GroupedReservation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  if (!params?.name) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mis Reservas</Text>
        <FlatList
          data={Object.values(
            reservations.reduce((acc, curr) => {
              const key = `${curr.title}-${curr.date}`;
              if (!acc[key]) {
                acc[key] = {
                  id: curr.id,
                  title: curr.title,
                  date: curr.date,
                  times: [curr.time],
                  location: curr.location,
                };
              } else {
                acc[key].times.push(curr.time);
              }
              return acc;
            }, {} as Record<string, GroupedReservation>)
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              space={{
                id: item.id,
                name: `${item.title} (${item.times.join(', ')})`,
                rating: 0,
                address: item.location,
                image: { uri: '' },
                location: item.location,
              }}
              onPress={() => {
                setSelectedReservation(item);
                setModalVisible(true);
              }}
            />
          )}
        />
        {/* Modal de detalles para reservas existentes */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setSelectedReservation(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalles de la Reserva</Text>
              {selectedReservation && (
                <>
                  <Text>Cancha: {selectedReservation.title}</Text>
                  <Text>Fecha: {selectedReservation.date}</Text>
                  <Text>Horarios: {selectedReservation.times.join(', ')}</Text>
                  <Text>Lugar: {selectedReservation.location}</Text>

                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => {
                      setReservations((prev) =>
                        prev.filter(
                          (r) =>
                            !(
                              r.title === selectedReservation.title &&
                              r.date === selectedReservation.date &&
                              r.location === selectedReservation.location
                            )
                        )
                      );
                      setModalVisible(false);
                      setSelectedReservation(null);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                  </Pressable>
                </>
              )}
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setSelectedReservation(null);
                }}
              >
                <Text style={styles.closeText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Si params.name existe, muestra el selector de horarios
  const availableHours = Array.from({ length: 13 }, (_, i) => {
    const hour = (14 + i) % 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <View style={styles.container}>
      <View style={{ marginTop: SPACING.lg }}>
        <Text style={styles.subtitle}>Horarios disponibles:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {availableHours.map((hour) => (
            <Pressable
              key={hour}
              onPress={() => {
                setSelectedHours((prev) =>
                  prev.includes(hour)
                    ? prev.filter((h) => h !== hour)
                    : [...prev, hour]
                );
              }}
              style={{
                backgroundColor: selectedHours.includes(hour) ? COLORS.primary : '#eee',
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
                minWidth: 70,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: selectedHours.includes(hour) ? '#fff' : '#000' }}>{hour}</Text>
            </Pressable>
          ))}
        </View>

        {selectedHours.length > 0 && (
          <Button
            title="Reservar"
            onPress={() => {
              const newReservations: Reservation[] = selectedHours.map((hour) => ({
                id: `${Date.now().toString()}-${hour}`,
                title: `Reserva en ${params.name}`,
                date: new Date().toISOString().split('T')[0],
                time: hour,
                location: params.location as string,
              }));

              setReservations((prev) => [...prev, ...newReservations]);
              setSelectedHours([]);
              router.replace('/(user)/my-reservations');
            }}
          />
        )}
      </View>
                    <Button title="Volver" onPress={() => router.replace('/(user)/my-reservations')} />
                  </View>
        );
      }