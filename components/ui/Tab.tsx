import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

interface TabProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function Tab({ label, icon, isActive, onPress, style }: TabProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        isActive && styles.activeTab,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[isActive ? styles.activeIcon : styles.icon]}>{icon}</Text>
      <Text
        style={[
          styles.label,
          isActive && styles.activeLabel,
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
    paddingVertical: SPACING.md,
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    fontSize: 24,
    color: COLORS.text.secondary,
  },
  activeIcon: {
    fontSize: 28,
    color: COLORS.primary,
  },
  label: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
}); 