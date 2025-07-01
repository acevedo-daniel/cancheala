import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../components/ui/TabBar';

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="my-reservations"
        options={{
          title: 'Reservas',
        }}
      />
      <Tabs.Screen
        name="canchas"
        options={{
          title: 'Canchas',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
