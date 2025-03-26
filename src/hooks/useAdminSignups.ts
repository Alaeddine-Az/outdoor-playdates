import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAdminFunctions } from '@/hooks/useAdminFunctions';
import { EarlySignup } from '@/types/admin';

export function useAdminSignups() {
  const { approvePendingSignup, rejectPendingSignup } = useAdminFunctions();
  const [loading, setLoading] = useState(true);
  const [signups, setSignups] = useState<EarlySignup[]>([]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState<EarlySignup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    setLoading(true);
    try {
      // Fetch all early signups ordered by status (pending first) and then by creation date
      const { data, error } = await supabase
        .from('early_signups')
        .select('*')
        .order('status', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure type compatibility with EarlySignup
      const typedData = (data || []).map(signup => ({
        ...signup,
        invited_at: signup.invited_at || null,
        status: (signup.status || 'pending') as 'pending' | 'approved' | 'rejected' | 'converted'
      })) as EarlySignup[];
      
      setSignups(typedData);
    } catch (error) {
      console.error('Error fetching signups:', error);
      toast({
        title: 'Error loading signups',
        description: 'Failed to load early signups.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
    handleApprove,
    handleReject,
    handleCreateAccount,
    isModalOpen,
    selectedSignup,
    handleCloseModal,
    handleConfirmAccountCreation,
    isCreatingAccount,
    refreshSignups: fetchSignups
  };
}
