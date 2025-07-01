import React, { useState, createContext, useContext } from 'react';
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
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '../../constants';
import { Event, EventType } from '../../types';
import { EVENTS } from '../../mocks/data';
import EventCard from '../../components/ui/EventCard';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { Picker as ReactNativePicker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTER_OPTIONS = [
  { label: 'Todos', value: 'all' },
  { label: 'Promociones', value: EventType.PROMOTION },
  { label: 'Torneos', value: EventType.TOURNAMENT },
  { label: 'Noticias', value: EventType.NEWS },
  { label: 'Mantenimiento', value: EventType.MAINTENANCE },
  { label: 'Leídos', value: 'read' },
];

// Contexto global para notificaciones leídas
export const NotificationsContext = createContext<{
  readEvents: Event[];
  setReadEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
} | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState(EVENTS);
  const [readEvents, setReadEvents] = useState<Event[]>([]);
  return (
    <NotificationsContext.Provider value={{ readEvents, setReadEvents, events, setEvents }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const { events, readEvents, setEvents, setReadEvents } = useContext(NotificationsContext) || { events: [], readEvents: [], setEvents: () => {}, setReadEvents: () => {} };

  const filteredEvents = filter === 'all'
    ? events
    : filter === 'read'
      ? readEvents
      : events.filter(e => e.type === filter);

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

  const renderTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ margin: 16, marginBottom: 0 }} contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
      {FILTER_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => setFilter(opt.value)}
          style={{
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 20,
            backgroundColor: filter === opt.value ? '#181028' : '#f0f0f0',
            marginRight: 8,
            minWidth: 0,
          }}
        >
          <Text style={{ color: filter === opt.value ? '#fff' : '#181028', fontWeight: 'bold', fontSize: 14 }}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderEventCard = ({ item, index }: { item: Event, index: number }) => {
    const fadeAnim = new Animated.Value(1);
    const isReadSection = filter === 'read';
    const handleMarkRead = (): void => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setEvents((prev: Event[]) => prev.filter((e: Event) => e.id !== item.id));
        setReadEvents((prev: Event[]) => [...prev, item]);
      });
    };
    const handleRestore = (): void => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setReadEvents((prev: Event[]) => prev.filter((e: Event) => e.id !== item.id));
        setEvents((prev: Event[]) => [item, ...prev]);
      });
    };
    return isReadSection ? (
      <SwipeableRowRestore onRestore={handleRestore}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <EventCard event={item} onPress={() => handleEventPress(item)} backgroundColor="#f0f0f0" />
        </Animated.View>
      </SwipeableRowRestore>
    ) : (
      <SwipeableRow onDelete={handleMarkRead}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <EventCard event={item} onPress={() => handleEventPress(item)} backgroundColor="#fff" />
        </Animated.View>
      </SwipeableRow>
    );
  };

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
        </View>
        {renderTabs()}
        {/* Content */}
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ ...styles.listContainer, alignItems: 'stretch', paddingTop: 0, flexGrow: 0 }}
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

function SwipeableRow({ children, onDelete }: { children: React.ReactNode, onDelete: () => void }) {
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [showIcon, setShowIcon] = React.useState(false);
  const [iconOpacity] = React.useState(new Animated.Value(0));

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        Animated.event([
          null,
          { dx: pan.x }
        ], { useNativeDriver: false })(e, gestureState);
        if (gestureState.dx < -20) {
          setShowIcon(true);
          Animated.timing(iconOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        } else {
          setShowIcon(false);
          Animated.timing(iconOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          onDelete();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          setShowIcon(false);
          Animated.timing(iconOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={{ justifyContent: 'center' }}>
      {showIcon && (
        <Animated.View style={{
          position: 'absolute',
          right: 24,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          opacity: iconOpacity,
        }}>
          <Ionicons name="mail-open-outline" size={32} color="#f44336" />
        </Animated.View>
      )}
      <Animated.View
        style={{ transform: [{ translateX: pan.x }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

function SwipeableRowRestore({ children, onRestore }: { children: React.ReactNode, onRestore: () => void }) {
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [showIcon, setShowIcon] = React.useState(false);
  const [iconOpacity] = React.useState(new Animated.Value(0));

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        Animated.event([
          null,
          { dx: pan.x }
        ], { useNativeDriver: false })(e, gestureState);
        if (gestureState.dx > 20) {
          setShowIcon(true);
          Animated.timing(iconOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        } else {
          setShowIcon(false);
          Animated.timing(iconOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          onRestore();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          setShowIcon(false);
          Animated.timing(iconOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={{ justifyContent: 'center' }}>
      {showIcon && (
        <Animated.View style={{
          position: 'absolute',
          left: 24,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          opacity: iconOpacity,
        }}>
          <Ionicons name="mail-unread-outline" size={32} color="#4caf50" />
        </Animated.View>
      )}
      <Animated.View
        style={{ transform: [{ translateX: pan.x }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
} 