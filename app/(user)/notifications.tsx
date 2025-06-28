import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../../constants';
import { Event, EventType } from '../../types';
import { EVENTS } from '../../mocks/data';
import EventCard from '../../components/ui/EventCard';
import ScreenContainer from '../../components/ui/ScreenContainer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function NotificationsScreen() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <EventCard event={item} onPress={() => handleEventPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off-outline" size={64} color={COLORS.text.secondary} />
      <Text style={styles.emptyStateTitle}>No hay notificaciones</Text>
      <Text style={styles.emptyStateText}>
        Cuando tengas eventos, promociones o noticias importantes, aparecerán aquí.
      </Text>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Notificaciones</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <FlatList
          data={EVENTS}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />

        {/* Modal de detalles */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
              </View>

              {selectedEvent && (
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {/* Imagen del evento */}
                  {selectedEvent.image && (
                    <View style={styles.eventImageContainer}>
                      <Image 
                        source={require('../../assets/padel1.png')} 
                        style={styles.eventImage}
                        resizeMode="cover"
                      />
                      <View style={[
                        styles.eventTypeBadge, 
                        { backgroundColor: getEventTypeColor(selectedEvent.type) }
                      ]}>
                        <Ionicons 
                          name={getEventTypeIcon(selectedEvent.type)} 
                          size={16} 
                          color="#FFF" 
                        />
                      </View>
                    </View>
                  )}

                  {/* Información del evento */}
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
                    
                    <View style={styles.eventMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.text.secondary} />
                        <Text style={styles.metaText}>{formatDate(selectedEvent.date)}</Text>
                      </View>
                      
                      {selectedEvent.location && (
                        <View style={styles.metaItem}>
                          <Ionicons name="location-outline" size={16} color={COLORS.text.secondary} />
                          <Text style={styles.metaText}>{selectedEvent.location}</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.eventDescription}>{selectedEvent.description}</Text>

                    {/* Información adicional */}
                    {(selectedEvent.startDate || selectedEvent.endDate) && (
                      <View style={styles.additionalInfo}>
                        <Text style={styles.additionalInfoTitle}>Horarios:</Text>
                        {selectedEvent.startDate && (
                          <Text style={styles.additionalInfoText}>
                            Inicio: {formatDate(selectedEvent.startDate)} {formatTime(selectedEvent.startDate)}
                          </Text>
                        )}
                        {selectedEvent.endDate && (
                          <Text style={styles.additionalInfoText}>
                            Fin: {formatDate(selectedEvent.endDate)} {formatTime(selectedEvent.endDate)}
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Precio y descuento */}
                    {(selectedEvent.price || selectedEvent.discount) && (
                      <View style={styles.pricingInfo}>
                        {selectedEvent.discount && (
                          <View style={[
                            styles.discountContainer, 
                            { backgroundColor: getEventTypeColor(selectedEvent.type) + '20' }
                          ]}>
                            <Text style={[
                              styles.discountText, 
                              { color: getEventTypeColor(selectedEvent.type) }
                            ]}>
                              ¡{selectedEvent.discount}% de descuento!
                            </Text>
                          </View>
                        )}
                        {selectedEvent.price && (
                          <Text style={styles.priceText}>Precio: ${selectedEvent.price}</Text>
                        )}
                      </View>
                    )}
                  </View>
                </ScrollView>
              )}

              {/* Botones de acción */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionButton} onPress={closeModal}>
                  <Text style={styles.actionButtonText}>Cerrar</Text>
                </TouchableOpacity>
                {selectedEvent && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryActionButton]} 
                    onPress={() => {
                      closeModal();
                      // Aquí podrías navegar a la reserva o acción específica
                    }}
                  >
                    <Text style={styles.primaryActionButtonText}>
                      {selectedEvent.type === EventType.TOURNAMENT ? 'Inscribirse' : 
                       selectedEvent.type === EventType.PROMOTION ? 'Reservar' : 'Más información'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: 16,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    maxHeight: SCREEN_WIDTH * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  modalBody: {
    paddingHorizontal: SPACING.md,
  },
  eventImageContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
  },
  eventTypeBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    paddingBottom: SPACING.md,
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  eventMeta: {
    marginBottom: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },
  eventDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.primary,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  additionalInfo: {
    marginBottom: SPACING.lg,
  },
  additionalInfoTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  additionalInfoText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  pricingInfo: {
    marginBottom: SPACING.lg,
  },
  discountContainer: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  discountText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: 'center',
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.primary,
  },
  modalActions: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
  },
  primaryActionButton: {
    backgroundColor: COLORS.primary,
  },
  primaryActionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.light,
  },
}); 