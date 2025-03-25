
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAdminFunctions } from '@/hooks/useAdminFunctions';
import { EarlySignup } from '@/types/admin';

export function useAdminDashboard() {
  const { user } = useAuth();
  const { approvePendingSignup, rejectPendingSignup } = useAdminFunctions();
  const [loading, setLoading] = useState(true);
  const [pendingSignups, setPendingSignups] = useState<EarlySignup[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;

      try {
        // Check if user is admin
        if (user.email === 'admin') {
          setIsAdmin(true);
        } else {
          const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
          if (error) throw error;
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    const fetchPendingSignups = async () => {
      if (!isAdmin) return;

      setLoading(true);
      try {
        // Fetch pending signups
        const { data, error } = await supabase.rpc('get_pending_early_signups');

        if (error) throw error;
        
        // Cast the data to ensure type compatibility
        const typedData = (data || []).map(signup => ({
          ...signup,
          status: signup.status as 'pending' | 'approved' | 'rejected' | 'converted'
        }));
        
        setPendingSignups(typedData);
      } catch (error) {
        console.error('Error fetching pending signups:', error);
        toast({
          title: 'Error loading signups',
          description: 'Failed to load pending approval requests.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchPendingSignups();
    }
  }, [isAdmin]);

  const handleApprove = async (signupId: string) => {
    const result = await approvePendingSignup(signupId);
    if (result.success) {
      setPendingSignups(prevSignups => 
        prevSignups.filter(signup => signup.id !== signupId)
      );
    }
  };

  const handleReject = async (signupId: string) => {
    const result = await rejectPendingSignup(signupId);
    if (result.success) {
      setPendingSignups(prevSignups => 
        prevSignups.filter(signup => signup.id !== signupId)
      );
    }
  };

  return {
    user,
    loading,
    isAdmin,
    pendingSignups,
    handleApprove,
    handleReject
  };
}
