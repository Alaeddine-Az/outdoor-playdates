
import React, { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, Loader2 } from 'lucide-react';
import { CreateUserData } from '@/types/admin-users';

// Import the new components
import UserTable from './users/UserTable';
import CreateUserModal from './users/CreateUserModal';
import ChangePasswordModal from './users/ChangePasswordModal';
import DeleteUserModal from './users/DeleteUserModal';

const UserManagement: React.FC = () => {
  const {
    users,
    isLoading,
    error,
    createUser,
    isCreatingUser,
    updatePassword,
    isUpdatingPassword,
    deleteUser,
    isDeletingUser,
  } = useAdminUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);

  const handleCreateUser = (userData: CreateUserData) => {
    createUser(userData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleChangePassword = (password: string) => {
    if (selectedUser) {
      updatePassword(
        { userId: selectedUser.id, password },
        {
          onSuccess: () => {
            setIsPasswordModalOpen(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load users'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their access</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <UserTable 
              users={users}
              isLoading={isLoading}
              onChangePassword={(user) => {
                setSelectedUser(user);
                setIsPasswordModalOpen(true);
              }}
              onDeleteUser={(user) => {
                setSelectedUser(user);
                setIsDeleteModalOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateUserModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        isCreatingUser={isCreatingUser}
      />

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        isUpdatingPassword={isUpdatingPassword}
        userEmail={selectedUser?.email}
      />

      <DeleteUserModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        isDeletingUser={isDeletingUser}
        userEmail={selectedUser?.email}
      />
    </div>
  );
};

export default UserManagement;
