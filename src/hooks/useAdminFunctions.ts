import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useAdminFunctions() {
  const [loading, setLoading] = useState(false);

  const approvePendingSignup = async (signupId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('early_signups')
        .update({
          status: 'approved',
          invited_at: new Date().toISOString()
        })
        .eq('id', signupId);

      if (error) throw error;

      toast({
        title: 'Signup approved',
        description: 'The user can now sign up with their email',
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error approving signup:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const rejectPendingSignup = async (signupId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('early_signups')
        .update({
          status: 'rejected'
        })
        .eq('id', signupId);

      if (error) throw error;

      toast({
        title: 'Signup rejected',
        description: 'The user signup request has been rejected',
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error rejecting signup:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const grantAdminRole = async (userId: string) => {
    setLoading(true);
    try {
      console.trace("🔥 INSERT to user_roles from useAdminFunctions.ts → grantAdminRole()", {
        userId,
        role: 'admin',
      });

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin',
        });

      if (error) throw error;

      toast({
        title: 'Admin role granted',
        description: 'User now has admin privileges',
      });

      console.log('✅ Admin role granted successfully to user:', userId);
      return { success: true };
    } catch (error: any) {
      console.error('Error granting admin role:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    approvePendingSignup,
    rejectPendingSignup,
    grantAdminRole
  };
}
