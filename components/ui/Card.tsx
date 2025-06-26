import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { Space } from '../../types';

interface CardProps {
  space: Space;
  onPress: () => void;
}

const imageMap: Record<string, any> = {
  'padel1.png': require('../../assets/padel1.png'),
  'padel2.png': require('../../assets/padel2.png'),
  'padel3.png': require('../../assets/padel3.png'),
};

export default function Card({ space, onPress }: CardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={imageMap[space.image]} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{space.name}</Text>
        <Text style={styles.rating}>⭐ {space.rating}</Text>
        <Text style={styles.subtitle}>{space.location}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
  
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: SPACING.md,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: 4,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
});



