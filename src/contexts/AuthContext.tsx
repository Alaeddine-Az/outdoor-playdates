
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is admin
        if (session?.user) {
          if (session.user.email === 'admin') {
            setIsAdmin(true);
          } else {
            try {
              const { data, error } = await supabase.rpc('is_admin', { user_id: session.user.id });
              if (!error) {
                setIsAdmin(!!data);
              }
            } catch (err) {
              console.error('Error checking admin status:', err);
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check if user is admin
      if (session?.user) {
        if (session.user.email === 'admin') {
          setIsAdmin(true);
        } else {
          try {
            const { data, error } = await supabase.rpc('is_admin', { user_id: session.user.id });
            if (!error) {
              setIsAdmin(!!data);
            }
          } catch (err) {
            console.error('Error checking admin status:', err);
            setIsAdmin(false);
          }
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      setLoading(true);
      
      // First check if email exists in approved signups
      if (email !== 'admin' && email !== 'testuser') {
        const { data: signupData, error: signupError } = await supabase
          .from('early_signups')
          .select('status')
          .eq('email', email)
          .single();
        
        if (signupError && signupError.code !== 'PGRST116') {
          throw signupError;
        }
        
        // If no approved signup found
        if (!signupData || signupData.status !== 'approved') {
          throw new Error('Your registration request has not been approved yet or this email is not registered.');
        }
      }
      
      // Proceed with sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      
      // Special handling for admin and test users
      if (email === 'admin') {
        // Navigate admin to admin dashboard
        toast({
          title: "Admin account created!",
          description: "Welcome to the admin dashboard.",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to GoPlayNow! Complete your profile to get started.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Special case for admin login
      if (email === 'admin' && password === 'admin') {
        // Create admin account if it doesn't exist
        const { data: checkData, error: checkError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (checkError && checkError.message.includes('Invalid login credentials')) {
          // Create admin account
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { parent_name: 'Admin' }
            }
          });
          
          if (error) throw error;
          
          // Sign in with newly created account
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) throw signInError;
        }
        
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard.",
        });
        
        setIsAdmin(true);
        navigate('/admin');
        return;
      }
      
      // Special case for test user login
      if (email === 'testuser' && password === 'testuser') {
        // Create test user account if it doesn't exist
        const { data: checkData, error: checkError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (checkError && checkError.message.includes('Invalid login credentials')) {
          // Create test user account
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { 
                parent_name: 'Test User',
                location: 'Test City' 
              }
            }
          });
          
          if (error) throw error;
          
          // Sign in with newly created account
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) throw signInError;
        }
        
        toast({
          title: "Test user login successful",
          description: "Welcome to GoPlayNow!",
        });
        
        navigate('/dashboard');
        return;
      }
      
      // Normal login flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      if (email === 'admin') {
        setIsAdmin(true);
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signUp, signIn, signOut, loading, isAdmin }}>
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
