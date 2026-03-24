import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi, walletApi } from '../services/api';

const TOKEN_KEY = 'eds_auth_token';
const EMAIL_KEY = 'eds_auth_email';

interface AuthState {
  token: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  authModalVisible: boolean;
  authModalTab: 'login' | 'register';
  menuVisible: boolean;
  depositModalVisible: boolean;
  balance: number | null;
  refreshBalance: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  openDepositModal: () => void;
  closeDepositModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [menuVisible, setMenuVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const refreshBalance = useCallback(async () => {
    const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!storedToken) return;
    try {
      const { balance: b } = await walletApi.getBalance(storedToken);
      setBalance(b);
    } catch {
      setBalance(null);
    }
  }, []);

  useEffect(() => {
    async function restore() {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedEmail = await SecureStore.getItemAsync(EMAIL_KEY);
      if (storedToken) {
        setToken(storedToken);
        try {
          const { balance: b } = await walletApi.getBalance(storedToken);
          setBalance(b);
        } catch {}
      }
      if (storedEmail) setUserEmail(storedEmail);
    }
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: newToken } = await authApi.login(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(EMAIL_KEY, email);
    setToken(newToken);
    setUserEmail(email);
    try {
      const { balance: b } = await walletApi.getBalance(newToken);
      setBalance(b);
    } catch {}
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const { token: newToken } = await authApi.register(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(EMAIL_KEY, email);
    setToken(newToken);
    setUserEmail(email);
    try {
      const { balance: b } = await walletApi.getBalance(newToken);
      setBalance(b);
    } catch {}
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(EMAIL_KEY);
    setToken(null);
    setUserEmail(null);
    setBalance(null);
  }, []);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalVisible(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalVisible(false);
  }, []);

  const openMenu = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const openDepositModal = useCallback(() => {
    setDepositModalVisible(true);
  }, []);

  const closeDepositModal = useCallback(() => {
    setDepositModalVisible(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userEmail,
        isAuthenticated: token !== null,
        authModalVisible,
        authModalTab,
        menuVisible,
        depositModalVisible,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        openMenu,
        closeMenu,
        openDepositModal,
        closeDepositModal,
        balance,
        refreshBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
