
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkAdminStatus } from '@/utils/authUtils';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('Auth session hook initialized');
    
    let isMounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        // Update session and user state
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Check admin status when session changes
        if (newSession?.user) {
          const adminStatus = await checkAdminStatus(newSession.user);
          if (isMounted) setIsAdmin(adminStatus);
        } else {
          if (isMounted) setIsAdmin(false);
        }
        
        // Always update loading state after processing auth change
        if (isMounted) setLoading(false);
      }
    );
    
    // Check for existing session
    const initializeSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) setLoading(false);
          return;
        }
        
        console.log('Existing session check result:', existingSession?.user?.id);
        
        if (!isMounted) return;
        
        // Update state based on session
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        
        // Check admin status if user exists
        if (existingSession?.user) {
          const adminStatus = await checkAdminStatus(existingSession.user);
          if (isMounted) setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Exception checking session:', error);
      } finally {
        // Always ensure loading is set to false
        if (isMounted) setLoading(false);
      }
    };
    
    // Initialize session
    initializeSession();
    
    // Clean up subscription when component unmounts
    return () => {
      console.log('Cleaning up auth subscription');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
    isAdmin
  };
}
