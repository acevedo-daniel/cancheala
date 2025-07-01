import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

interface TabProps {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function Tab({ label, icon, isActive, onPress, style }: TabProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon as any}
        size={22}
        color={isActive ? '#181829' : '#A1A1B3'}
        style={{ marginBottom: 4 }}
      />
      <Text
        style={[
          styles.label,
          isActive ? styles.activeLabel : styles.inactiveLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 4,
  },
  label: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 12,
  },
  activeLabel: {
    color: '#181829',
    fontWeight: 'bold',
  },
  inactiveLabel: {
    color: '#A1A1B3',
    fontWeight: 'normal',
  },
}); 