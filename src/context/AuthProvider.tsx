import { useState, useEffect, type ReactNode } from 'react';

import type { User } from '@/services/api';

import {
  loginRequest,
  registerRequest,
  type LoginDTO,
  type RegisterDTO,
} from '@/services/auth.service';

import { AuthContext, type AuthContextType } from './AuthContext';

import { TOKEN_KEY } from '@/lib/constants';

const USER_KEY = 'taskflow_user';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor global de autenticación.
 *
 * Gestiona:
 * - Usuario autenticado
 * - Token JWT
 * - Inicio de sesión
 * - Registro
 * - Cierre de sesión
 * - Persistencia de sesión
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Recuperar sesión después de recargar la página.
   *
   * El backend actual no dispone de GET /auth/me,
   * por lo que recuperamos el usuario almacenado junto
   * al token JWT.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedToken || !storedUser) {
      setToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;

      setToken(storedToken);
      setUser(parsedUser);
    } catch (error) {
      console.error(
        '[AuthContext] No se pudo recuperar la sesión:',
        error
      );

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Iniciar sesión.
   */
  const login = async (credentials: LoginDTO) => {
    setIsLoading(true);

    try {
      const response = await loginRequest(credentials);

      const {
        token: receivedToken,
        user: receivedUser,
      } = response.data;

      // Guardar JWT
      localStorage.setItem(TOKEN_KEY, receivedToken);

      // Guardar usuario
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(receivedUser)
      );

      // Actualizar estado
      setToken(receivedToken);
      setUser(receivedUser);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registrar usuario y realizar login automáticamente.
   */
  const register = async (credentials: RegisterDTO) => {
    setIsLoading(true);

    try {
      await registerRequest(credentials);

      await login({
        email: credentials.email,
        password: credentials.password,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cerrar sesión.
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}