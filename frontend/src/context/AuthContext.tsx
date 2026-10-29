import { createContext, useContext, useState, ReactNode } from 'react';
import api, { TOKEN_KEY } from '../services/api';
import { AuthData } from '../types';

interface AuthContextType {
  user: AuthData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hidrata do localStorage para sobreviver a F5
  const [user, setUser] = useState<AuthData | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? (JSON.parse(saved) as AuthData) : null;
  });

  const persist = (data: AuthData) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthData>('/auth/login', { email, password });
    persist(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthData>('/auth/register', { name, email, password });
    persist(data); // já entra logado após cadastro
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
