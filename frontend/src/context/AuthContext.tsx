
// AuthContext.tsx
import React, { createContext, useContext, useState, FC, useEffect } from 'react';
import { pingAuth } from '../api/IdentityAPI';

export interface LoggedInUser {
  email: string;
  roles: string[];
  // add additional properties if needed
}

interface AuthContextType {
  user: LoggedInUser | null;
  login: (userData: LoggedInUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null);

// On mount, attempt to restore session via pingAuth
  useEffect(() => {
    const restoreSession = async () => {
      const userData = await pingAuth();
      if (userData) {
        setUser(userData);
      }
    };
    restoreSession();
  }, []);

  const login = (userData: LoggedInUser) => {
    setUser(userData);
    // Optionally persist data (localStorage, cookies, etc.)
  };

  const logout = () => {
    setUser(null);
    // Optionally clear persisted data
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}