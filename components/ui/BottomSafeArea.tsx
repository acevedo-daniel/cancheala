import React from 'react';
import { View, StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { COLORS } from '../../constants';

interface BottomSafeAreaProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: any;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Valores calculados para el área segura inferior
const getBottomSafeAreaMargins = () => {
  if (Platform.OS === 'ios') {
    // iOS: Home indicator + margen extra
    return {
      bottom: 34 + 8, // Home indicator + 8px extra
      horizontal: 8,
    };
  } else {
    // Android: Navigation bar + margen extra
    return {
      bottom: 16 + 8, // Navigation bar + 8px extra
      horizontal: 8,
    };
  }
};

export default function BottomSafeArea({ 
  children, 
  backgroundColor = COLORS.background,
  style 
}: BottomSafeAreaProps) {
  const margins = getBottomSafeAreaMargins();

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={[
        styles.content,
        {
          marginBottom: margins.bottom,
          marginHorizontal: margins.horizontal,
        }
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000', // Fondo negro como Instagram
  },
  content: {
    backgroundColor: COLORS.background,
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
    overflow: 'hidden',
    borderTopLeftRadius: 0, // Sin borde superior para conectar con ScreenContainer
    borderTopRightRadius: 0, // Sin borde superior para conectar con ScreenContainer
    borderBottomLeftRadius: Platform.OS === 'ios' ? 12 : 8,
    borderBottomRightRadius: Platform.OS === 'ios' ? 12 : 8,
  },
}); 