
import { useAuthSession } from './useAuthSession';
import { useSignUp } from './useSignUp';
import { useSignIn } from './useSignIn';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useAuthProvider() {
  const { session, user, loading, isAdmin } = useAuthSession();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      setSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });

      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign out failed',
        description: 'There was an error signing you out.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSigningOut(false);
    }
  };

  return {
    session,
    user,
    loading: loading || signingOut,
    isAdmin,
    signUp,
    signIn,
    signOut,
  };
}
