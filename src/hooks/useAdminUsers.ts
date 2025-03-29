
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
      return fetchUsers(currentPage, perPage)
        .finally(() => setIsLoading(false));
    },
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
