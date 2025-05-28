import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '../../../constants';

type CardVariant = 'elevated' | 'outlined' | 'flat';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: CardVariant;
}

const CARD_STYLES: Record<CardVariant, ViewStyle> = {
  elevated: SHADOWS.md,
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flat: {},
};

export function Card({
  children,
  style,
  onPress,
  variant = 'elevated',
}: CardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        CARD_STYLES[variant],
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
}); 