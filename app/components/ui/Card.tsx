import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export function Card({
  children,
  style,
  onPress,
  variant = 'elevated',
}: CardProps) {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return SHADOWS.md;
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: COLORS.border,
        };
      case 'flat':
        return {};
      default:
        return SHADOWS.md;
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.card,
        getCardStyle(),
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