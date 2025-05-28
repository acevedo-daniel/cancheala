import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../../constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const BACKGROUND_COLORS: Record<ButtonVariant, string> = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  outline: 'transparent',
};

const TEXT_COLORS: Record<ButtonVariant, string> = {
  primary: COLORS.text.light,
  secondary: COLORS.text.light,
  outline: COLORS.primary,
};

const PADDING: Record<ButtonSize, number> = {
  small: SPACING.sm,
  medium: SPACING.md,
  large: SPACING.lg,
};

const FONT_SIZES: Record<ButtonSize, number> = {
  small: TYPOGRAPHY.fontSize.sm,
  medium: TYPOGRAPHY.fontSize.md,
  large: TYPOGRAPHY.fontSize.md,
};

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const backgroundColor = disabled ? COLORS.border : BACKGROUND_COLORS[variant];
  const textColor = disabled ? COLORS.text.secondary : TEXT_COLORS[variant];
  const padding = PADDING[size];
  const fontSize = FONT_SIZES[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor,
          padding,
          borderColor: variant === 'outline' ? COLORS.primary : 'transparent',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              {
                color: textColor,
                fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  text: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
}); 