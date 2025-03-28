
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate('/admin');
      } else {
        // Make sure we navigate to exactly /dashboard
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
