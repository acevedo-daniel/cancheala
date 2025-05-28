import { useCallback } from 'react';
import { useAppStore } from '../store';
import { User } from '../types';
import { MOCK_USERS } from '../mocks/data';

export function useAuth() {
  const user = useAppStore(state => state.user);
  const setUser = useAppStore(state => state.setUser);
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simular login con datos mock
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Simular logout
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