import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuthSession() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession();
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
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email?.endsWith('@admin.com') || false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
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
