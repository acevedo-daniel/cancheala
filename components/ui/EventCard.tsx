import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../../constants';
import { Event, EventType } from '../../types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  backgroundColor?: string;
}

const imageMap: Record<string, any> = {
  'padel1.png': require('../../assets/images/padel1.png'),
  'padel2.png': require('../../assets/images/padel2.png'),
  'padel3.png': require('../../assets/images/padel3.png'),
  'padel4.jpg': require('../../assets/images/padel4.jpg'),
  'padel5.jpeg': require('../../assets/images/padel5.jpeg'),
  'ManosUnidas.jpg': require('../../assets/images/ManosUnidas.jpg'),
  'placeholder.png': require('../../assets/images/placeholder.png'),
};

const getEventTypeIcon = (type: EventType): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case EventType.PROMOTION:
      return 'pricetag';
    case EventType.TOURNAMENT:
      return 'trophy';
    case EventType.NEWS:
      return 'newspaper';
    case EventType.MAINTENANCE:
      return 'construct';
    case EventType.SPECIAL_OFFER:
      return 'flash';
    default:
      return 'notifications';
  }
};

const getEventTypeColor = (type: EventType): string => {
  switch (type) {
    case EventType.PROMOTION:
      return '#FF6B35';
    case EventType.TOURNAMENT:
      return '#FFD700';
    case EventType.NEWS:
      return '#4ECDC4';
    case EventType.MAINTENANCE:
      return '#FF6B6B';
    case EventType.SPECIAL_OFFER:
      return '#FF1744';
    default:
      return COLORS.primary;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function EventCard({ event, onPress, backgroundColor }: EventCardProps) {
  const eventIcon = getEventTypeIcon(event.type);
  const eventColor = getEventTypeColor(event.type);

  return (
    <Pressable onPress={onPress} style={[styles.card, backgroundColor ? { backgroundColor } : null]}>
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image source={imageMap[event.image]} style={styles.image} />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: eventColor + '20' }]}>
            <Ionicons name={eventIcon} size={32} color={eventColor} />
          </View>
        )}
        <View style={[styles.typeBadge, { backgroundColor: eventColor }]}>
          <Ionicons name={eventIcon} size={12} color="#FFF" />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.text.secondary} />
            <Text style={styles.dateText}>{formatDate(event.date)}</Text>
          </View>
          
          {event.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color={COLORS.text.secondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
          )}
        </View>
        
        {(event.price || event.discount) && (
          <View style={styles.priceContainer}>
            {event.discount && (
              <View style={[styles.discountBadge, { backgroundColor: eventColor }]}>
                <Text style={styles.discountText}>-{event.discount}%</Text>
              </View>
            )}
            {event.price && (
              <Text style={styles.priceText}>${event.price}</Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  imageContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  metaInfo: {
    marginBottom: SPACING.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discountBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  discountText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: '#FFF',
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
  },
}); 