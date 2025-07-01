import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { Space } from '../../types';
import { useRouter } from 'expo-router';

interface CardProps {
  space: Space;
  onPress?: () => void; // opcional
}

export default function Card({ space }: CardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
  router.push({
    pathname: '/user/my-reservations',
    params: {
      id: space.id,
      name: space.name,
      location: space.location,
      rating: space.rating,
    },
  })
}

      style={styles.card}
    >
      <Image source={space.image} style={styles.image} />
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



