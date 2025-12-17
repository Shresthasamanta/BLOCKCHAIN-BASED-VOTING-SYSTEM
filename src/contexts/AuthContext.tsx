import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/election';
import { mockUser } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'voter' | 'admin' | 'observer') => Promise<boolean>;
  logout: () => void;
  connectWallet: () => Promise<string | null>;
  walletConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const login = async (email: string, password: string, role: 'voter' | 'admin' | 'observer'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    setUser({
      ...mockUser,
      email,
      role,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setWalletConnected(false);
  };

  const connectWallet = async (): Promise<string | null> => {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWalletConnected(true);
    return mockUser.walletAddress || null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      connectWallet,
      walletConnected,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
