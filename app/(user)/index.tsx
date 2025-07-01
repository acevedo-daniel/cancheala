import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Button,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Banner, Category, Space } from '../../types';
import { BANNERS, CATEGORIES, SPACES } from '../../mocks/data';
import ScreenContainer from '../../components/ui/ScreenContainer';
import { SPACING, COLORS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const availableHours = Array.from({ length: 13 }, (_, i) => {
  const hour = (14 + i) % 24;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Resetear categoría seleccionada cuando vuelvas al home
  useFocusEffect(
    React.useCallback(() => {
      setSelectedCategory(null);
    }, [])
  );

  const handleReservePress = (space: Space) => {
    setSelectedSpace(space);
    setModalVisible(true);
    setSelectedHours([]);
  };

  const handleBannerChange = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / SCREEN_WIDTH);
    setCurrentBanner(currentIndex);
  };

  const handleToggleFavorito = (id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleCardPress = (space: Space) => {
    setSelectedDetailSpace(space);
    setDetailModalVisible(true);
  };

  const renderBanner = ({ item }: { item: Banner }) => (
    <View style={styles.banner}>
      {item.image && (
        <Image
          source={item.image}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerText}>{item.title}</Text>
      </View>
    </View>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCardV2}
      onPress={() => {
        setSelectedCategory(item.id);
        router.push({
          pathname: '/search',
          params: { filter: item.name }
        });
      }}
      activeOpacity={0.85}
    >
      <Image source={item.image} style={styles.categoryImageV2} />
      <View style={styles.categoryOverlayV2} />
      <View style={styles.categoryContentV2}>
        <Ionicons name={item.icon as any} size={28} color="#fff" style={{ marginBottom: 6 }} />
        <Text style={styles.categoryTextV2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSpace = ({ item }: { item: typeof SPACES[0] }) => {
    const formatDistance = (m: number) => m < 1000 ? `${m} m` : `${(m/1000).toFixed(1)} km`;
    const price = '$1.500';
    const promoColors = [
      '#FFE066', // Amarillo
      '#4ADE80', // Verde
      '#60A5FA', // Azul
      '#F472B6', // Rosa
      '#A1A1B3', // Gris
    ];

    return (
      <View style={{ marginBottom: 28 }}>
        {/* Badge flotante como parte del flujo normal */}
        {item.statusTag && (
          <View style={styles.statusTagInline}>
            <Text style={styles.statusTagTextV2} numberOfLines={1} ellipsizeMode="tail">{item.statusTag}</Text>
          </View>
        )}
        <View style={styles.nearbyCardV3}>
          <View style={{ position: 'relative', overflow: 'visible' }}>
            <Image
              source={item.image}
              style={styles.nearbyImageV3}
            />
          </View>
          <View style={styles.nearbyInfoV3}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.nearbyNameV2} numberOfLines={1}>{item.name}</Text>
              <View style={{ flex: 1 }} />
              <Ionicons name="star" size={16} color="#181829" style={{ marginRight: 2 }} />
              <Text style={styles.nearbyRatingV2}>{item.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.nearbyTypeV2}>{item.type}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Ionicons name="navigate-outline" size={14} color="#A1A1B3" style={{ marginRight: 2 }} />
              <Text style={styles.nearbyDataV2}>{formatDistance(item.distance)}</Text>
              <Text style={styles.nearbyDotV2}>·</Text>
              <Ionicons name="pricetag-outline" size={14} color="#A1A1B3" style={{ marginRight: 2 }} />
              <Text style={styles.nearbyDataV2}>{price}</Text>
            </View>
            {/* Promos chips */}
            <View style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'wrap' }}>
              {item.promos && item.promos.map((promo, idx) => (
                <View
                  key={promo}
                  style={[styles.promoChipV2, { backgroundColor: promoColors[idx % promoColors.length] }]}
                >
                  <Text style={styles.promoChipTextV2} numberOfLines={1}>{promo}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={{ backgroundColor: '#fff', paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: 18, marginBottom: 10 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.push('/(user)/location-selection')}>
            <Text style={{ color: '#181028', fontWeight: 'bold', fontSize: 16 }}>C. Falucho 265</Text>
            <Ionicons name="chevron-down" size={20} color="#181028" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(user)/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#181028" />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: SPACING.md }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 32, paddingHorizontal: 20, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, borderWidth: 1, borderColor: '#e5e5e5' }}
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <Text
              style={{ flex: 1, color: '#888999', fontSize: 17, fontWeight: '500', marginRight: 8 }}
              numberOfLines={1}
            >
              Buscar canchas, deportes...
            </Text>
            <Ionicons name="search" size={20} color="#888999" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Banners */}
          <View style={styles.bannerContainer}>
            <FlatList
              data={BANNERS}
              renderItem={renderBanner}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleBannerChange}
              style={styles.bannerList}
              keyExtractor={(item) => item.id}
            />
            <View style={styles.bannerPagination}>
              {BANNERS.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.bannerDot,
                    currentBanner === index && styles.bannerDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Quick Access */}
          <View style={styles.quickAccess}>
            <View style={styles.quickAccessItem}>
              <TouchableOpacity 
                style={styles.quickAccessCard}
                onPress={() => router.push('/(user)/canchas')}
              >
                <Image
                  source={require('../../assets/images/red-negra-tennis-tennis.jpg')}
                  style={styles.quickAccessImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Text style={styles.quickAccessText}>Canchas</Text>
            </View>
            
            <View style={styles.quickAccessItem}>
              <TouchableOpacity style={styles.quickAccessCard}>
                <Image
                  source={require('../../assets/images/chica-espaldas-tennis.jpg')}
                  style={styles.quickAccessImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Text style={styles.quickAccessText}>Matchmaking</Text>
            </View>
          </View>

          {/* Categorías */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Explora por</Text>
            <FlatList
              data={CATEGORIES}
              renderItem={renderCategory}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* Cerca de ti */}
          <View style={styles.spacesSection}>
            <Text style={styles.sectionTitle}>Cerca de ti</Text>
            <FlatList
              data={SPACES.slice(0, 3)}
              keyExtractor={(item) => item.id}
              renderItem={renderSpace}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
        </ScrollView>

        {/* Modal de Reservas */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalReservaBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Image source={selectedSpace?.image} style={styles.modalImg} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.modalTitle}>{selectedSpace?.name || ''}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={{ marginLeft: 4, fontWeight: 'bold' }}>{selectedSpace?.rating}</Text>
                  </View>
                  <Text style={{ color: '#666', fontSize: 13 }}>{selectedSpace?.location}</Text>
                  <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Precio por hora: ${SPACE_PRICE.toLocaleString()}</Text>
                </View>
              </View>
              <Text style={{ marginBottom: 10, fontWeight: '600', fontSize: 15 }}>Selecciona los horarios disponibles</Text>
              <View style={styles.hoursContainer}>
                {availableHours.map((hour) => {
                  const selected = selectedHours.includes(hour);
                  return (
                    <Pressable
                      key={hour}
                      onPress={() => {
                        setSelectedHours((prev) =>
                          prev.includes(hour)
                            ? prev.filter((h) => h !== hour)
                            : [...prev, hour],
                        );
                      }}
                      style={[
                        styles.hourButton,
                        selected && styles.hourButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.hourButtonText,
                          selected && styles.hourButtonTextSelected,
                        ]}
                      >
                        {hour}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={{ color: '#888', fontSize: 12, marginTop: 6, marginBottom: 2 }}>
                De 19hs en adelante +$2.000 por luz
              </Text>
              {selectedHours.length > 0 && selectedSpace && (
                <Button
                  title="Reservar"
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedHours([]);
                    alert('Reserva confirmada');
                  }}
                />
              )}
              <View style={{ marginTop: 10 }}>
                <Button
                  title="Cerrar"
                  color="#999"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              {selectedDetailSpace && (
                <>
                  <Image source={selectedDetailSpace.image} style={styles.modalImg} resizeMode="cover" />
                  {selectedDetailSpace.specs?.available && (
                    <View style={styles.badgeDisponible}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Disponible</Text></View>
                  )}
                  <Text style={styles.modalTitle}>{selectedDetailSpace.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={{ marginLeft: 4, fontWeight: 'bold' }}>{selectedDetailSpace.rating}</Text>
                    <Text style={{ color: '#888', marginLeft: 6, fontSize: 13 }}>({selectedDetailSpace.specs?.reviews} reseñas)</Text>
                    <View style={styles.priceBadge}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{`$${selectedDetailSpace.specs?.price.toLocaleString()}/hora`}</Text></View>
                  </View>
                  <Text style={{ color: '#666', fontSize: 14, marginBottom: 2 }}><Ionicons name="location-outline" size={14} color="#888" /> {selectedDetailSpace.location}</Text>
                  <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>Dirección: {selectedDetailSpace.address}</Text>
                  <Text style={{ fontWeight: 'bold', marginTop: 8, marginBottom: 2 }}>Servicios incluidos:</Text>
                  {selectedDetailSpace.specs?.services?.map((serv, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Ionicons name={serv.icon} size={18} color="#00C853" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#444', fontSize: 14 }}>{serv.label}</Text>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.reservarBtnModal}
                    onPress={() => {
                      setDetailModalVisible(false);
                      setTimeout(() => {
                        setSelectedSpace(selectedDetailSpace);
                        setModalVisible(true);
                        setSelectedHours([]);
                      }, 300); // Espera a que cierre el modal de detalles
                    }}
                  >
                    <Text style={styles.reservarBtnTextModal}>Reservar Ahora</Text>
                  </TouchableOpacity>
                </>
              )}
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
    backgroundColor: '#fff',
  },

  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchText: {
    marginLeft: 8,
    color: '#888',
    fontSize: 15,
    fontWeight: '400',
  },

  bannerContainer: {
    marginBottom: SPACING.md,
  },

  bannerList: {
    width: '100%',
  },

  banner: {
    width: SCREEN_WIDTH,
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
  },
  bannerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  bannerDotActive: {
    backgroundColor: '#007bff',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  quickAccessItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 0,
  },

  quickAccessCard: {
    width: 145,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  quickAccessImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },

  quickAccessText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  categoriesSection: {
    marginBottom: SPACING.md,
  },

  categoriesList: {
    marginBottom: 14,
  },

  categoryCardV2: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryImageV2: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  categoryOverlayV2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  categoryContentV2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  categoryTextV2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  spacesSection: {
    marginBottom: SPACING.md,
  },

  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 1,
    padding: 10,
  },
  spaceImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  spaceInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#222',
    maxWidth: 160,
  },
  spaceLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  spaceActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 6,
  },
  reservarBtn: {
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 6,
  },
  reservarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalReservaBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalImg: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },

  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },

  hourButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    margin: 4,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hourButtonSelected: {
    backgroundColor: '#007bff',
  },

  statusTagBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: 4,
    marginLeft: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
    minWidth: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    maxWidth: 200,
    overflow: 'hidden',
  },
  nearbyCardV3: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 80,
    position: 'relative',
  },
  nearbyImageV3: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 16,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },
  nearbyInfoV3: {
    flex: 1,
    justifyContent: 'center',
  },
  nearbyNameV2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181829',
    maxWidth: '70%',
  },
  nearbyTypeV2: {
    fontSize: 14,
    color: '#A1A1B3',
    marginBottom: 2,
    marginTop: 1,
  },
  nearbyRatingV2: {
    fontSize: 14,
    color: '#181829',
    fontWeight: 'bold',
  },
  nearbyDataV2: {
    fontSize: 13,
    color: '#181829',
    marginRight: 2,
  },
  nearbyDotV2: {
    color: '#A1A1B3',
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  promoChipV2: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  promoChipTextV2: {
    color: '#181829',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusTagTextV2: {
    color: '#181829',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusTagInline: {
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginBottom: 2,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 60,
    maxWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
});
