import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAdminFunctions } from '@/hooks/useAdminFunctions';
import { EarlySignup } from '@/types/admin';

export function useAdminSignups() {
  const { approvePendingSignup, rejectPendingSignup } = useAdminFunctions();
  const [loading, setLoading] = useState(true);
  const [signups, setSignups] = useState<EarlySignup[]>([]);
  const [completedSignups, setCompletedSignups] = useState<EarlySignup[]>([]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState<EarlySignup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSignups = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching early signups...');
      
      // First try to fetch all signups at once
      const { data, error } = await supabase
        .from('early_signups')
        .select('*')
        .order('status', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      console.log('Signups data fetched:', data?.length || 0, 'records');
      
      // Cast the data to ensure type compatibility with EarlySignup
      const typedData = (data || []).map(signup => ({
        ...signup,
        invited_at: signup.invited_at || null,
        status: (signup.status || 'pending') as 'pending' | 'approved' | 'rejected' | 'converted' | 'onboarding_complete'
      })) as EarlySignup[];
      
      // Split the data into active and completed signups
      const active = typedData.filter(signup => signup.status !== 'onboarding_complete');
      const completed = typedData.filter(signup => signup.status === 'onboarding_complete');
      
      setSignups(active);
      setCompletedSignups(completed);
    } catch (error: any) {
      console.error('Error fetching signups:', error);
      toast({
        title: 'Error loading signups',
        description: 'Failed to load early signups.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignups();
  }, [fetchSignups]);

  const handleApprove = async (signupId: string) => {
    const result = await approvePendingSignup(signupId);
    if (result.success) {
      // Update the signup status without refetching
      setSignups(prevSignups => 
        prevSignups.map(signup => 
          signup.id === signupId ? { ...signup, status: 'approved', invited_at: new Date().toISOString() } : signup
        )
      );
      
      toast({
        title: 'Signup approved',
        description: 'The signup has been approved.',
      });
    }
  };

  const handleReject = async (signupId: string) => {
    const result = await rejectPendingSignup(signupId);
    if (result.success) {
      // Update the signup status without refetching
      setSignups(prevSignups => 
        prevSignups.map(signup => 
          signup.id === signupId ? { ...signup, status: 'rejected' } : signup
        )
      );
      
      toast({
        title: 'Signup rejected',
        description: 'The signup has been rejected.',
      });
    }
  };

  const handleMarkComplete = async (signupId: string) => {
    try {
      console.log('Marking signup as complete:', signupId);
      
      const { error } = await supabase
        .from('early_signups')
        .update({ status: 'onboarding_complete' })
        .eq('id', signupId);

      if (error) {
        console.error('Error updating signup status:', error);
        throw error;
      }

      // Find the signup that was marked as complete
      const completedSignup = signups.find(signup => signup.id === signupId);
      
      if (completedSignup) {
        // Remove from active signups
        setSignups(prevSignups => prevSignups.filter(signup => signup.id !== signupId));
        
        // Add to completed signups
        setCompletedSignups(prevCompleted => [
          { ...completedSignup, status: 'onboarding_complete' },
          ...prevCompleted
        ]);
      }
      
      toast({
        title: 'Onboarding complete',
        description: 'The signup has been marked as complete.',
      });
      
      return true;
    } catch (error) {
      console.error('Error marking signup as complete:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark signup as complete.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleCreateAccount = (signup: EarlySignup) => {
    setSelectedSignup(signup);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSignup(null);
  };

  const handleConfirmAccountCreation = async (signup: EarlySignup, password: string) => {
    setIsCreatingAccount(true);
    try {
      // Create a new user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signup.email,
        password: password,
        options: {
          data: {
            parent_name: signup.parent_name,
            location: signup.location,
            phone: signup.phone
          }
        }
      });

      if (authError) throw authError;

      // Mark the early signup as converted
      const { error: updateError } = await supabase
        .from('early_signups')
        .update({
          status: 'converted',
          converted_at: new Date().toISOString(),
          converted_user_id: authData.user?.id
        })
        .eq('id', signup.id);

      if (updateError) throw updateError;

      // Update the UI
      setSignups(prevSignups => 
        prevSignups.map(s => 
          s.id === signup.id ? { 
            ...s, 
            status: 'converted',
            converted_at: new Date().toISOString(),
            converted_user_id: authData.user?.id 
          } : s
        )
      );

      // Close the modal
      setIsModalOpen(false);
      setSelectedSignup(null);

      toast({
        title: 'Account created',
        description: `Account for ${signup.parent_name} was created successfully.`,
      });
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error creating account',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return {
    loading,
    signups,
    completedSignups,
    handleApprove,
    handleReject,
    handleMarkComplete,
    handleCreateAccount,
    isModalOpen,
    selectedSignup,
    handleCloseModal,
    handleConfirmAccountCreation,
    isCreatingAccount,
    refreshSignups: fetchSignups
  };
}
