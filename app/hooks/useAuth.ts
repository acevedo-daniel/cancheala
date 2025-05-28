import { useCallback } from 'react';
import { useAppStore } from '../store';
import { User } from '../types';

export function useAuth() {
  const user = useAppStore(state => state.user);
  const setUser = useAppStore(state => state.setUser);
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Implementar llamada a API
      const mockUser: User = {
        id: '1',
        name: 'Usuario Demo',
        email,
        role: 'user',
      };
      setUser(mockUser);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Implementar llamada a API
      setUser(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
} 