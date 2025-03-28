
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { checkAdminStatus } from '@/utils/authUtils';

export function useAuthProvider() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth provider initialized');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        // Update session and user state
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Check admin status when session changes
        if (newSession?.user) {
          const adminStatus = await checkAdminStatus(newSession.user);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        
        // Always update loading state after processing auth change
        setLoading(false);
      }
    );
    
    // Check for existing session
    const initializeSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Existing session check result:', existingSession?.user?.id);
        
        // Update state based on session
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        
        // Check admin status if user exists
        if (existingSession?.user) {
          const adminStatus = await checkAdminStatus(existingSession.user);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Exception checking session:', error);
      } finally {
        // Always ensure loading is set to false
        setLoading(false);
      }
    };
    
    // Initialize session
    initializeSession();
    
    // Clean up subscription when component unmounts
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      setLoading(true);
      
      const lowerEmail = email.toLowerCase();
      
      // First check if email exists in approved signups
      if (lowerEmail !== 'admin@admin.com' && lowerEmail !== 'test@user.com') {
        const { data: signupData, error: signupError } = await supabase
          .from('early_signups')
          .select('status')
          .eq('email', lowerEmail)
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
        email: lowerEmail,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      
      // Special handling for admin and test users
      if (lowerEmail === 'admin@admin.com') {
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
      
      const lowerEmail = email.toLowerCase();
      
      // Special case for admin login
      if (lowerEmail === 'admin@admin.com' && password === '@dmin1234') {
        // Create admin account if it doesn't exist
        const { data: checkData, error: checkError } = await supabase.auth.signInWithPassword({
          email: lowerEmail,
          password
        });
        
        if (checkError && checkError.message.includes('Invalid login credentials')) {
          // Create admin account
          const { data, error } = await supabase.auth.signUp({
            email: lowerEmail,
            password,
            options: {
              data: { parent_name: 'Admin' }
            }
          });
          
          if (error) throw error;
          
          // Sign in with newly created account
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: lowerEmail,
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
      if (lowerEmail === 'test@user.com' && password === 'testuser1@') {
        // Create test user account if it doesn't exist
        const { data: checkData, error: checkError } = await supabase.auth.signInWithPassword({
          email: lowerEmail,
          password
        });
        
        if (checkError && checkError.message.includes('Invalid login credentials')) {
          // Create test user account
          const { data, error } = await supabase.auth.signUp({
            email: lowerEmail,
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
            email: lowerEmail,
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
        email: lowerEmail,
        password
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      if (lowerEmail === 'admin@admin.com') {
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      // Add a small delay before navigation to allow auth state to update
      setTimeout(() => {
        navigate('/auth');
      }, 20);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut
  };
}
