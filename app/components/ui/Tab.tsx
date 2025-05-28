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
    >
      {icon}
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
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  activeTab: {
    backgroundColor: COLORS.background,
  },
  label: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
  activeLabel: {
    color: COLORS.primary,
  },
}); 