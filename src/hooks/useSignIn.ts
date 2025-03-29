
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { checkAdminStatus } from '@/utils/authUtils';

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const lowerEmail = email.toLowerCase();
      
      // Handle login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: lowerEmail,
        password
      });

      if (error) throw error;
      
      // Check if user is admin
      const isAdmin = await checkAdminStatus(data.user);
      
      toast({
        title: "Sign in successful",
        description: isAdmin ? "Welcome to the admin dashboard." : "Welcome to GoPlayNow!",
      });
      
      // Redirect based on admin status
      if (isAdmin) {
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

  return {
    signIn,
    loading
  };
}
