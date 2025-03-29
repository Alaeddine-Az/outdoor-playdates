
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { checkAdminStatus } from '@/utils/authUtils';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // First set up the auth state listener to handle changes in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, { sessionExists: !!newSession });
      
      if (!mounted) return;
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Check admin status when session changes
      if (newSession?.user) {
        const isUserAdmin = await checkAdminStatus(newSession.user);
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
    });

    // Then check for an existing session
    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Initial session check:', { sessionExists: !!data.session });
        
        if (!mounted) return;
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Check admin status if we have a user
        if (data.session?.user) {
          const isUserAdmin = await checkAdminStatus(data.session.user);
          setIsAdmin(isUserAdmin);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
    isAdmin,
  };
}
