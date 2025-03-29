
import React from 'react';
import { User } from '@/types/admin-users';
import { Button } from '@/components/ui/button';
import { Key, Trash, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onChangePassword: (user: { id: string; email: string }) => void;
  onDeleteUser: (user: { id: string; email: string }) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onChangePassword,
  onDeleteUser,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users && users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                {user.user_metadata?.parent_name || 'Not specified'}
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChangePassword({ id: user.id, email: user.email })}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteUser({ id: user.id, email: user.email })}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6">
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;
