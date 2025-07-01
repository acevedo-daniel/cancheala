import { useCallback } from 'react';
import { useAppStore } from '../store';
import { Location } from '../types';
import { MOCK_LOCATIONS } from '../mocks/data';

export function useLocation() {
  const location = useAppStore(state => state.location);
  const setLocation = useAppStore(state => state.setLocation);
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      // Simular llamada a API
      return MOCK_LOCATIONS;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar ubicaciones');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const selectLocation = useCallback(async (locationId: string) => {
    try {
      setLoading(true);
      // Simular llamada a API
      const location = MOCK_LOCATIONS.find(loc => loc.id === locationId);
      if (location) {
        setLocation(location);
      } else {
        setError('Ubicación no encontrada');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al seleccionar ubicación');
    } finally {
      setLoading(false);
    }
  }, [setLocation, setLoading, setError]);

  return {
    location,
    fetchLocations,
    selectLocation,
  };
} 