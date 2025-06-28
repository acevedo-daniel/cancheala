import { Tabs } from 'expo-router';
import { TabBar } from '../../components/ui/TabBar';
import { ReservationsProvider } from '../context/ReservationsContext'; // Importa el provider

export default function UserLayout() {
  return (
    <ReservationsProvider>
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
          name="profile"
          options={{
            title: 'Perfil',
          }}
        />
        <Tabs.Screen
          name="canchas"
          options={{
            title: 'Canchas',
          }}
        />
      </Tabs>
    </ReservationsProvider>
  );
}
