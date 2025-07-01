import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../components/ui/TabBar';

export default function UserLayout() {
  const [unreadCount, setUnreadCount] = useState(0); // Esto lo podés cambiar a un valor real si lo traes de Firebase o algo así.

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <TabBar {...props} unreadCount={unreadCount} />}
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
