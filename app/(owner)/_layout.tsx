import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OwnerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3a8d59',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="canchas"
        options={{
          title: 'Canchas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tennis" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
