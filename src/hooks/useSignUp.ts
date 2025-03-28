
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return {
    signUp,
    loading
  };
}
