
import React, { createContext, useContext } from 'react';
import { Session, User, AuthResponse } from '@supabase/supabase-js';
import { useAuthProvider } from '@/hooks/useAuthProvider';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
