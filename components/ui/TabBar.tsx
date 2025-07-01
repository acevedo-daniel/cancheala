import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants';
import { Tab } from './Tab';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import BottomSafeArea from './BottomSafeArea';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  {
    label: 'Inicio',
    icon: 'home',
    route: 'index',
  },
  {
    label: 'Reservas',
    icon: 'calendar',
    route: 'my-reservations',
  },
  {
    label: 'Canchas',
    icon: 'tennisball', // Icono para canchas
    route: 'canchas',
  },
  {
    label: 'Perfil',
    icon: 'person',
    route: 'profile',
  },
] as const;

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <BottomSafeArea>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {TABS.map((tab, index) => (
          <Tab
            key={tab.route}
            label={tab.label}
            icon={tab.icon}
            isActive={state.index === index}
            onPress={() => navigation.navigate(tab.route)}
          />
        ))}
      </View>
    </BottomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EDEDF0',
    minHeight: 48,
    paddingVertical: 4,
    shadowColor: 'transparent',
    elevation: 0,
  },
});
