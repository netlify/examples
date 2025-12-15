import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getAdminToken, setAdminToken as storeToken, clearAdminToken } from './auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAdminToken());

  const login = useCallback((token: string) => {
    storeToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
