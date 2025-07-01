import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Alert } from 'react-native';
import { ReservationsContext } from '../context/ReservationsContext';
import { useRouter } from 'expo-router';

export default function ReservasScreen() {
  const { reservas, cancelarReserva } = useContext(ReservationsContext);
  const router = useRouter();
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDetalle = (reserva) => {
    setSelectedReserva(reserva);
    setModalVisible(true);
  };

  const handleCancelar = (reserva) => {
    Alert.alert(
      'Cancelar reserva',
      '¿Estás seguro que deseas cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelarReserva(reserva) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {reservas.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes reservas.</Text>
      ) : (
        reservas.map((reserva) => (
          <View key={reserva.id} style={styles.card}>
            {reserva.cancha?.imagen && (
              <Image source={reserva.cancha.imagen} style={styles.img} />
            )}
            <Text style={styles.canchaName}>{reserva.cancha.nombre}</Text>
            <Text style={styles.canchaDir}>{reserva.cancha.direccion}</Text>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{reserva.fecha}</Text>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.estado}>{reserva.estado}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.detalleBtn} onPress={() => handleDetalle(reserva)}>
                <Text style={styles.detalleBtnText}>Detalle de la reserva</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancelar(reserva)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      {/* Modal Detalle de Reserva */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalBox}>
            {selectedReserva && (
              <>
                <View style={styles.detailCard}>
                  <Text style={styles.detailTitle}>{selectedReserva.cancha?.nombre}</Text>
                  <Text style={styles.detailDir}>{selectedReserva.cancha?.direccion}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>
                      <Text style={{ color: '#FFD700', fontSize: 16 }}>★</Text> {selectedReserva.cancha?.rating || '4.5'}
                    </Text>
                  </View>
                  <Text style={styles.detailLabel}>Fecha:</Text>
                  <Text style={styles.detailValue}>{selectedReserva.fecha}</Text>
                  <Text style={styles.detailLabel}>Horarios reservados:</Text>
                  <Text style={styles.detailValue}>{selectedReserva.horarios?.join(', ')}</Text>
                  <Text style={styles.detailLabel}>Estado:</Text>
                  <Text style={styles.detailEstado}>{selectedReserva.estado}</Text>
                </View>
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>Servicios incluidos:</Text>
                  <Text style={styles.detailValue}>
                    Vestuarios{"\n"}Iluminación LED{"\n"}Estacionamiento gratuito{"\n"}WiFi en el predio
                  </Text>
                  <Text style={styles.detailLabel}>Política de cancelación:</Text>
                  <Text style={styles.detailValue}>Puedes cancelar hasta 2 horas antes del horario reservado sin costo.</Text>
                  <Text style={styles.detailLabel}>Notas:</Text>
                  <Text style={styles.detailValue}>Llega 10 minutos antes para validar tu reserva en recepción.</Text>
                </View>
                <TouchableOpacity style={styles.cancelBtnBig} onPress={() => handleCancelar(selectedReserva)}>
                  <Text style={styles.cancelBtnTextBig}>Cancelar Reserva</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: 'stretch',
  },
  img: {
    width: '92%',
    height: 140,
    borderRadius: 16,
    marginBottom: 18,
    marginTop: 10,
    backgroundColor: '#eee',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  canchaName: { fontWeight: 'bold', fontSize: 16 },
  canchaDir: { color: '#666', fontSize: 13, marginBottom: 8 },
  label: { fontWeight: 'bold', marginTop: 8 },
  value: { color: '#333', marginBottom: 4 },
  estado: { color: '#00C853', fontWeight: 'bold', marginBottom: 8 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  detalleBtn: { backgroundColor: '#009688', borderRadius: 8, padding: 10, flex: 1, alignItems: 'center', marginRight: 8 },
  detalleBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#d32f2f', borderRadius: 8, padding: 10, flex: 1, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  detailModalBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 0,
    width: '92%',
    alignItems: 'stretch',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  detailCard: {
    backgroundColor: '#fafbfc',
    borderRadius: 16,
    padding: 18,
    margin: 12,
    marginBottom: 0,
    elevation: 1,
  },
  detailTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
    color: '#222',
  },
  detailDir: {
    color: '#666',
    fontSize: 15,
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
    color: '#333',
    fontSize: 15,
  },
  detailValue: {
    color: '#333',
    marginBottom: 4,
    fontSize: 15,
  },
  detailEstado: {
    color: '#00C853',
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
    marginTop: 2,
  },
  cancelBtnBig: {
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 18,
    marginTop: 20,
  },
  cancelBtnTextBig: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  closeBtn: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 18,
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  closeBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 