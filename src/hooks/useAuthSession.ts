
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    console.info('Auth session hook initialized');

    const initializeSession = async () => {
      console.info('Checking for existing session');
      const { data, error } = await supabase.auth.getSession();
      
      console.info('Existing session check result:', { _type: typeof data?.session, value: typeof data?.session });
      
      const currentSession = data?.session ?? null;
      const currentUser = currentSession?.user ?? null;

      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentUser);
      setIsAdmin(currentUser?.email?.endsWith('@admin.com') || false);
      setLoading(false);
    };

    // Initial session fetch
    initializeSession();

    // Timeout fallback if Supabase hangs
    const fallbackTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth check timeout fallback triggered.');
        setLoading(false);
      }
    }, 5000);

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.info('Auth state changed:', _event, { _type: typeof newSession, value: typeof newSession });
      
      if (!isMounted) return;
      
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email?.endsWith('@admin.com') || false);
    });

    return () => {
      console.info('Cleaning up auth subscription');
      isMounted = false;
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return {
    session,
    user,
    loading,
    isAdmin,
  };
}
