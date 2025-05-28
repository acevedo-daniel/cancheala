import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SHADOWS } from '../../constants';
import { Tab } from './Tab';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function TabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <Tab
        label="Inicio"
        icon={<Ionicons name="home" size={24} color={state.index === 0 ? COLORS.primary : COLORS.text.secondary} />}
        isActive={state.index === 0}
        onPress={() => navigation.navigate('index')}
      />
      <Tab
        label="Reservas"
        icon={<Ionicons name="calendar" size={24} color={state.index === 1 ? COLORS.primary : COLORS.text.secondary} />}
        isActive={state.index === 1}
        onPress={() => navigation.navigate('my-reservations')}
      />
      <Tab
        label="Perfil"
        icon={<Ionicons name="person" size={24} color={state.index === 2 ? COLORS.primary : COLORS.text.secondary} />}
        isActive={state.index === 2}
        onPress={() => navigation.navigate('profile')}
      />
    </View>
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