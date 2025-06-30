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
    label: 'Perfil',
    icon: 'person',
    route: 'profile',
  },
  {
    label: 'Canchas',
    icon: 'tennisball', // Icono para canchas
    route: 'canchas',
  },
] as const;

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <BottomSafeArea>
      <View style={{
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View style={[
          styles.container,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            borderRadius: 24,
            marginHorizontal: 16,
            width: '92%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}>
          {TABS.map((tab, index) => (
            <Tab
              key={tab.route}
              label={tab.label}
              icon={
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={
                    state.index === index ? COLORS.primary : COLORS.text.secondary
                  }
                />
              }
              isActive={state.index === index}
              onPress={() => navigation.navigate(tab.route)}
            />
          ))}
        </View>
      </View>
    </BottomSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.sm,
  },
});
