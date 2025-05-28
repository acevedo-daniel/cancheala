import { useCallback } from 'react';
import { useAppStore } from '../store';
import { Location } from '../types';
import { api } from '../services/api';

export function useLocation() {
  const location = useAppStore(state => state.location);
  const setLocation = useAppStore(state => state.setLocation);
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const locations = await api.getLocations();
      return locations;
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
      const location = await api.getLocationById(locationId);
      setLocation(location);
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