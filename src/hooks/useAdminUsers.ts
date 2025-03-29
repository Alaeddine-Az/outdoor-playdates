
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  role?: string;
  created_at: string;
  user_metadata?: {
    parent_name?: string;
    [key: string]: any;
  };
}

interface CreateUserData {
  email: string;
  password: string;
  parent_name?: string;
}

export function useAdminUsers() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const queryClient = useQueryClient();

  // Get the current auth token
  const getAuthToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      // Fixed: Use URL parameters instead of query object
      const response = await supabase.functions.invoke('admin-users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // The 'query' property doesn't exist, so we'll modify the URL directly
        body: { 
          page: currentPage,
          per_page: perPage
        }
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new user
  const createUser = async (userData: CreateUserData) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          email: userData.email,
          password: userData.password,
          user_metadata: {
            parent_name: userData.parent_name || '',
          },
        },
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  // Update user password
  const updateUserPassword = async ({ userId, password }: { userId: string; password: string }) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('admin-users', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          user_id: userId,
          password,
        },
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  };

  // Delete a user
  const deleteUser = async (userId: string) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('admin-users', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          user_id: userId,
        },
      });

      if (response.error) throw new Error(response.error.message);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // React Query hooks
  const usersQuery = useQuery({
    queryKey: ['adminUsers', currentPage, perPage],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: 'User created',
        description: 'User has been successfully created',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      toast({
        title: 'Password updated',
        description: 'User password has been successfully updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating password',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: 'User deleted',
        description: 'User has been successfully deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    users: usersQuery.data?.users || [],
    isLoading: usersQuery.isLoading || isLoading,
    error: usersQuery.error,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    createUser: createUserMutation.mutate,
    isCreatingUser: createUserMutation.isPending,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    isDeletingUser: deleteUserMutation.isPending,
  };
}
