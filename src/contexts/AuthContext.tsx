import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'super_admin' | 'admin' | 'wakasiswak' | 'staff' | 'guru';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with demo user for now
    const demoUser: User = {
      id: '1',
      email: 'admin@smk-maarif.id',
      name: 'Admin',
      phone: '0811158980',
      role: 'admin',
      department: 'Administrasi',
    };
    setUser(demoUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo login - in production use Supabase auth
    setLoading(true);
    try {
      const demoUser: User = {
        id: '1',
        email,
        name: 'User',
        role: 'staff',
      };
      setUser(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
