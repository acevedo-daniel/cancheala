import React from 'react';
import { View, StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { COLORS } from '../../constants';

interface ScreenContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: any;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Valores calculados para simular el comportamiento de Instagram/MercadoPago
const getSafeAreaMargins = () => {
  const statusBarHeight = StatusBar.currentHeight || 0;
  
  if (Platform.OS === 'ios') {
    // iOS: valores típicos para iPhone con notch
    return {
      top: statusBarHeight + 8, // Status bar + 8px extra
      bottom: 34 + 8, // Home indicator + 8px extra
      horizontal: 8,
    };
  } else {
    // Android: valores adaptativos
    return {
      top: statusBarHeight + 8, // Status bar + 8px extra
      bottom: 16 + 8, // Navigation bar + 8px extra
      horizontal: 8,
    };
  }
};

export default function ScreenContainer({ 
  children, 
  backgroundColor = COLORS.background,
  style 
}: ScreenContainerProps) {
  const margins = getSafeAreaMargins();

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={[
        styles.content,
        {
          marginTop: margins.top,
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
    flex: 1,
    backgroundColor: '#000', // Fondo negro como Instagram
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
    overflow: 'hidden',
  },
}); 