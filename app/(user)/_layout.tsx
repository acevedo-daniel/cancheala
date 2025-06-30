import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReservationsProvider } from '../context/ReservationsContext';

export default function UserLayout() {
  return (
    <ReservationsProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#00C853',
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
          tabBarStyle: {
            height: 68,
            marginHorizontal: 18,
            marginBottom: 18,
            borderRadius: 22,
            backgroundColor: '#fff',
            position: 'absolute',
            left: 0,
            right: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 10,
            borderTopWidth: 0,
          },
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'index') {
              return <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />;
            }
            if (route.name === 'reservas') {
              return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={26} color={color} />;
            }
            if (route.name === 'perfil') {
              return <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />;
            }
            if (route.name === 'canchas') {
              return <Ionicons name={focused ? 'tennisball' : 'tennisball-outline'} size={26} color={color} />;
            }
            return null;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ tabBarLabel: 'Inicio' }} />
        <Tabs.Screen name="reservas" options={{ tabBarLabel: 'Reservas' }} />
        <Tabs.Screen name="perfil" options={{ tabBarLabel: 'Perfil' }} />
        <Tabs.Screen name="canchas" options={{ tabBarLabel: 'Canchas' }} />
      </Tabs>
    </ReservationsProvider>
  );
}
