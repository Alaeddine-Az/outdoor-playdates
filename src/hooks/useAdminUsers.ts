
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { fetchUsers, createUser, updateUserPassword, deleteUser } from '@/services/adminUserService';
import { User, CreateUserData, UpdateUserPasswordData } from '@/types/admin-users';

export function useAdminUsers() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const queryClient = useQueryClient();

  // React Query hooks
  const usersQuery = useQuery({
    queryKey: ['adminUsers', currentPage, perPage],
    queryFn: () => {
      setIsLoading(true);
      console.log(`Fetching users with page=${currentPage}, perPage=${perPage}`);
      return fetchUsers(currentPage, perPage)
        .then(result => {
          console.log('Fetched users:', result);
          return result;
        })
        .catch(error => {
          console.error('Error in useAdminUsers query:', error);
          throw error;
        })
        .finally(() => setIsLoading(false));
    },
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30000, // 30 seconds
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
    onError: (error: any) => {
      toast({
        title: 'Error creating user',
        description: error.message || 'Failed to create user',
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
    onError: (error: any) => {
      toast({
        title: 'Error updating password',
        description: error.message || 'Failed to update password',
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
    onError: (error: any) => {
      toast({
        title: 'Error deleting user',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });

  const refreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
  };

  return {
    users: usersQuery.data?.users || [],
    isLoading: usersQuery.isLoading || isLoading,
    error: usersQuery.error ? (typeof usersQuery.error === 'string' ? usersQuery.error : 
           (usersQuery.error instanceof Error ? usersQuery.error.message : 'An unknown error occurred')) : null,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    refreshUsers,
    createUser: createUserMutation.mutate,
    isCreatingUser: createUserMutation.isPending,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    isDeletingUser: deleteUserMutation.isPending,
  };
}
