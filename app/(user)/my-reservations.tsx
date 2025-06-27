import Card from '../../components/ui/Card';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Space } from '../../types';
import { SPACES } from '../../mocks/data';
import { useReservations, Reservation } from '../context/ReservationsContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type GroupedReservation = {
  id: string;
  title: string;
  date: string;
  times: string[];
  location: string;
  image?: any;
};

export default function MyReservationsScreen() {
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);

  const { reservations, setReservations } = useReservations();

  // Agrupa reservas y guarda la imagen
  const groupedReservationsObj = reservations.reduce((acc, curr) => {
    const key = `${curr.title}-${curr.date}`;
    if (!acc[key]) {
      // Busca la imagen en SPACES si no está en la reserva
      let image = curr.image;
      if (!image) {
        const found = SPACES.find(
          s =>
            s.location === curr.location ||
            s.name === curr.title.replace('Reserva en ', '')
        );
        image = found?.image;
      }
      acc[key] = {
        id: curr.id,
        title: curr.title,
        date: curr.date,
        times: [curr.time],
        location: curr.location,
        image: image,
      };
    } else {
      acc[key].times.push(curr.time);
    }
    return acc;
  }, {} as Record<string, GroupedReservation>);

  // Convertir el objeto agrupado a array
  const groupedReservationsArray = Object.values(groupedReservationsObj);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => router.push('/(user)/location-selection')}
        >
          <Ionicons name="location" size={20} color="#000" />
          <Text style={styles.locationText}>Falucho 257</Text>
          <Ionicons name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/(user)/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

<View style={styles.content}>
  {groupedReservationsArray.length > 0 && (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>Mis Reservas</Text>
      <FlatList
        data={groupedReservationsArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: GroupedReservation }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Card
                space={{
                  id: item.id,
                  name: `${item.title} (${item.times.join(', ')})`,
                  rating: 0,
                  address: item.location,
                  image: item.image || { uri: '' },
                  location: item.location,
                }}
                onPress={() => {}}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Cancelar reserva',
                  '¿Estás seguro de que deseas cancelar esta reserva?',
                  [
                    { text: 'No', style: 'cancel' },
                    {
                      text: 'Sí',
                      style: 'destructive',
                      onPress: () => {
                        setReservations((prev) =>
                          prev.filter(
                            (r) =>
                              !(
                                r.title === item.title &&
                                r.date === item.date &&
                                item.times.includes(r.time)
                              )
                          )
                        );
                      },
                    },
                  ]
                );
              }}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )}
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationText: {
    marginHorizontal: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
});