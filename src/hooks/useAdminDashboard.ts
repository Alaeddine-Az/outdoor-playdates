
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
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setAdminCheckComplete(true);
        setLoading(false);
        return;
      }

      try {
        console.log("Checking admin status for user:", user.id);
        // Check if user is admin
        if (user.email === 'admin@example.com') {
          console.log("Admin email detected");
          setIsAdmin(true);
          setAdminCheckComplete(true);
        } else {
          const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
          if (error) {
            console.error('Error checking admin status:', error);
            throw error;
          }
          console.log("Admin check response:", data);
          setIsAdmin(!!data);
          setAdminCheckComplete(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdminCheckComplete(true);
        toast({
          title: 'Error checking permissions',
          description: 'Failed to verify your admin status.',
          variant: 'destructive',
        });
      }
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    const fetchPendingSignups = async () => {
      if (!isAdmin || !adminCheckComplete) return;

      setLoading(true);
      try {
        console.log("Fetching pending signups");
        // Fetch pending signups directly from the table instead of using RPC
        const { data, error } = await supabase
          .from('early_signups')
          .select('*')
          .eq('status', 'pending');

        if (error) throw error;
        
        console.log("Pending signups data:", data);
        
        // Cast the data to ensure type compatibility
        const typedData = (data || []).map(signup => ({
          ...signup,
          invited_at: signup.invited_at || null, // Initialize with null since it might not exist in old records
          status: (signup.status || 'pending') as 'pending' | 'approved' | 'rejected' | 'converted'
        })) as EarlySignup[];
        
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

    if (isAdmin && adminCheckComplete) {
      fetchPendingSignups();
    } else if (adminCheckComplete) {
      setLoading(false);
    }
  }, [isAdmin, adminCheckComplete]);

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
    adminCheckComplete,
    pendingSignups,
    handleApprove,
    handleReject
  };
}
